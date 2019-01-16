import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../axios-orders';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Burger from '../../components/Burger/Burger';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions';

class BurgerBuilder extends Component {
	state = {
		totalPrice: 4,
		purchasing: false
	};

	componentDidMount = () => {
		this.props.onInitIngredients();
	}

	updatePurchaseState(ingredients) {
		const sum = Object.keys(ingredients)
			.map(ingredientKey => {
				return ingredients[ingredientKey]
			})
			.reduce((sum, element) => {
				return sum + element;
			}, 0);
		return sum > 0;
	}

	addIngredientHandler = (type) => {
		const updatedCount = this.props.ingredients[type] + 1;
		const updatedIngredients = { ...this.props.ingredients };
		updatedIngredients[type] = updatedCount;

		this.updatePurchaseState(updatedIngredients);
	}

	removeIngredientHandler = (type) => {
		if (this.props.ingredients[type] <= 0) {
			return
		}
		const updatedIngredients = { ...this.props.ingredients };
		updatedIngredients[type] = this.props.ingredients[type] - 1;

		this.updatePurchaseState(updatedIngredients);
	}

	purchaseHandler = () => {
		if (this.props.isAuthenticated) {
			this.setState({ purchasing: true });
		} else {
			this.props.onSetAuthRedirectPath('/checkout');
			this.props.history.push('/auth');
		}
	}

	purchaseCancelHandler = () => {
		this.setState({ purchasing: false });
	}

	purchaseContinueHandler = () => {
		this.props.onInitPurchase();
		this.props.history.push('/checkout');
	}

	render() {
		const disabledInfo = { ...this.props.ingredients };
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		}

		let orderSummary = null;
		let burger = this.props.error ? <p>Ingredients failed to load!</p> : <Spinner />
		if (this.props.ingredients) {
			burger = (
				<>
					<Burger ingredients={this.props.ingredients} />
					<BuildControls
						ingredientAdded={this.props.onIngredientAdded}
						ingredientRemoved={this.props.onIngredientRemoved}
						disabled={disabledInfo}
						purchaseable={this.updatePurchaseState(this.props.ingredients)}
						ordered={this.purchaseHandler}
						isAuthenticated={this.props.isAuthenticated}
						price={this.props.totalPrice}
					/>
				</>
			);
			orderSummary = (
				<OrderSummary
					ingredients={this.props.ingredients}
					totalPrice={this.props.totalPrice}
					purchaseCancelled={this.purchaseCancelHandler}
					purchaseContinue={this.purchaseContinueHandler} />
			);
		}
		return (
			<>
				<Modal
					show={this.state.purchasing}
					modalClosed={this.purchaseCancelHandler}>
					{orderSummary}
				</Modal>
				{burger}
			</>
		);
	}
}

const mapStateToProps = state => {
	return {
		ingredients: state.burgerBuilder.ingredients,
		totalPrice: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error,
		isAuthenticated: state.auth.token !== null
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onIngredientAdded: (ingredientName) => dispatch(actions.addIngredient(ingredientName)),
		onIngredientRemoved: (ingredientName) => dispatch(actions.removeIngredient(ingredientName)),
		onInitIngredients: () => dispatch(actions.initIngredients()),
		onInitPurchase: () => dispatch(actions.purchaseInit()),
		onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));