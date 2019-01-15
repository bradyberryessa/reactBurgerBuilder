import * as actionTypes from '../actions/actionTypes';

const reducer = (state = initalState, action) => {
	switch (action.type) {
		case actionTypes.AUTH_START:
			return { ...state, isLoading: true }
		case actionTypes.AUTH_SUCCESS:
			return { ...state, isLoading: false };
		case actionTypes.AUTH_FAIL:
			return {
				...state,
				error: action.error,
				loading: false
			}
		default:
			return state;
	}
};

export default reducer;