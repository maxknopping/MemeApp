import createDataContext from './createDataContext';
import auth from './../apis/auth';
import {AsyncStorage} from 'react-native';
import {navigate} from './../helpers/navigationRef';
import authFrisbee from './../apis/authFrisbee';

const authReducer = (state, action) => {
    switch(action.type) {
        case 'add_error':
            return {...state, errorMessage: action.payload};
        case 'signin':
            return {token: action.payload.token, id: action.payload.id, username: action.payload.username, errorMessage: ''};
        case 'signout':
            return {token: null, id: 0, username: '', errorMessage: null};
        case 'changeUsername':
            return {...state, username: action.payload};
        case 'changePassword':
            return {...state};
        default: 
            return state;
    }
};

const tryLocalSignIn = (dispatch) => async () => {
    try {
    const username = await AsyncStorage.getItem('username');
    const password = await AsyncStorage.getItem('password');
    if (username && password) {
        const response = await auth.post('/login', {username: username, password: password});
        dispatch({type:'signin', payload: {token: response.data.token, 
            id: response.data.user.id, username: response.data.user.username}});
        await AsyncStorage.setItem('token', response.data.token);
        navigate('Feed');
    } else {
        navigate('SignIn');
    }
    } catch (err) {
        navigate('SignIn');
    }
};

const signup = (dispatch) => {
    return async ({username, email, password, name}) => {
        try {
        await auth.post('/register', {username: username, name: name, email: email, password: password})
            .then(async function (registerResponse) {
                const response = await auth.post('/login', {username: registerResponse.data.username, password: password});
                await AsyncStorage.setItem('token', response.data.token);
                await AsyncStorage.setItem('username', username);
                await AsyncStorage.setItem('password', password);
                dispatch({type:'signin', payload: {token: response.data.token, 
                    id: response.data.user.id, username: response.data.user.username}});
                navigate('Feed');
            });
        } catch (err) {
            dispatch({type:'add_error', payload: err.response.data});
            console.log(err);
        }
    };
};

const signin = (dispatch) => async ({username, password}) => {
        try {
            const response = await auth.post('/login', {username: username, password: password});
            //const response = await authFrisbee.post('/api/auth/login', {username, password});
            await AsyncStorage.setItem('token', response.data.token);
            await AsyncStorage.setItem('username', username);
            await AsyncStorage.setItem('password', password);
            dispatch({type:'signin', payload: {token: response.data.token, 
                id: response.data.user.id, username: response.data.user.username}});
            navigate('Feed');
        } catch (err) {
            dispatch({type:'add_error', payload:'Incorrect Username or Password'});
            console.log(err);
        }
    };

const signout = (dispatch) => async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('password');
        dispatch({type: 'signout'});
        navigate('authFlow');
}

const changeUsername = (dispatch) => async ({newUsername}) => {
    await AsyncStorage.setItem('username', newUsername);
    dispatch({type: 'changeUsername', payload: newUsername});
}

const changePassword = (dispatch) => async ({newPassword}) => {
    await AsyncStorage.setItem('password', newPassword);
    dispatch({type: 'changePassword', payload: newPassword});
}

export const {Context, Provider} = createDataContext(authReducer, {signin, changeUsername, changePassword, signout, signup, tryLocalSignIn},
     {token: null, id: 0, username: '', errorMessage: null});