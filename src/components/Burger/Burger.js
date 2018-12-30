import React from 'react';

import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = props => {
	let ingredientsArray = Object.keys(props.ingredients)
		.map(ingredientKey => {
			return [...Array(props.ingredients[ingredientKey])].map((_, i) => {
				return <BurgerIngredient key={ingredientKey + i} type={ingredientKey} />
			});
		})
		.reduce((array, element) => {
			return array.concat(element)
		}, []);
	if (ingredientsArray.length === 0) {
		ingredientsArray = <p>Please start adding ingredients!</p>;
	}
	return (
		<div className={classes.Burger}>
			<BurgerIngredient type="bread-top" />
			{ingredientsArray}
			<BurgerIngredient type="bread-bottom" />
		</div>
	);
};

export default burger;