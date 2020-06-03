import axios from 'axios';

export default auth = axios.create({
    baseURL: 'https://memeclub.co/api/auth',
    headers: {
        'Content-Type': 'application/json',
    }
});