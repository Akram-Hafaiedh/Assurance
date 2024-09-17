import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';  // Import the utility

const useAxiosInstance = () => {
    const navigate = useNavigate();
    const instance = axiosInstance();

    // Attach navigation logic to token expiration
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                console.log('Token expired. Redirecting to login.');
                navigate('/login');  // Use React Router's navigate to redirect
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

export default useAxiosInstance;