import React, { Component } from 'react';

import axios from '../../../axios-orders';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.module.css';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {

	componentDidMount() {
		console.log(this.props);
	}
	setOrderFormElements(elementType, type, placeholder) {
		return (
			{
				elementType: elementType,
				elementConfig: {
					type: type,
					placeholder: placeholder
				},
				value: ''
			}
		);
	}

	state = {
		orderForm: {
			name: this.setOrderFormElements('input', 'text', 'Name'),
			street: this.setOrderFormElements('input', 'text', 'Street'),
			zipCode: this.setOrderFormElements('input', 'text', 'Zip Code'),
			email: this.setOrderFormElements('input', 'email', 'Email'),
			deliveryMethod: {
				elementType: 'select',
				elementConfig: {
					options: [
						{ value: 'fastest', displayValue: 'Fastest' },
						{ value: 'cheapest', displayValue: 'Cheapest' }
					]
				}
			}
		},
		loading: false
	}

	orderHandler = (event) => {
		event.preventDefault();
		this.setState({ loading: true });
		const formData = {};
		console.log(this.state);
		console.log(this.state.orderForm);
		for (let formElementIdentifier in this.state.orderForm) {
			formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
		}
		const order = {
			ingredients: this.props.ingredients,
			price: this.props.price,
			orderData: formData
		}
		console.log(order);
		axios.post('/orders.json', order).then(() => {
			this.setState({ loading: false });
			this.props.history.push('/');
		}).catch(() => {
			this.setState({ loading: false });
		});
	}

	inputChangedHandler = (event, inputIdentifier) => {
		const updatedOrderForm = { ...this.state.orderForm };
		const updatedFormElement = { ...updatedOrderForm[inputIdentifier] };

		updatedFormElement.value = event.target.value;
		updatedOrderForm[inputIdentifier] = updatedFormElement;
		this.setState({ orderForm: updatedOrderForm });
	}

	render() {
		const formElementsArray = [];
		for (let key in this.state.orderForm) {
			formElementsArray.push({
				id: key,
				config: this.state.orderForm[key]
			});
		}
		console.log(formElementsArray);


		let form = (
			<form onSubmit={this.orderHandler}>
				{formElementsArray.map(formElement => {
					return <Input
						key={formElement.id}
						elementType={formElement.config.elementType}
						elementConfig={formElement.config.elementConfig}
						value={formElement.config.value}
						changed={(event) => this.inputChangedHandler(event, formElement.id)}
					/>
				})}
				<Button buttonType="Success" clicked={this.orderHandler}>ORDER</Button>
			</form>
		);
		if (this.state.loading) {
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

export default ContactData;