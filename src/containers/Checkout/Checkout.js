import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
	state = {
		ingredients: {
			salad: 1,
			meat: 1,
			bacon: 1,
			cheese: 1
		},
		price: 0
	}

	componentWillMount() {
		const query = new URLSearchParams(this.props.location.search);
		const ingredients = {};
		let price = 0;
		for (let param of query.entries()) {
			if (param[0] === 'price') {
				price = param[1];
			} else {
				ingredients[param[0]] = +param[1];
			}
		}
		this.setState({ ingredients: ingredients, price: price });
	}

	checkoutCancelledHandler = () => {
		this.props.history.goBack();
	}

	checkoutContinuedHandler = () => {
		this.props.history.replace('/checkout/contact-data')
	}

	render() {
		console.log(this.props);
		let summary = <Redirect to="/" />
		if (this.props.ingredients) {
			summary = (
				<div>
					<CheckoutSummary
						ingredients={this.props.ingredients}
						checkoutCancelled={this.checkoutCancelledHandler}
						checkoutContinued={this.checkoutContinuedHandler} />
					<Route
						path={this.props.match.url + '/contact-data'}
						component={ContactData} />
				</div>
			);
		}
		return summary;
	}
}

const mapStateToProps = state => {
	return {
		ingredients: state.burgerBuilder.ingredients
	};
};

export default connect(mapStateToProps)(Checkout);