import React from "react";
import { TrendingUp } from "lucide-react";

const TimelineSection = () => {
  const timelineData = [
    {
      year: "2020",
      title: "Awal Perjalanan",
      desc: "Toko Boneka Lucu lahir dari hobi mengoleksi boneka imut dan keinginan menghadirkan kebahagiaan.",
      img: "https://source.unsplash.com/600x400/?teddy,bear",
    },
    {
      year: "2022",
      title: "Ekspansi Besar",
      desc: "Mulai membuka toko offline dan online dengan koleksi boneka yang semakin lengkap dan eksklusif.",
      img: "https://source.unsplash.com/600x400/?toy,shop",
    },
    {
      year: "2025",
      title: "Inovasi Digital",
      desc: "Meluncurkan platform belanja boneka online untuk memudahkan pelanggan di seluruh Indonesia.",
      img: "https://source.unsplash.com/600x400/?ecommerce,toys",
    },
  ];

  return (
    <section className="py-24 px-6 bg-[#FFF5FA]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-pink-200/40 px-6 py-2 rounded-full mb-4">
            <TrendingUp className="w-5 h-5 text-cyan-500" />
            <span className="text-cyan-600 font-semibold">Perjalanan Kami</span>
          </div>
          <h2 className="text-5xl font-black text-gray-900 mb-4">
            Cerita di Balik Toko Boneka Lucu 🧸
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Dari hobi sederhana menjadi toko boneka favorit keluarga
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Garis tengah hanya muncul di desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 w-1 bg-gradient-to-b from-pink-300 to-cyan-400 h-full transform -translate-x-1/2" />

          <div className="space-y-24">
            {timelineData.map((item, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col md:flex-row items-center ${
                  idx % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Konten teks */}
                <div className="md:w-1/2 px-6 md:px-12 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-pink-600 mb-2">
                    {item.year} - {item.title}
                  </h3>
                  <p className="text-gray-700">{item.desc}</p>
                </div>

                {/* Titik timeline hanya muncul di desktop */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 rounded-full bg-cyan-500 border-4 border-white shadow-md" />
                </div>

                {/* Gambar */}
                <div className="md:w-1/2 flex justify-center px-6 md:px-12 mt-6 md:mt-0">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-80 h-52 object-cover rounded-2xl shadow-lg border-4 border-pink-200"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
