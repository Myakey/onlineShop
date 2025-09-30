import React from "react";

const NewsletterSection = () => (
  <section className="py-24 px-6 bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 relative overflow-hidden">
    <div className="absolute inset-0">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl"></div>
    </div>
    
    <div className="max-w-4xl mx-auto text-center relative z-10">
      <div className="text-6xl mb-6">📧</div>
      <h2 className="text-5xl font-black text-white mb-6">Dapatkan Promo Eksklusif</h2>
      <p className="text-xl text-gray-200 mb-10">
        Daftar sekarang dan dapatkan diskon 20% untuk pemesanan pertama Anda
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
        <input
          type="email"
          placeholder="Masukkan email Anda"
          className="flex-1 px-6 py-5 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
        />
        <button className="px-8 py-5 bg-white text-purple-600 rounded-2xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
          Daftar Sekarang
        </button>
      </div>
    </div>
  </section>
);

export default NewsletterSection;
