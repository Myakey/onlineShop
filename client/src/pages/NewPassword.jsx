import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Key, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import authService from "../services/authService";

function NewPassword() {
    const navigate = useNavigate();
    
    // States
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // --- HANDLERS ---

    // Step 1: Request OTP
    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");
        try {
            // Asumsi: endpoint backend untuk forgot password
            await authService.forgotPassword({ email });
            setStep(2);
        } catch (err) {
            setMessage(err.response?.data?.error || "Email not found.");
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");
        try {
            // Asumsi: verify otp reset password
            await authService.verifyResetOTP({ email, otp: otpCode });
            setStep(3);
        } catch (err) {
            setMessage(err.response?.data?.error || "Invalid OTP code.");
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }
        setIsLoading(true);
        setMessage("");
        try {
            await authService.resetPassword({ email, otp: otpCode, password });
            setMessage("Password changed successfully! Redirecting...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setMessage(err.response?.data?.error || "Failed to reset password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-pink-200/80 px-4">
            {/* Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-purple-300 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-pink-400 rounded-full blur-3xl opacity-50"></div>

            <div className="relative z-10 bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/10 transition-all duration-500">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-extrabold text-transparent bg-pink-400 bg-clip-text">
                        {step === 1 && "Forgot Password?"}
                        {step === 2 && "Verification"}
                        {step === 3 && "New Password"}
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">
                        {step === 1 && "Enter your email to receive a reset code."}
                        {step === 2 && `Enter the 6-digit code sent to ${email}`}
                        {step === 3 && "Create a strong new password for your account."}
                    </p>
                </div>

                {/* Form Container with Slide Animation Logic */}
                <div className="relative overflow-hidden">
                    
                    {/* STEP 1: EMAIL */}
                    {step === 1 && (
                        <form onSubmit={handleRequestOTP} className="space-y-5 animate-in fade-in slide-in-from-right duration-500">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full pl-12 pr-4 py-4 bg-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 border border-white/5 transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || !email}
                                className="w-full py-4 bg-pink-500 text-white font-bold rounded-2xl hover:opacity-90 transform active:scale-95 transition-all disabled:opacity-50"
                            >
                                {isLoading ? "Sending..." : "Send Reset Link"}
                            </button>
                        </form>
                    )}

                    {/* STEP 2: OTP */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP} className="space-y-5 animate-in fade-in slide-in-from-right duration-500">
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full pl-12 pr-4 py-4 bg-white/10 rounded-2xl text-white text-center text-xl tracking-widest placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 border border-white/5 transition-all"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || otpCode.length < 6}
                                className="w-full py-4 bg-pink-500 text-white font-bold rounded-2xl hover:opacity-90 transform active:scale-95 transition-all disabled:opacity-50"
                            >
                                {isLoading ? "Verifying..." : "Verify Code"}
                            </button>
                        </form>
                    )}

                    {/* STEP 3: NEW PASSWORD */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-4 animate-in fade-in slide-in-from-right duration-500">
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    className="w-full pl-12 pr-4 py-4 bg-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 border border-white/5 transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    className="w-full pl-12 pr-4 py-4 bg-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 border border-white/5 transition-all"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || !password}
                                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:opacity-90 transform active:scale-95 transition-all disabled:opacity-50"
                            >
                                {isLoading ? "Updating..." : "Reset Password"}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="mt-8 flex flex-col items-center gap-4">
                    {step > 1 && (
                        <button 
                            onClick={() => setStep(step - 1)}
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                    )}
                    <button 
                        onClick={() => navigate("/login")}
                        className="text-sm text-pink-400 hover:underline transition-all"
                    >
                        Return to Login
                    </button>
                </div>

                {/* Global Message */}
                {message && (
                    <div className={`mt-6 p-4 rounded-2xl text-center text-sm font-medium ${
                        message.includes('successfully') 
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default NewPassword;