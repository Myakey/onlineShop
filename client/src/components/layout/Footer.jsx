import React from "react";

const Footer = () => {
  return (
    <footer className="relative bg-gray-900 text-gray-300">
      {/* Slope/Wave Design */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none -translate-y-full">
        <svg
          className="relative block w-full h-16 md:h-18 rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#111827"
          ></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-5 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Monmon's Hobbies</h2>
          <p className="text-gray-400 text-sm">
            Hadir dengan koleksi blind box dan figurine premium bergaya kawaii. Cocok untuk para kolektor, pecinta karakter lucu, atau hadiah spesial untuk siapa saja. 
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="/products" className="hover:text-white transition-colors">Katalog</a></li>
            <li><a href="/order" className="hover:text-white transition-colors">Pesan Sekarang</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>Jl. Teratai II C21/24, Kel. Uwung Jaya, Kec. Cibodas, Kota Tangerang, 15138</li>
            <li>Phone: +62 899-9908-403</li>
            <li>Email: info@dollstore.com</li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://www.tokopedia.com/monmonhobbies" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
              {/* Tokopedia */}
              <img
                src="/src/assets/tokopedia.png"
                alt="Tokopedia"
                className="w-6 h-6 transition-transform brightness-100 hover:scale-125 hover:brightness-150"
              />
            </a>
            <a href="https://shopee.co.id/monicabellathysta" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
              {/* Shopee */}
              <img
                src="/src/assets/shopee.png"
                alt="Shopee"
                className="w-6 h-6 transition-transform brightness-100 hover:scale-125 hover:brightness-150"
              />
            </a>
            <a href="https://www.tiktok.com/@potatogurl_asoy" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
              {/* Tiktok */}
              <img
                src="/src/assets/tiktok.png"
                alt="Tiktok"
                className="w-6 h-6 transition-transform brightness-100 hover:scale-125 hover:brightness-150"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t border-gray-700 mt-8 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Monmon's Hobbies. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;