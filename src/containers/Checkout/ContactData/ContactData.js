import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../../axios-orders';
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import Spinner from '../../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import classes from './ContactData.module.css';
import * as orderActionTypes from '../../../store/actions/index';

class ContactData extends Component {
	setOrderFormElements(elementType, type, placeholder, lengthValidation) {
		const data = {
			elementType: elementType,
			elementConfig: {
				type: type,
				placeholder: placeholder
			},
			value: '',
			validation: {
				required: true
			},
			valid: false,
			touched: false
		}
		if (lengthValidation) {
			data.validation['minLength'] = 5;
			data.validation['maxLength'] = 5;
		}
		return data;
	}

	state = {
		orderForm: {
			name: this.setOrderFormElements('input', 'text', 'Name', false),
			street: this.setOrderFormElements('input', 'text', 'Street', false),
			zipCode: this.setOrderFormElements('input', 'text', 'Zip Code', true),
			email: this.setOrderFormElements('input', 'email', 'Email', false),
			deliveryMethod: {
				elementType: 'select',
				elementConfig: {
					options: [
						{ value: 'fastest', displayValue: 'Fastest' },
						{ value: 'cheapest', displayValue: 'Cheapest' }
					]
				},
				value: 'fastest',
				validation: {},
				valid: true
			}
		},
		formIsValid: false
	}

	checkValidation(value, rules) {
		let isValid = true;

		if (rules.required) {
			isValid = value.trim() !== '' && isValid;
		}

		if (rules.minLength) {
			isValid = value.length >= rules.minLength && isValid;
		}

		if (rules.maxLength) {
			isValid = value.length <= rules.maxLength && isValid;
		}

		return isValid;
	}

	orderHandler = (event) => {
		event.preventDefault();
		const formData = {};
		for (let formElementIdentifier in this.state.orderForm) {
			formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
		}
		const order = {
			ingredients: this.props.ingredients,
			price: this.props.price,
			orderData: formData
		}
		console.log('props before burger order', this.props);
		console.log('order before sent to DB', order);
		this.props.onOrderBurger(order);
	}

	inputChangedHandler = (event, inputIdentifier) => {
		const updatedOrderForm = { ...this.state.orderForm };
		const updatedFormElement = { ...updatedOrderForm[inputIdentifier] };

		updatedFormElement.value = event.target.value;
		updatedFormElement.valid = this.checkValidation(updatedFormElement.value, updatedFormElement.validation);
		updatedFormElement.touched = true;
		updatedOrderForm[inputIdentifier] = updatedFormElement;

		let formIsValid = true;
		for (let inputIdentifier in updatedOrderForm) {
			formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
		}

		this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
	}

	render() {
		const formElementsArray = [];
		for (let key in this.state.orderForm) {
			formElementsArray.push({
				id: key,
				config: this.state.orderForm[key]
			});
		}


		let form = (
			<form onSubmit={this.orderHandler}>
				{formElementsArray.map(formElement => {
					return <Input
						key={formElement.id}
						elementType={formElement.config.elementType}
						elementConfig={formElement.config.elementConfig}
						value={formElement.config.value}
						invalid={!formElement.config.valid}
						shouldValidate={formElement.config.validation}
						touched={formElement.config.touched}
						changed={(event) => this.inputChangedHandler(event, formElement.id)}
					/>
				})}
				<Button buttonType="Success" clicked={this.orderHandler} disabled={!this.state.formIsValid}>ORDER</Button>
			</form>
		);
		if (this.props.loading) {
			form = <Spinner />
		}
		return (
			<div className={classes.ContactData}>
				<h4>Enter your contact data</h4>
				{form}
			</div>
		);
	}
}

const mapStateToProps = state => {
	console.log('order map state to props', state);
	return {
		ingredients: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		loading: state.order.loading
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onOrderBurger: (orderData) => dispatch(orderActionTypes.purchaseBurger(orderData))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));