import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () => {
	return { type: actionTypes.AUTH_START };
};

export const authSuccess = (token, userId) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		idToken: token,
		userId: userId
	};
};

export const authFail = (error) => {
	return {
		type: actionTypes.AUTH_FAIL,
		error: error
	};
};

export const auth = (email, password, isSignup) => {
	return dispatch => {
		dispatch(authStart());

		const authData = {
			email: email,
			password: password,
			returnSecureToken: true
		};
		console.log(authData);
		let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyB4PIt3xYS3-aox2mlv5zUEM9tmGbdNw0w';
		if (!isSignup) {
			url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyB4PIt3xYS3-aox2mlv5zUEM9tmGbdNw0w';
		}
		axios.post(url, authData)
			.then(response => {
				console.log(response);
				dispatch(authSuccess(response.data.idToken, response.data.localId));
			})
			.catch(error => {
				console.log(error);
				console.log(error.response.data.message);
				dispatch(authFail(error.response.data.error));
			});
	};
};