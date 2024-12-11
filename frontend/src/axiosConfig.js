import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api', 
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            alert('Session expired. Please log in again.');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
