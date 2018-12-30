import React from 'react';

import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = props => {
	console.log(Object.keys(props.ingredients));
	const ingredientsArray = Object.keys(props.ingredients)
		.map(ingredientKey => {
			return [...Array(props.ingredients[ingredientKey])].map((_, i) => {
				return <BurgerIngredient key={ingredientKey + i} type={ingredientKey} />
			});
		});

	return (
		<div className={classes.Burger}>
			<BurgerIngredient type="bread-top" />
			{ingredientsArray}
			<BurgerIngredient type="bread-bottom" />
		</div>
	);
};

export default burger;