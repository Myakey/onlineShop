import React from "react";
import { Award } from "lucide-react";

const ProductInfoSection = () => (
  <section className="py-24 px-6 bg-gray-950">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center space-x-2 bg-pink-500/10 px-6 py-2 rounded-full mb-6">
            <Award className="w-5 h-5 text-pink-400" />
            <span className="text-pink-400 font-semibold">Kualitas Terjamin</span>
          </div>
          <h2 className="text-5xl font-black text-white mb-6 leading-tight">
            Hanya Bahan<br/>Terbaik untuk Anda
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Kami berkomitmen menggunakan bahan-bahan segar dan berkualitas tinggi. Setiap hidangan dibuat dengan penuh cinta dan perhatian terhadap detail.
          </p>
          <ul className="space-y-4">
            {["100% Bahan Segar", "Tanpa Pengawet Buatan", "Halal & Higienis"].map((item, idx) => (
              <li key={idx} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-white font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl border border-purple-500/30 flex items-center justify-center">
            <div className="text-8xl">🍔</div>
          </div>
          <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-6 shadow-2xl">
            <div className="text-white">
              <div className="text-4xl font-black">500+</div>
              <div className="text-sm">Pelanggan Puas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ProductInfoSection;
