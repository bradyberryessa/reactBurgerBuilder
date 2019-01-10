import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';
import * as actions from '../../store/actions/index';

class Checkout extends Component {

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
			const purchasedRedirect = this.props.purchased ? <Redirect to="/" /> : null;
			summary = (
				<div>
					{purchasedRedirect}
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
		ingredients: state.burgerBuilder.ingredients,
		purchased: state.order.purchased
	};
};

export default connect(mapStateToProps)(Checkout);