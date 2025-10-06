import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    headers:{
        'Content-Type': 'application/json'
    },
})

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

    // FIXED: Changed getitem to getItem (capital I)
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
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

            // FIXED: Changed refresh-Token to refresh-token
            const response = await axios.post(
                `http://localhost:8080/auth/refresh-token`, 
                {refreshToken}
            );

            const {accessToken} = response.data;
            localStorage.setItem('accessToken', accessToken);
            return accessToken;
        } catch (error){
            this.logout();
            throw error;
        }
    },

    // Verify email with OTP
    async verifyEmail(data) {
        try {
            const response = await axios.post(`http://localhost:8080/auth/verify-email`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Resend OTP
    async resendOTP(data) {
        try {
            const response = await axios.post(`http://localhost:8080/auth/resend-otp`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Address management
    async getAddresses() {
        try {
            const response = await api.get('/auth/addresses');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async addAddress(addressData) {
        try {
            const response = await api.post('/auth/addresses', addressData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateAddress(addressId, addressData) {
        try {
            const response = await api.put(`/auth/addresses/${addressId}`, addressData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async deleteAddress(addressId) {
        try {
            const response = await api.delete(`/auth/addresses/${addressId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Location data
    async getProvinces() {
        try {
            const response = await axios.get('http://localhost:8080/auth/provinces');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getCities(provinceId) {
        try {
            const response = await axios.get(`http://localhost:8080/auth/provinces/${provinceId}/cities`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getDistricts(cityId) {
        try {
            const response = await axios.get(`http://localhost:8080/auth/cities/${cityId}/districts`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async uploadProfileImage(formData) {
        try {
            const response = await api.post('/auth/upload-profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Token validation method
    async validateToken() {
        try {
            const response = await api.get('/auth/profile');
            return { valid: true, user: response.data.user };
        } catch (error) {
            if (error.response?.status === 403 || error.response?.status === 401) {
                return { valid: false, user: null };
            }
            throw error; // Re-throw other errors
        }
    }
}

export default authService;