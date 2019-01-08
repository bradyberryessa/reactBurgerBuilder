import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../axios-orders';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Burger from '../../components/Burger/Burger';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {
	state = {
		totalPrice: 4,
		purchasing: false,
		loading: false
	};

	componentDidMount = async () => {
		// const response = await axios.get('/ingredients.json');
		// this.setState({ ingredients: response.data });
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
		this.setState({ purchasing: true });
	}

	purchaseCancelHandler = () => {
		this.setState({ purchasing: false });
	}

	purchaseContinueHandler = () => {
		const queryParams = [];
		for (let ingredient in this.props.ingredients) {
			queryParams.push(encodeURIComponent(ingredient) + '=' + encodeURIComponent(this.props.ingredients[ingredient]));
		}
		queryParams.push('price=' + this.props.totalPrice);
		const queryString = queryParams.join('&');
		this.props.history.push({
			pathname: '/checkout',
			search: `?${queryString}`
		});
	}

	render() {
		const disabledInfo = { ...this.props.ingredients };
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		}

		let orderSummary = null;
		let burger = <Spinner />
		console.log(this.props);
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
		if (this.state.loading) {
			orderSummary = <Spinner />
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
	return { ingredients: state.ingredients, totalPrice: state.totalPrice };
};

const mapDispatchToProps = dispatch => {
	return {
		onIngredientAdded: (ingredientName) => dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: ingredientName }),
		onIngredientRemoved: (ingredientName) => dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingredientName })
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));