import {LOGIN_USER, REGISTER_USER} from './types';
import axios from 'axios';

export function registerUser(submitData) {
    const request = axios.post('/api/users/register', submitData).then((response) => response.data);

    return {
        type: REGISTER_USER,
        payload: request,
    };
}

export function loginUser(submitData) {
    const request = axios.post('/api/users/login', submitData)
        .then(response => response.data)
    return {
        type: LOGIN_USER,
        payload: request
    }
}
