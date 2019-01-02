import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://react-my-burger-e5a1c.firebaseio.com/'
});

export default instance;