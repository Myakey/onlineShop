import React from "react";
import { Award } from "lucide-react";

const ProductInfoSection = () => (
  <section className="py-24 px-6 bg-[#FFF5FA]">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Bagian Teks */}
        <div>
          <div className="inline-flex items-center space-x-2 bg-pink-100 px-6 py-2 rounded-full mb-6">
            <Award className="w-5 h-5 text-cyan-500" />
            <span className="text-cyan-600 font-semibold">Kualitas Premium</span>
          </div>
          <h2 className="text-5xl font-black text-pink-600 mb-6 leading-tight">
            Boneka Imut<br />Untuk Teman Setia Anda
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            Setiap boneka dibuat dari bahan pilihan yang lembut, aman, dan tahan lama.
            Cocok untuk hadiah, koleksi, atau sekadar jadi teman peluk yang selalu menemani.
          </p>
          <ul className="space-y-4">
            {[
              "Bahan Super Lembut & Aman",
              "Desain Eksklusif & Lucu",
              "Cocok untuk Semua Usia"
            ].map((item, idx) => (
              <li key={idx} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-pink-400 via-cyan-400 to-pink-300 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-800 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bagian Gambar/Ilustrasi */}
        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-cyan-200/40 via-pink-200/40 to-pink-300/40 rounded-3xl border border-cyan-300 flex items-center justify-center">
            <div className="text-8xl">🧸</div>
          </div>
          <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-pink-400 to-cyan-500 rounded-2xl p-6 shadow-xl">
            <div className="text-white">
              <div className="text-4xl font-black">1000+</div>
              <div className="text-sm text-pink-100">Pelanggan Bahagia</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ProductInfoSection;
