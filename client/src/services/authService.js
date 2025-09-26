import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    headers:{
        'Content-Type': 'application/json'
    },
})

// const api = axios.create({
//     baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
//     headers:{
//         'Content-Type': 'application/json'
//     },
// })

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
                        `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/auth/refresh-token`, { refreshToken }
                    );

                    const { accessToken } = response.data;
                    localStorage.setItem('accessToken', accessToken);

                    //Retry ori request with the new token
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch(refreshError){
                //Refresh failed, red to login
                authService.logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

const authService = {
    //login user
    async login(credentials){
        try{
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch(error){
            throw error;
        }
    },

    //Register
    async register(userData){
        try{
            const response = await api.post("/auth/register", userData);
            return response.data;
        } catch (error){
            throw error;
        }
    },

    // Get the user profile
    async getProfile(){
        try{
            const response = await api.get("/auth/profile");
            return response.data;
        } catch (error){
            throw error;
        }
    },

    async updateProfile(profileData){
        try {
            const response = await api.put('/auth/profile', profileData);
            return response.data;
        } catch(error){
            throw error;
        }
    },

    async logout(){
        try{
            const refreshToken = localStorage.getItem("refreshToken");
            if(refreshToken){
                await api.post('/auth/logout', {refreshToken});
            }
        } catch (error){
            console.error('Logout error: ', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    },

    //Check if user is authenticated
    isAuthenticated(){
        const token = localStorage.getItem('accessToken');
        const user = localStorage.getItem('user');
        return !!(token && user);
    },

    getCurrentUser() {
        const userStr = localStorage.getitem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.type === 'admin';
    },

    //Refreshing the token
    async refreshToken(){
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if(!refreshToken) {
                throw new Error('No refresh token available!');
            }

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL || "http://localhost:8080"}/auth/refresh-Token`, {refreshToken}
            );

            const {accessToken} = response.data;
            localStorage.setItem('accessToken', accessToken);
            return accessToken;
        } catch (error){
            this.logout();
            throw error;
        }
    }
}

export default authService;