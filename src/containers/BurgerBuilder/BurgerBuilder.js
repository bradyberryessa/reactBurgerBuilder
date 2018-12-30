import React, { Component } from 'react';

import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Burger from '../../components/Burger/Burger';

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
		totalPrice: 4
	};

	addIngredientHandler = (type) => {
		const updatedCount = this.state.ingredients[type] + 1;
		const updatedIngredients = { ...this.state.ingredients };
		updatedIngredients[type] = updatedCount;

		const priceAddition = this.state.totalPrice + INGREDIENT_PRICES[type];

		this.setState({ ingredients: updatedIngredients, totalPrice: priceAddition })
	}

	removeIngredientHandler = (type) => {
		if (this.state.ingredients[type] <= 0) {
			return
		}
		const updatedIngredients = { ...this.state.ingredients };
		updatedIngredients[type] = this.state.ingredients[type] - 1;

		const priceDeduction = this.state.totalPrice - INGREDIENT_PRICES[type]

		this.setState({ ingredients: updatedIngredients, totalPrice: priceDeduction });
	}

	render() {
		const disabledInfo = { ...this.state.ingredients };
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		}
		console.log(disabledInfo);
		return (
			<>
				<Burger ingredients={this.state.ingredients} />
				<BuildControls
					ingredientAdded={this.addIngredientHandler}
					ingredientRemoved={this.removeIngredientHandler}
					disabled={disabledInfo}
				/>
				{this.state.totalPrice}
			</>
		);
	}
}

export default BurgerBuilder;