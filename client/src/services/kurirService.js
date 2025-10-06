import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api"; 
  
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//Interceptor to use authorization token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) =>{
        return Promise.reject(error);
    }
)

//Interceptor to handle the token refresh
api.interceptors.response.use(
    (response) => response,
    async(error) => {
        const originalRequest = error.config;

        if(error.response?.status === 403 && !originalRequest._retry){
            originalRequest._retry = true;

            try{
                const refreshToken = localStorage.getItem('refreshToken');
                if(refreshToken){
                    const response = await axios.post(
                        `http://localhost:8080/auth/refresh-token`, 
                        { refreshToken }
                    );

                    const { accessToken } = response.data;
                    localStorage.setItem('accessToken', accessToken);

                    //Retry original request with the new token
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch(refreshError){
                //Refresh failed, redirect to login
                authService.logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

const calculateShipping = async (data) => {
  try {
    const response = await api.post('/shipping/calculate-shipping', data);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error calculating shipping:", error);
    throw error;
  }
};

const kurirService = {
  calculateShipping
};

export default kurirService;