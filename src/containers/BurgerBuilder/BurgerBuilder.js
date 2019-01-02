import React, { Component } from 'react';
import axios from '../../axios-orders';

import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Burger from '../../components/Burger/Burger';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7
}

class BurgerBuilder extends Component {
	state = {
		ingredients: {
			salad: 0,
			bacon: 0,
			cheese: 0,
			meat: 0
		},
		totalPrice: 4,
		purchaseable: false,
		purchasing: false
	};

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

	purchaseContinueHandler = async () => {
		const order = {
			ingredients: this.state.ingredients,
			price: this.state.totalPrice,
			customer: {
				name: 'Brady Berryessa',
				address: {
					street: '320 N 500 East',
					city: 'American Fork',
					zipCode: '84003'
				},
				email: 'test@test.com'
			},
			deliveryMethod: 'fastest'
		}
		const response = await axios.post('/orders.json', order)
			.catch(error => console.log(error));
		console.log(response);
	}

	render() {
		const disabledInfo = { ...this.state.ingredients };
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		}
		return (
			<>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
					<OrderSummary
						ingredients={this.state.ingredients}
						totalPrice={this.state.totalPrice}
						purchaseCancelled={this.purchaseCancelHandler}
						purchaseContinue={this.purchaseContinueHandler} />
				</Modal>
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
	}
}

export default BurgerBuilder;