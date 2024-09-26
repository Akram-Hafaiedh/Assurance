import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const useAxiosInstance = () => {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

    // Create Axios instance with base URL
    const axiosInstance = axios.create({
        baseURL: apiUrl
    });

    // Request interceptor to attach access token
    axiosInstance.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    })
    // Response interceptor to handle token expiration and refresh logic
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true; // Prevent infinite retry loops

                // Call backend API for token refresh
                try {
                    const response = await axios.post(`${apiUrl}/auth/refresh`, {
                        withCredentials: true,
                    });
                    const newAccessToken = response.data.data.token;
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    if (response.data.status === 200) {
                        localStorage.setItem('token', response.data.data.token);
                        originalRequest.headers.Authorization = `Bearer ${response.data.data.token}`;
                        return axiosInstance(originalRequest);
                    }
                } catch (refreshError) {
                    localStorage.removeItem('token');
                    console.log('Token expired. Please login again.', refreshError);
                    navigate('/login');
                }
            }
            return Promise.reject(error);
        }
    )
    return axiosInstance;
}




export default useAxiosInstance