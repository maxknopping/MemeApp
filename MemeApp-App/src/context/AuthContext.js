import createDataContext from './createDataContext';
import auth from './../apis/auth';
import {AsyncStorage, Platform} from 'react-native';
import {navigate} from './../helpers/navigationRef';
import authFrisbee from './../apis/authFrisbee';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

const authReducer = (state, action) => {
    switch(action.type) {
        case 'add_error':
            return {...state, errorMessage: action.payload};
        case 'signin':
            return {token: action.payload.token, id: action.payload.id, username: action.payload.username, expoPushToken: action.payload.expoPushToken, errorMessage: '', 
                    isAdmin: action.payload.isAdmin};
        case 'signout':
            return {token: null, id: 0, username: '', errorMessage: null, expoPushToken: null, isAdmin: false};
        case 'changeUsername':
            return {...state, username: action.payload};
        case 'changePassword':
            return {...state};
        case 'banned':
            return {...state, banEnds: action.payload}
        default: 
            return state;
    }
};

const tryLocalSignIn = (dispatch) => async () => {
    try {
    const username = await AsyncStorage.getItem('username');
    const password = await AsyncStorage.getItem('password');
    if (username && password) {
        const response = await auth.post('/login?isIos=true', {username: username, password: password});
        let pushToken;
            if (response.data.pushToken == null) {
                pushToken = await registerForNotifications(response.data.user.id);
                //await AsyncStorage.setItem('pushToken', pushToken);
            } else {
                //await AsyncStorage.setItem('pushToken', pushToken);
            }
        dispatch({type:'signin', payload: {token: response.data.token, 
            id: response.data.user.id, username: response.data.user.username, expoPushToken: 
            response.data.pushToken == null ? pushToken : response.data.pushToken, isAdmin: response.data.user.isAdmin}});
        await AsyncStorage.setItem('token', response.data.token);
        if (Platform.OS === 'ios') {
            Notifications.setBadgeCountAsync(0);
        }
        if (response.data.user.isBanned) {
            dispatch({type: 'banned', payload: response.data.user.banEnds});
            //navigate('Banned');
            return 'Banned';
        } else {
            //navigate('Feed');
            return 'Feed';
        }
    } else {
        //navigate('SignIn');
        return 'SignIn';
    }
    } catch (err) {
        //navigate('SignIn');
        return 'SignIn';
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
                const pushToken = await registerForNotifications(registerResponse.data.id);
                //await AsyncStorage.setItem('pushToken', pushToken);
                dispatch({type:'signin', payload: {token: response.data.token,
                    id: response.data.user.id, username: response.data.user.username, expoPushToken: pushToken, isAdmin: response.data.user.isAdmin}});
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
            const response = await auth.post(`/login?isIos=true`, {username: username, password: password});
            //const response = await authFrisbee.post('/api/auth/login', {username, password});
            await AsyncStorage.setItem('token', response.data.token);
            await AsyncStorage.setItem('username', username);
            await AsyncStorage.setItem('password', password);
            let pushToken;
            if (response.data.pushToken == null) {
                pushToken = await registerForNotifications(response.data.user.id);
                //await AsyncStorage.setItem('pushToken', pushToken);
            }
            dispatch({type:'signin', payload: {token: response.data.token, 
                id: response.data.user.id, username: response.data.user.username, expoPushToken: 
                response.data.pushToken == null ? pushToken : response.data.pushToken, isAdmin: response.data.user.isAdmin}});
            if (Platform.OS === 'ios') {
                Notifications.setBadgeCountAsync(0);
            }
            console.log(response.data.user);
            if (response.data.user.isBanned) {
                dispatch({type: 'banned', payload: response.data.user.banEnds});
                navigate('Banned');
            } else {
                navigate('Feed');
            }
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

const registerForNotifications = async (id) => {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          return;
        }
        token = await Notifications.getExpoPushTokenAsync().catch(err => console.log(error));
 
        
      }
  
      if (Platform.OS === 'android') {
        Notifications.createChannelAndroidAsync('default', {
          name: 'MemeClub',
          sound: true,
          priority: 'max',
          vibrate: [0, 250, 250, 250],
        });
      }

    try {
        if (Constants.isDevice) {
            auth.post(`/pushToken/${id}`, {
                pushToken: token
            }).catch(error => console.log(error));
        }
    } catch (err){
        console.log(err);
    }
    

    return token;
};

export const {Context, Provider} = createDataContext(authReducer, {signin, changeUsername, changePassword, signout, signup, tryLocalSignIn},
     {token: null, id: 0, username: '', errorMessage: null, expoPushToken: null, isAdmin: false});