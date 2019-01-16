import React, { Component } from 'react';
import { connect } from 'react-redux';

import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import classes from './Layout.module.css';

class Layout extends Component {
	state = {
		showSideDrawer: false
	}

	sideDrawerClosedHandler = () => {
		this.setState({ showSideDrawer: false })
	}

	sideDrawerToggleHandler = () => {
		this.setState((previousState) => {
			return { showSideDrawer: !previousState.showSideDrawer }
		});
	}

	render() {
		return (
			<>
				<Toolbar
					drawerToggleClicked={this.sideDrawerToggleHandler}
					isAuthenticated={this.props.isAuthenticated} />
				<SideDrawer
					isAuthenticated={this.props.isAuthenticated}
					open={this.state.showSideDrawer}
					closed={this.sideDrawerClosedHandler} />
				<main className={classes.Content}>
					{this.props.children}
				</main>
			</>
		);
	}
};

const mapStateToProps = state => {
	return {
		isAuthenticated: state.auth.token !== null
	};
};

export default connect(mapStateToProps)(Layout);