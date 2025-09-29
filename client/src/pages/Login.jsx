import { useState } from "react";
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

                // Store tokens and user data
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                localStorage.setItem("user", JSON.stringify(data.user));

                setMessage("Login successful! Redirecting...");
                setTimeout(() => {
                    window.location.href = "/dashboard";
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

            // Store tokens and user data (user is automatically logged in after verification)
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("user", JSON.stringify(data.user));

            setMessage("Email verified successfully! Redirecting...");
            setTimeout(() => {
                window.location.href = "/dashboard";
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
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                    <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
                        Verify Your Email
                    </h1>
                    
                    <p className="mb-4 text-center text-sm text-gray-600">
                        We've sent a 6-digit code to<br/>
                        <strong>{registrationEmail}</strong>
                    </p>

                    <form onSubmit={handleVerifyEmail} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Enter 6-digit code"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-center text-lg tracking-widest focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength="6"
                            required
                            disabled={isLoading}
                        />

                        <button
                            type="submit"
                            className={`w-full rounded-lg py-2 text-white transition-colors ${
                                isLoading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                            disabled={isLoading || otpCode.length !== 6}
                        >
                            {isLoading ? "Verifying..." : "Verify Email"}
                        </button>
                    </form>

                    <div className="mt-4 text-center space-y-2">
                        <button
                            onClick={handleResendOTP}
                            className="text-sm text-blue-600 hover:underline"
                            disabled={isLoading}
                        >
                            Didn't receive code? Resend
                        </button>
                        
                        <div>
                            <button
                                onClick={resetToAuth}
                                className="text-sm text-gray-600 hover:underline"
                                disabled={isLoading}
                            >
                                Back to login
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className={`mt-4 p-3 rounded-lg text-center text-sm ${
                            message.includes('successful') || message.includes('sent')
                                ? 'bg-green-100 text-green-700 border border-green-300' 
                                : 'bg-red-100 text-red-700 border border-red-300'
                        }`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
                    {isLogin ? "Login" : "Create Account"}
                </h1>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        required
                        disabled={isLoading}
                    />

                    {!isLogin && (
                        <>
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name (optional)"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            
                            <input
                                type="tel"
                                placeholder="Phone Number (optional)"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={formData.phoneNumber}
                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                disabled={isLoading}
                            />
                        </>
                    )}

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
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
                            ? (isLogin ? "Logging in..." : "Creating Account...") 
                            : (isLogin ? "Login" : "Create Account")
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
                        {isLogin ? "Create one" : "Sign in"}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;