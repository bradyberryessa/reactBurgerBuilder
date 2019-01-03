import React, { Component } from 'react';

import axios from '../../axios-orders';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Burger from '../../components/Burger/Burger';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7
}

class BurgerBuilder extends Component {
	state = {
		ingredients: null,
		totalPrice: 4,
		purchaseable: false,
		purchasing: false,
		loading: false
	};

	componentDidMount = async () => {
		const response = await axios.get('/ingredients.json');
		this.setState({ ingredients: response.data });
	}

	updatePurchaseState(ingredients) {
		const sum = Object.keys(ingredients)
			.map(ingredientKey => {
				return ingredients[ingredientKey]
			})
			.reduce((sum, element) => {
				return sum + element;
			}, 0);
		this.setState({ purchaseable: sum > 0 });
	}

	addIngredientHandler = (type) => {
		const updatedCount = this.state.ingredients[type] + 1;
		const updatedIngredients = { ...this.state.ingredients };
		updatedIngredients[type] = updatedCount;

		const priceAddition = this.state.totalPrice + INGREDIENT_PRICES[type];

		this.setState({ ingredients: updatedIngredients, totalPrice: priceAddition });
		this.updatePurchaseState(updatedIngredients);
	}

	removeIngredientHandler = (type) => {
		if (this.state.ingredients[type] <= 0) {
			return
		}
		const updatedIngredients = { ...this.state.ingredients };
		updatedIngredients[type] = this.state.ingredients[type] - 1;

		const priceDeduction = this.state.totalPrice - INGREDIENT_PRICES[type]

		this.setState({ ingredients: updatedIngredients, totalPrice: priceDeduction });
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
		for (let ingredient in this.state.ingredients) {
			queryParams.push(encodeURIComponent(ingredient) + '=' + encodeURIComponent(this.state.ingredients[ingredient]));
		}
		queryParams.push('price=' + this.state.totalPrice);
		const queryString = queryParams.join('&');
		this.props.history.push({
			pathname: '/checkout',
			search: `?${queryString}`
		});
	}

	render() {
		const disabledInfo = { ...this.state.ingredients };
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		}

		let orderSummary = null;
		let burger = <Spinner />

		if (this.state.ingredients) {
			burger = (
				<>
					<Burger ingredients={this.state.ingredients} />
					<BuildControls
						ingredientAdded={this.addIngredientHandler}
						ingredientRemoved={this.removeIngredientHandler}
						disabled={disabledInfo}
						purchaseable={this.state.purchaseable}
						ordered={this.purchaseHandler}
						price={this.state.totalPrice}
					/>
				</>
			);
			orderSummary = (
				<OrderSummary
					ingredients={this.state.ingredients}
					totalPrice={this.state.totalPrice}
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

export default withErrorHandler(BurgerBuilder, axios);