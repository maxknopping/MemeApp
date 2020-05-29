import axios from 'axios';

export default auth = axios.create({
    baseURL: 'http://memeclub.co/api/auth',
    headers: {
        'Content-Type': 'application/json',
    }
});