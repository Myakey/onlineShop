import React from 'react';
import { User, Mail, Lock, MapPin, Phone } from 'lucide-react';
import InputField from './InputField';

const RegisterForm = ({ formData, setFormData, handleRegister, handleLoginRedirect }) => {

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="relative z-10 bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-700/50">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
          Register
        </h1>
        <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-2 rounded-full"></div>
      </div>

      <div className="space-y-4">
        <InputField icon={User} name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} />
        <InputField icon={Mail} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
        <InputField icon={Lock} type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />
        <InputField icon={MapPin} name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} />
        <InputField icon={Phone} name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} />

        <button
          onClick={handleRegister}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl
                     hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400
                     focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 transition-all duration-300 shadow-lg mt-6"
        >
          Register
        </button>
      </div>

      <div className="mt-6 text-center">
        <div className="border-t border-gray-600 pt-6">
          <p className="text-gray-300 mb-2">Already have an account?</p>
          <button 
            onClick={handleLoginRedirect}
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300"
          >
            Login Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
