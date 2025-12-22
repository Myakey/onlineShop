import { useState } from "react";
import { User, Lock, Mail, Phone } from "lucide-react"; // Hapus yang tidak terpakai
import authService from "../services/authService";
import Logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        phoneNumber: ""
    });
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            if (isLogin) {
                // LOGIK LOGIN
                const data = await authService.login({
                    username: formData.username,
                    password: formData.password
                });

                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                localStorage.setItem("user", JSON.stringify(data.user));

                setMessage("Login successful! Redirecting...");
                setTimeout(() => { window.location.href = "/"; }, 1500);

            } else {
                // LOGIK REGISTER (LANGSUNG LOG IN & KE HOME)
                if (formData.password !== formData.confirmPassword) {
                    setMessage("Passwords do not match!");
                    setIsLoading(false);
                    return;
                }

                const { confirmPassword, ...dataToSend } = formData;
                const data = await authService.register(dataToSend);
                
                // Simpan session (Asumsi API register mengembalikan token)
                if (data.accessToken) {
                    localStorage.setItem("accessToken", data.accessToken);
                    localStorage.setItem("refreshToken", data.refreshToken);
                    localStorage.setItem("user", JSON.stringify(data.user));
                }

                setMessage("Account created! Welcome to our store.");
                setTimeout(() => { window.location.href = "/"; }, 1500);
            }
        } catch (err) {
            // Jika backend memaksa verifikasi dulu (Error 403/Requires Verification)
            console.log(err.response?.data);
            if (err.response?.data?.requiresVerification) {
                navigate("/verify-email", { state: { email: err.response.data.email || formData.email } });
                return;
            }
            setMessage(err.response?.data?.error || "Process failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setMessage("");
        setFormData({
            username: "", email: "", password: "", confirmPassword: "",
            firstName: "", lastName: "", phoneNumber: ""
        });
    };

    // --- RENDER FORM UTAMA ---
    return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50 p-4">
            <div className="flex flex-col md:flex-row w-full max-w-5xl bg-gray-900/80 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ease-in-out">
                
                {/* SEBELAH KIRI: IMAGE */}
                <div className="hidden md:flex md:w-1/2 bg-white items-center justify-center overflow-hidden">
                    <img src={Logo} alt="Logo" className="w-full h-full object-contain p-12 transition-transform hover:scale-105" />
                </div>

                {/* SEBELAH KANAN: FORM */}
                <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                    <h1 className="text-2xl font-bold text-center text-transparent bg-pink-400 bg-clip-text mb-8">
                        {isLogin ? "Login" : "Create Account"}
                    </h1>

                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                        {/* Username */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center"><User className="h-5 w-5 text-purple-400" /></div>
                            <input
                                type="text" placeholder="Username"
                                className="w-full pl-12 pr-4 py-4 bg-white/90 rounded-xl text-gray-800 focus:ring-2 focus:ring-purple-400 outline-none"
                                value={formData.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                required
                            />
                        </div>

                        {/* Register Fields (Email, Names, Phone) */}
                        <div className={`overflow-hidden transition-all duration-500 ${isLogin ? 'max-h-0 opacity-0' : 'max-h-[400px] opacity-100 mb-4'}`}>
                            <div className="space-y-4 pt-1">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center"><Mail className="h-5 w-5 text-purple-400" /></div>
                                    <input
                                        type="email" placeholder="Email"
                                        className="w-full pl-12 pr-4 py-4 bg-white/90 rounded-xl text-gray-800"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        required={!isLogin}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text" placeholder="First Name"
                                        className="w-full px-4 py-4 bg-white/90 rounded-xl text-gray-800"
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        required={!isLogin}
                                    />
                                    <input
                                        type="text" placeholder="Last Name"
                                        className="w-full px-4 py-4 bg-white/90 rounded-xl text-gray-800"
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        required={!isLogin}
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center"><Phone className="h-5 w-5 text-purple-400" /></div>
                                    <input
                                        type="tel" placeholder="Phone Number"
                                        className="w-full pl-12 pr-4 py-4 bg-white/90 rounded-xl text-gray-800"
                                        value={formData.phoneNumber}
                                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center"><Lock className="h-5 w-5 text-purple-400" /></div>
                            <input
                                type="password" placeholder="Password"
                                className="w-full pl-12 pr-4 py-4 bg-white/90 rounded-xl text-gray-800 focus:ring-2 focus:ring-purple-400 outline-none"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                required
                            />
                        </div>

                        {/* Confirm Password (Register Only) */}
                        {!isLogin && (
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center"><Lock className="h-5 w-5 text-purple-400" /></div>
                                <input
                                    type="password" placeholder="Confirm Password"
                                    className="w-full pl-12 pr-4 py-4 bg-white/90 rounded-xl text-gray-800"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`w-full py-4 font-semibold rounded-xl text-white shadow-lg transform active:scale-95 transition-all ${
                                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-400 hover:bg-pink-500'
                            }`}
                            disabled={isLoading}
                        >
                            {isLoading ? "Processing..." : (isLogin ? "Log In" : "Create Account")}
                        </button>
                    </form>

                    {message && (
                        <div className={`mt-6 p-3 rounded-xl text-center text-sm ${
                            message.includes('successful') || message.includes('created') 
                            ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                            {message}
                        </div>
                    )}

                    <p className="mt-8 text-center text-sm text-gray-400">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button
                            type="button" onClick={toggleMode}
                            className="text-pink-400 hover:text-pink-300 font-medium underline"
                        >
                            {isLogin ? "Create one" : "Sign in"}
                        </button>
                    </p>

                    <p className="mt-4 text-center text-sm">
                        <button
                            type="button"
                            onClick={() => navigate("/forgot-password")} 
                            className="text-gray-400 hover:text-pink-400 transition-colors duration-200 font-medium underline"
                        >
                            Forgot Password?
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;