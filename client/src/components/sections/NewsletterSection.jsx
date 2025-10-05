import React from "react";

const NewsletterSection = () => (
  <section className="py-24 px-6 bg-gradient-to-br from-blue-400 via-pink-200 to-white relative overflow-hidden">
    {/* Background dekorasi */}
    <div className="absolute inset-0">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300/40 rounded-full blur-3xl"></div>
    </div>
    
    <div className="max-w-4xl mx-auto text-center relative z-10">
      <h2 className="text-5xl font-black text-gray-900 mb-6">
        Bergabung dengan Keluarga Boneka Kami
      </h2>
      <p className="text-xl text-gray-700 mb-10">
        Daftar untuk mendapatkan info koleksi boneka terbaru, promo spesial, dan diskon eksklusif hanya untuk kamu ✨
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
        <input
          type="email"
          placeholder="Masukkan email Anda"
          className="flex-1 px-6 py-5 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />
        <button className="px-8 py-5 bg-blue-500 text-white rounded-2xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
          Bergabung Sekarang
        </button>
      </div>
    </div>
  </section>
);

export default NewsletterSection;
