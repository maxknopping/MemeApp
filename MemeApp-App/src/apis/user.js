import axios from 'axios';
import {Context} from './../context/AuthContext';
import {useContext} from 'react';
import { AsyncStorage } from 'react-native';

export default userService = axios.create({
    baseURL: 'https://memeclub.co/api/users',
    headers: {
        'Content-Type': 'application/json',
    }
});