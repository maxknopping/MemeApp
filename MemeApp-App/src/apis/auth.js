import axios from 'axios';

export default auth = axios.create({
    baseURL: 'http://localhost:5000/api/auth',
    headers: {
        'Content-Type': 'application/json',
    }
});

//https://memeclub.co/api/auth
//http://localhost:5000/api/auth