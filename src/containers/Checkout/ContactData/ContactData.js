import React, { Component } from 'react';

import axios from '../../../axios-orders';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.module.css';

class ContactData extends Component {
	state = {
		name: '',
		email: '',
		address: {
			street: '',
			postalCode: ''
		},
		loading: false
	}

	orderHandler = (event) => {
		event.preventDefault();
		this.setState({ loading: true });
		const order = {
			ingredients: this.props.ingredients,
			price: this.props.totalPrice,
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
		axios.post('/orders.json', order).then(() => {
			this.setState({ loading: false });
			this.props.history.push('/');
		}).catch(() => {
			this.setState({ loading: false });
		});
	}

	render() {
		let form = (
			<form>
				<input className={classes.Input} type="text" name="name" placeholder="Your Name" />
				<input className={classes.Input} type="email" name="email" placeholder="Your Email" />
				<input className={classes.Input} type="text" name="street" placeholder="Your street" />
				<input className={classes.Input} type="text" name="postal" placeholder="Your Postal Code" />
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