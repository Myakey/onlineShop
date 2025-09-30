import React from "react";
import { TrendingUp } from "lucide-react";

const TimelineSection = () => (
  <section className="py-24 px-6 bg-gradient-to-b from-gray-900 to-gray-950">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-purple-500/10 px-6 py-2 rounded-full mb-4">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <span className="text-purple-400 font-semibold">Perjalanan Kami</span>
        </div>
        <h2 className="text-5xl font-black text-white mb-4">Cerita di Balik FoodStore</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Dari dapur rumahan hingga menjadi destinasi kuliner favorit
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { year: "2020", title: "Awal Perjalanan", desc: "Memulai dari dapur rumah dengan resep keluarga" },
          { year: "2022", title: "Ekspansi Besar", desc: "Membuka 5 cabang di berbagai kota" },
          { year: "2025", title: "Inovasi Digital", desc: "Platform online untuk kemudahan pemesanan" }
        ].map((item, idx) => (
          <div key={idx} className="relative group">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-6xl font-black text-purple-500/20 mb-4">{item.year}</div>
              <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TimelineSection;
