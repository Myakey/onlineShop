import React from "react";
import { Sparkles, ChevronRight } from "lucide-react";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
    {/* Animated Background Elements */}
    <div className="absolute inset-0">
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
    </div>
    
    <div className="relative z-10 text-center px-6 max-w-5xl">
      <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/20">
        <Sparkles className="w-5 h-5 text-yellow-300" />
        <span className="text-white font-semibold">Selamat Datang di FoodStore</span>
      </div>
      
      <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent leading-tight">
        Kelezatan yang<br/>Tak Terlupakan
      </h1>
      
      <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
        Nikmati hidangan berkualitas premium dengan cita rasa autentik yang menggugah selera Anda
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="group px-8 py-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
          <span>Pesan Sekarang</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <button className="px-8 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300">
          Lihat Menu
        </button>
      </div>
    </div>
  </section>
);

export default HeroSection;
