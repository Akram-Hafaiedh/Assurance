import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const useAxiosInstance = () =>{
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

    const axiosInstance = axios.create({
        baseURL: apiUrl
    });
    
    axiosInstance.interceptors.request.use((config)=>{
        const token = localStorage.getItem('token');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    })
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) =>{
            if(error.response && error.response.status === 401){
                localStorage.removeItem('token');
                console.log('Token expired. Please login again.');
                navigate('/login');
            }
            return Promise.reject(error);
        }
    )
    return axiosInstance;
}




export default useAxiosInstance