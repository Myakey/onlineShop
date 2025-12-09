import React, { useState, useEffect, useRef } from "react";

const NewsletterSection = () => {
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

  const handleWhatsAppClick = (type) => {
    const phoneNumber = "628999908403"; // Format internasional (62 = Indonesia country code)
    let message = "";

    if (type === "buyer") {
      message = "Halo! Saya tertarik untuk membeli produk dari toko Anda. Bisakah Anda memberikan informasi lebih lanjut?";
    } else if (type === "reseller") {
      message = "Halo! Saya tertarik untuk menjadi reseller produk Anda. Bisakah kita diskusikan lebih lanjut mengenai kerja sama reseller?";
    }

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp API URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open in new tab
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 bg-gradient-to-br from-pink-300 via-pink-200 to-white relative overflow-hidden"
    >
      {/* Background dekorasi */}
      <div className="absolute inset-0">
        <div
          className={`absolute top-0 left-0 w-96 h-96 bg-pink-300/40 rounded-full blur-3xl transition-all duration-1000 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        ></div>
        <div
          className={`absolute bottom-0 right-0 w-96 h-96 bg-pink-400/40 rounded-full blur-3xl transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Heading - Fade in from top */}
        <h2
          className={`text-5xl font-black text-gray-900 mb-6 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }`}
        >
          Ingin berkenalan lebih lanjut?
        </h2>

        {/* Subtitle - Fade in with delay */}
        <p
          className={`text-xl text-gray-700 mb-10 transition-all duration-1000 delay-200 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }`}
        >
          Ayo hubungi kami melalui WhatsApp untuk mendiskusikan pertanyaan
          serta bisnis juga ✨
        </p>

        {/* Buttons - Slide in from sides */}
        <div className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto justify-center">
          <button
            onClick={() => handleWhatsAppClick("buyer")}
            className={`px-8 py-5 bg-pink-500 text-white rounded-2xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-500 hover:bg-pink-600 flex items-center justify-center gap-3 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-20"
            }`}
            style={{ transitionDelay: isVisible ? "400ms" : "0ms" }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Hubungi sebagai Pembeli
          </button>
          <button
            onClick={() => handleWhatsAppClick("reseller")}
            className={`px-8 py-5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-2xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-500 hover:from-pink-600 hover:to-pink-700 flex items-center justify-center gap-3 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-20"
            }`}
            style={{ transitionDelay: isVisible ? "600ms" : "0ms" }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Hubungi sebagai Reseller
          </button>
        </div>
      </div>
      {/* Fade putih di bagian bawah */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
    </section>
  );
};

export default NewsletterSection;