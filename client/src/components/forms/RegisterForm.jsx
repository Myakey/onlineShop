import React, { useState } from "react";
import { User, Mail, Lock, Phone } from "lucide-react";
import InputField from "./InputField";

const RegisterForm = ({ formData, setFormData, handleRegister, handleLoginRedirect }) => {
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onRegister = async () => {
    // Validasi ringan sebelum kirim
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      alert("Please fill in all required fields!");
      return;
    }

    setLoading(true);
    try {
      await handleRegister();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-700/50">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">Create Account</h1>
        <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-2 rounded-full"></div>
      </div>

      {/* Form Inputs */}
      <div className="space-y-4">
        <InputField icon={User} name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} />
        <InputField icon={User} name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} />
        <InputField icon={Mail} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
        <InputField icon={Lock} type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />
        <InputField icon={Phone} name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} />

        {/* Register Button */}
        <button
          onClick={onRegister}
          disabled={loading}
          className={`w-full py-4 ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
          } text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400
                     focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 transition-all duration-300 shadow-lg mt-6`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>

      {/* Redirect to Login */}
      <div className="mt-6 text-center">
        <div className="border-t border-gray-600 pt-6">
          <p className="text-gray-300 mb-2">Already have an account?</p>
          <button onClick={handleLoginRedirect} className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300">
            Login Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
