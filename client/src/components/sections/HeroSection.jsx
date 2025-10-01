import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Kelezatan yang Tak Terlupakan",
    desc: "Nikmati hidangan berkualitas premium dengan cita rasa autentik yang menggugah selera Anda",
    emoji: "🍔",
    bg: "from-purple-900 via-pink-900 to-purple-900",
  },
  {
    id: 2,
    title: "Rasakan Gurihnya Kenikmatan",
    desc: "Setiap gigitan penuh dengan cita rasa yang bikin ketagihan",
    emoji: "🍟",
    bg: "from-pink-900 via-red-800 to-pink-900",
  },
  {
    id: 3,
    title: "Minuman Segar Menyegarkan",
    desc: "Lengkapi pengalaman makan Anda dengan minuman istimewa",
    emoji: "🥤",
    bg: "from-indigo-900 via-blue-800 to-indigo-900",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  // auto slide tiap 6 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Slider Container */}
      <div
        className="flex h-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`w-full h-screen flex-shrink-0 flex flex-col items-center justify-center px-6 bg-gradient-to-br ${slide.bg}`}
          >
            <div className="text-8xl mb-6">{slide.emoji}</div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent text-center">
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto text-center">
              {slide.desc}
            </p>
            <button className="group px-8 py-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
              <span>Pesan Sekarang</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      {/* Indicator Bullets */}
      <div className="absolute bottom-10 w-full flex justify-center space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              current === index ? "bg-pink-400 scale-125" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
