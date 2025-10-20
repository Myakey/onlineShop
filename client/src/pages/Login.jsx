
import { useState } from "react";
import { User, Lock, Mail, Phone, UserCircle } from "lucide-react";
import authService from "../services/authService";

function Login() {
    const [currentStep, setCurrentStep] = useState('auth'); // 'auth' | 'verify-email'
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: ""
    });
    const [otpCode, setOtpCode] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [registrationEmail, setRegistrationEmail] = useState("");

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            if (isLogin) {
                // Login logic
                const data = await authService.login({
                    username: formData.username,
                    password: formData.password
                });

                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                localStorage.setItem("user", JSON.stringify(data.user));

                setMessage("Login successful! Redirecting...");
                setTimeout(() => {
                    window.location.href = "/";
                }, 1500);

            } else {
                // Register logic
                const data = await authService.register({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phoneNumber: formData.phoneNumber
                });

                setRegistrationEmail(formData.email);
                setCurrentStep('verify-email');
                setMessage("Registration successful! Please check your email for the verification code.");
            }

        } catch (err) {
            console.error("Auth error:", err);
            
            if (err.response?.data?.requiresVerification) {
                setRegistrationEmail(err.response.data.email);
                setCurrentStep('verify-email');
                setMessage("Please verify your email before logging in. Check your inbox for the verification code.");
            } else if (err.response?.data?.error) {
                setMessage(err.response.data.error);
            } else if (err.response?.status === 500) {
                setMessage("Server error. Please try again later.");
            } else {
                setMessage("Something went wrong. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            const data = await authService.verifyEmail({
                email: registrationEmail,
                otp: otpCode
            });

            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("user", JSON.stringify(data.user));

            setMessage("Email verified successfully! Redirecting...");
            setTimeout(() => {
                window.location.href = "/";
            }, 1500);

        } catch (err) {
            console.error("Verification error:", err);
            setMessage(err.response?.data?.error || "Verification failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setIsLoading(true);
        try {
            await authService.resendOTP({ email: registrationEmail });
            setMessage("New verification code sent! Please check your email.");
        } catch (err) {
            setMessage(err.response?.data?.error || "Failed to resend code. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const resetToAuth = () => {
        setCurrentStep('auth');
        setOtpCode("");
        setRegistrationEmail("");
        setMessage("");
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setMessage("");
        setFormData({
            username: "",
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            phoneNumber: ""
        });
    };

    if (currentStep === 'verify-email') {
        return (
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-400 via-pink-400 to-purple-600">
                <div className="relative z-10 bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-700/50">
                    <h1 className="text-4xl font-bold text-center text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-4">
                        Verify Your Email
                    </h1>
                    
                    <p className="mb-6 text-center text-sm text-gray-300">
                        We've sent a 6-digit code to<br/>
                        <strong className="text-purple-300">{registrationEmail}</strong>
                    </p>

                    <form onSubmit={handleVerifyEmail} className="space-y-6">
                        <input
                            type="text"
                            placeholder="Enter 6-digit code"
                            className="w-full px-4 py-4 bg-white/90 rounded-xl text-gray-800 text-center text-lg tracking-widest placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength="6"
                            required
                            disabled={isLoading}
                        />

                        <button
                            type="submit"
                            className={`w-full py-4 font-semibold rounded-xl text-white shadow-lg transform hover:scale-105 transition-all duration-300 ${
                                isLoading || otpCode.length !== 6
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                            }`}
                            disabled={isLoading || otpCode.length !== 6}
                        >
                            {isLoading ? "Verifying..." : "Verify Email"}
                        </button>
                    </form>

                    <div className="mt-6 text-center space-y-3">
                        <button
                            onClick={handleResendOTP}
                            className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
                            disabled={isLoading}
                        >
                            Didn't receive code? Resend
                        </button>
                        
                        <div>
                            <button
                                onClick={resetToAuth}
                                className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                                disabled={isLoading}
                            >
                                Back to login
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className={`mt-6 p-3 rounded-xl text-center text-sm ${
                            message.includes('successful') || message.includes('sent')
                                ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
                                : 'bg-red-500/20 text-red-300 border border-red-500/50'
                        }`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-400 via-pink-400 to-purple-600">
            <div className="relative z-10 bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-700/50">
                <h1 className="text-4xl font-bold text-center text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-8">
                    {isLogin ? "Login" : "Create Account"}
                </h1>

                <form onSubmit={handleAuthSubmit} className="space-y-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-purple-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full pl-12 pr-4 py-4 bg-white/90 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                            value={formData.username}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {!isLogin && (
                        <>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-purple-400" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full pl-12 pr-4 py-4 bg-white/90 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <UserCircle className="h-5 w-5 text-purple-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        className="w-full pl-12 pr-4 py-4 bg-white/90 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className="w-full px-4 py-4 bg-white/90 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-purple-400" />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Phone Number (optional)"
                                    className="w-full pl-12 pr-4 py-4 bg-white/90 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </>
                    )}

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-purple-400" />
                        </div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full pl-12 pr-4 py-4 bg-white/90 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            required
                            disabled={isLoading}
                            minLength="6"
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-4 font-semibold rounded-xl text-white shadow-lg transform hover:scale-105 transition-all duration-300 ${
                            isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading 
                            ? (isLogin ? "Logging in..." : "Creating Account...") 
                            : (isLogin ? "Log In" : "Create Account")
                        }
                    </button>
                </form>

                {message && (
                    <div className={`mt-6 p-3 rounded-xl text-center text-sm ${
                        message.includes('successful') 
                            ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
                            : 'bg-red-500/20 text-red-300 border border-red-500/50'
                    }`}>
                        {message}
                    </div>
                )}

                <p className="mt-6 text-center text-sm text-gray-300">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        type="button"
                        onClick={toggleMode}
                        className="text-purple-300 hover:text-purple-200 font-medium transition-colors"
                        disabled={isLoading}
                    >
                        {isLogin ? "Create one" : "Sign in"}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;
