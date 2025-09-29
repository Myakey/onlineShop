import React from "react";
import { useNavigate } from "react-router-dom"; // kalau pakai routing

const HeroSection = () => {
  const navigate = useNavigate(); // hook untuk navigasi halaman

  const handleRegister = () => {
    console.log("Register button clicked");
    navigate("/register"); // pindah ke halaman register
  };

  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Join the Convention
        </h1>

        <button
          onClick={handleRegister}
          className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Register
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
