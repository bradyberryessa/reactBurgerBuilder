import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import Logout from './containers/Auth/Logout/Logout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Layout from './hoc/Layout/Layout';
import * as actions from './store/actions';
import Spinner from '../src/components/UI/Spinner/Spinner';

const auth = React.lazy(() => import('./containers/Auth/Auth'));
const orders = React.lazy(() => import('./containers/Checkout/Orders/Orders'));
const checkout = React.lazy(() => import('./containers/Checkout/Checkout'));

class App extends Component {
	componentDidMount() {
		this.props.onTryAutoSignup();
	}

	render() {
		let routes = (
			<Suspense fallback={<Spinner />}>
				<Switch>
					<Route path="/auth" component={auth} />
					<Route path="/" component={BurgerBuilder} />
					<Redirect to="/" />
				</Switch>
			</Suspense>
		);

		if (this.props.isAuthenticated) {
			routes = (
				<Suspense fallback={<Spinner />}>
					<Switch>
						<Route path="/checkout" component={checkout} />
						<Route path="/orders" component={orders} />
						<Route path="/logout" component={Logout} />
						<Route path="/auth" component={auth} />
						<Route path="/" component={BurgerBuilder} />
						<Redirect to="/" />
					</Switch>
				</Suspense>
			);
		}

		return (
			<div>
				<Layout>
					{routes}
				</Layout>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		isAuthenticated: state.auth.token !== null
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onTryAutoSignup: () => dispatch(actions.authCheckState())
	};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
