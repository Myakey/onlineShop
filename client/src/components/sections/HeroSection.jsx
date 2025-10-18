import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

// Import your image from assets folder
import plushiesImg from "../../assets/Plushies.png";
import givingImg from "../../assets/GivingPlushies.png";
import labubuImg from "../../assets/Labubus.png";

const slides = [
  {
    id: 1,
    title: "Boneka Imut & Menggemaskan",
    desc: "Temukan koleksi boneka lucu yang siap menemani hari-hari Anda.",
    img: plushiesImg,
    bg: "from-pink-200 via-pink-400 to-pink-600",
  },
  {
    id: 2,
    title: "Hadiah Spesial untuk Orang Tersayang",
    desc: "Boneka lembut dan berkualitas, cocok jadi hadiah istimewa.",
    img: givingImg,
    bg: "from-purple-200 via-purple-400 to-purple-600",
  },
  {
    id: 3,
    title: "Koleksi Unik & Terbaru",
    desc: "Lengkapi koleksi boneka Anda dengan desain yang selalu update.",
    img: labubuImg,
    bg: "from-rose-200 via-pink-300 to-rose-500",
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
            className={`relative w-full h-screen flex-shrink-0 flex items-center justify-center px-6 bg-gradient-to-br ${slide.bg}`}
          >
            {/* Semi-transparent image overlay */}
            <img
              src={slide.img}
              alt="overlay"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />

            {/* Content must stay on top */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              <div className="text-8xl mb-6">{slide.emoji}</div>
              <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-pink-100 to-purple-200 bg-clip-text text-transparent drop-shadow-lg select-none">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl text-white font-semibold mb-10 max-w-2xl mx-auto drop-shadow-md select-none">
                {slide.desc}
              </p>
              <button className="group px-8 py-5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl font-bold text-lg text-white shadow-2xl hover:shadow-pink-400/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2" onClick={() => window.location.href = '/products'}>
                <span>Belanja Sekarang</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Indicator Bullets */}
      <div className="absolute bottom-10 w-full flex justify-center space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              current === index ? "bg-pink-500 scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;