import { useState } from "react";
import axios from "axios";
import authService from "../services/authService";

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Create axios instance with base URL
    const api = axios.create({
        baseURL: 'http://localhost:8080', // Adjust to your backend URL
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            if (isLogin) {
                // Login logic
                const data = await authService.login({username, password});

                // Store tokens in localStorage
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                
                // Store user data
                localStorage.setItem("user", JSON.stringify(data.user));

                setMessage("Login successful! Redirecting...");
                
                // Redirect to dashboard or home page after a short delay
                setTimeout(() => {
                    window.location.href = "/"; // or use React Router navigation
                }, 1500);

            } else {
                // Register logic
                const data = await authService.register({
                    username,
                    email,
                    password,
                    address: address || undefined, // Send undefined if empty
                    phoneNumber: phoneNumber || undefined
                });

                setMessage("Registration successful! Please login.");
                
                // Clear form and switch to login
                setUsername("");
                setEmail("");
                setPassword("");
                setAddress("");
                setPhoneNumber("");
                setIsLogin(true);
            }

        } catch (err) {
            console.error("Auth error:", err);
            
            // Handle different error types
            if (err.response && err.response.data && err.response.data.error) {
                setMessage(err.response.data.error);
            } else if (err.response && err.response.status === 500) {
                setMessage("Server error. Please try again later.");
            } else if (err.code === 'ECONNREFUSED') {
                setMessage("Unable to connect to server. Please check if the server is running.");
            } else {
                setMessage("Something went wrong. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setMessage("");
        setUsername("");
        setEmail("");
        setPassword("");
        setAddress("");
        setPhoneNumber("");
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
                    {isLogin ? "Login" : "Register"}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isLoading}
                    />

                    {!isLogin && (
                        <>
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            <input
                                type="text"
                                placeholder="Address (optional)"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                disabled={isLoading}
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number (optional)"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                disabled={isLoading}
                            />
                        </>
                    )}

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        minLength="6"
                    />

                    <button
                        type="submit"
                        className={`w-full rounded-lg py-2 text-white transition-colors ${
                            isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading 
                            ? (isLogin ? "Logging in..." : "Registering...") 
                            : (isLogin ? "Login" : "Register")
                        }
                    </button>
                </form>

                {message && (
                    <div className={`mt-4 p-3 rounded-lg text-center text-sm ${
                        message.includes('successful') 
                            ? 'bg-green-100 text-green-700 border border-green-300' 
                            : 'bg-red-100 text-red-700 border border-red-300'
                    }`}>
                        {message}
                    </div>
                )}

                <p className="mt-6 text-center text-sm text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        type="button"
                        onClick={toggleMode}
                        className="text-blue-600 hover:underline font-medium"
                        disabled={isLoading}
                    >
                        {isLogin ? "Register here" : "Login here"}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;