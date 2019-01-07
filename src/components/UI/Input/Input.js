import React from 'react';

import classes from './Input.module.css';

const input = props => {
	let inputElement = null;
	const inputClasses = [classes.InputElement];

	console.log(props.invalid, props.shouldValidate, props.touched);
	if (props.invalid && props.shouldValidate && props.touched) {
		inputClasses.push(classes.Invalid);
	}

	switch (props.elementType) {
		case 'input':
			inputElement = <input
				className={inputClasses.join(' ')}
				{...props.elementConfig}
				value={props.value}
				onChange={props.changed} />
			break;
		case 'textarea':
			inputElement = <textarea
				className={inputClasses.join(' ')}
				{...props.elementConfig}
				value={props.value}
				onChange={props.changed} />
			break;
		case 'select':
			inputElement = (
				<select
					className={inputClasses.join(' ')}
					{...props.elementConfig}
					value={props.value}
					onChange={props.changed}>
					{props.elementConfig.options.map(option => {
						return <option key={option.value} value={option.value}>{option.displayValue}</option>;
					})}
				</select>
			);
			break;
		default:
			inputElement = <input
				className={inputClasses.join(' ')}
				{...props.elementConfig}
				value={props.value}
				onChange={props.changed} />
			break;
	}

	let validationError = null;
	if (props.invalid && props.touched) {
		validationError = <p className={classes.ValidationError}>Please enter a valid value!</p>;
	}

	return (
		<div className={classes.Input}>
			<label className={classes.Label}>{props.label}</label>
			{inputElement}
			{validationError}
		</div>
	);
}

export default input;