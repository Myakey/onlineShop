import React, { useState } from 'react';
import RegisterForm from '../components/forms/RegisterForm';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    address: '',
    phone: ''
  });

  const handleRegister = () => {
    console.log('Register submitted:', formData);
    // Add your registration logic here
  };

  const handleLoginRedirect = () => {
    console.log('Redirect to login page');
    // Add navigation to login page here
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-purple-600">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-pink-300 rounded-full mix-blend-overlay filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-purple-300 rounded-full mix-blend-overlay filter blur-xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse delay-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-overlay filter blur-2xl animate-pulse delay-1500"></div>
        </div>
      </div>

      {/* Register Form */}
      <RegisterForm
        formData={formData}
        setFormData={setFormData}
        handleRegister={handleRegister}
        handleLoginRedirect={handleLoginRedirect}
      />
    </div>
  );
};

export default Register;
