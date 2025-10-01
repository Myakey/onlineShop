import React from "react";
import { TrendingUp } from "lucide-react";

const TimelineSection = () => {
  const timelineData = [
    {
      year: "2020",
      title: "Awal Perjalanan",
      desc: "Memulai dari dapur rumah dengan resep keluarga yang diwariskan turun-temurun.",
      img: "https://source.unsplash.com/600x400/?kitchen,food",
    },
    {
      year: "2022",
      title: "Ekspansi Besar",
      desc: "Membuka 5 cabang di berbagai kota dengan menu khas yang semakin beragam.",
      img: "https://source.unsplash.com/600x400/?restaurant,food",
    },
    {
      year: "2025",
      title: "Inovasi Digital",
      desc: "Meluncurkan platform online untuk memudahkan pelanggan dalam pemesanan.",
      img: "https://source.unsplash.com/600x400/?technology,food",
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
            Cerita di Balik FoodStore
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Dari dapur rumahan hingga menjadi destinasi kuliner favorit
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Garis tengah */}
          <div className="absolute left-1/2 top-0 w-1 bg-gradient-to-b from-pink-300 to-cyan-400 h-full transform -translate-x-1/2" />

          <div className="space-y-24">
            {timelineData.map((item, idx) => (
              <div
                key={idx}
                className={`flex flex-col md:flex-row items-center md:items-start ${
                  idx % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Gambar */}
                <div className="md:w-1/2 flex justify-center md:justify-start md:px-8">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-80 h-52 object-cover rounded-2xl shadow-lg border-4 border-pink-200"
                  />
                </div>

                {/* Titik & garis */}
                <div className="relative flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-cyan-500 border-4 border-white shadow-md z-10" />
                </div>

                {/* Konten */}
                <div className="md:w-1/2 mt-6 md:mt-0 md:px-8 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-pink-600 mb-2">
                    {item.year} - {item.title}
                  </h3>
                  <p className="text-gray-700">{item.desc}</p>
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
