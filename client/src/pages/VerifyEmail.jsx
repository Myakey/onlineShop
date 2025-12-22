import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../services/authService";

function VerifyEmail() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // State untuk menyimpan email
    const [registrationEmail, setRegistrationEmail] = useState(location.state?.email || "");
    const [otpCode, setOtpCode] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // --- LOGIKA PERBAIKAN: ASYNC FETCH PROFILE ---
    useEffect(() => {
        const getEmailData = async () => {
            // 1. Jika email sudah ada dari navigation state, tidak perlu ambil lagi
            if (registrationEmail) return;

            // 2. Jika tidak ada, coba ambil dari localStorage
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                navigate("/login");
                return;
            }

            try {
                const userObj = JSON.parse(storedUser);
                
                // Jika di object user sudah ada email, gunakan itu
                if (userObj.email) {
                    setRegistrationEmail(userObj.email);
                } 
                // Jika hanya ada ID, baru panggil API (Gunakan AWAIT di sini)
                else if (userObj.id) {
                    setIsLoading(true);
                    const profile = await authService.getProfile(userObj.id);
                    setRegistrationEmail(profile.email);
                }
            } catch (err) {
                console.error("Failed to fetch email:", err);
                navigate("/login");
            } finally {
                setIsLoading(false);
            }
        };

        getEmailData();
    }, [registrationEmail, navigate]);

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
            setMessage(err.response?.data?.error || "Verification failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!registrationEmail) return;
        setIsLoading(true);
        try {
            await authService.resendOTP({ email: registrationEmail });
            setMessage("New verification code sent! Please check your email.");
        } catch (err) {
            setMessage(err.response?.data?.error || "Failed to resend code.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-pink-200/80">
            <div className="relative z-10 bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-700/50">
                <h1 className="text-2xl font-bold text-center text-transparent bg-pink-400 bg-clip-text mb-4">
                    Verify Your Email
                </h1>
                
                <p className="mb-6 text-center text-sm text-gray-300">
                    We've sent a 6-digit code to<br/>
                    <strong className="text-purple-300">{registrationEmail || "your email"}</strong>
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
                        className="text-sm text-purple-300 hover:text-purple-200 transition-colors disabled:opacity-50"
                        disabled={isLoading || !registrationEmail}
                    >
                        Didn't receive code? Resend
                    </button>
                    
                    <div>
                        <button
                            onClick={() => navigate("/login")}
                            className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                            disabled={isLoading}
                        >
                            Back to login
                        </button>
                    </div>
                </div>

                {message && (
                    <div className={`mt-6 p-3 rounded-xl text-center text-sm ${
                        message.includes('successfully') || message.includes('sent')
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

export default VerifyEmail;