import React, { useState, useEffect, useRef } from "react";
import { Award } from "lucide-react";
import plushiesImg from "../../assets/HuggingPlushies.png";

const ProductInfoSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-[#FFF5FA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Bagian Teks - Slide in from left */}
          <div>
            {/* Badge - Fade in + scale */}
            <div
              className={`inline-flex items-center space-x-2 bg-pink-100 px-6 py-2 rounded-full mb-6 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-75"
              }`}
            >
              <Award className="w-5 h-5 text-pink-500" />
              <span className="text-pink-600 font-semibold">Kualitas Premium</span>
            </div>

            {/* Heading - Slide from left */}
            <h2
              className={`text-5xl font-black text-pink-600 mb-6 leading-tight transition-all duration-1000 delay-100 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              Figurine Imut Untuk<br />Menemani Hari Anda
            </h2>

            {/* Paragraph - Fade in */}
            <p
              className={`text-gray-700 text-lg leading-relaxed mb-8 transition-all duration-1000 delay-200 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
            >
              Temukan berbagai figurine dan blind box lucu dengan detail premium dan karakter
              menggemaskan. Setiap seri dibuat dengan kualitas terbaik—sempurna untuk koleksi,
              dekorasi meja, atau hadiah spesial bagi pecinta kawaii.
            </p>

            {/* List items - Staggered animation */}
            <ul className="space-y-4">
              {[
                "Detail karakter yang rapi & premium",
                "Seri eksklusif dan desain unik",
                "Aman untuk semua usia dan cocok dijadikan koleksi"
              ].map((item, idx) => (
                <li
                  key={idx}
                  className={`flex items-center space-x-3 transition-all duration-700 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-10"
                  }`}
                  style={{
                    transitionDelay: isVisible ? `${300 + idx * 150}ms` : "0ms"
                  }}
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-800 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Bagian Gambar - Slide in from right + rotate */}
          <div className="relative">
            <div
              className={`aspect-square bg-gradient-to-br from-pink-200/40 via-pink-300/40 to-pink-400/40 rounded-3xl border border-pink-300 flex items-center justify-center relative overflow-hidden transition-all duration-1000 delay-200 ${
                isVisible
                  ? "opacity-100 translate-x-0 rotate-0"
                  : "opacity-0 translate-x-10 rotate-3"
              }`}
            >
              {/* Image */}
              <img
                src={plushiesImg}
                alt="Plushies"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 delay-500 ${
                  isVisible
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-110"
                }`}
              />
            </div>

            {/* Stats card - Slide from bottom right */}
            <div
              className={`absolute -bottom-6 -right-6 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl p-6 shadow-xl transition-all duration-1000 delay-700 ${
                isVisible
                  ? "opacity-100 translate-x-0 translate-y-0"
                  : "opacity-0 translate-x-10 translate-y-10"
              }`}
            >
              <div className="text-white">
                <div className="text-4xl font-black">100+</div>
                <div className="text-sm text-pink-100">Pelanggan Bahagia</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Blur effect di bagian bawah */}
      <div className="absolute -bottom-16 left-0 right-0 h-32 backdrop-blur-md bg-gradient-to-b from-transparent via-white/30 to-white/60 pointer-events-none"></div>
    </section>
  );
};

export default ProductInfoSection;