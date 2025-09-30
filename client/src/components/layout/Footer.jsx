import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Restaurant Name</h2>
          <p className="text-gray-400 text-sm">
            Serving delicious burgers and meals since 1989. Quality ingredients, unique recipes, and a passion for food.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Menu</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Reviews</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Order</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>123 Burger Street, Food City, FC 45678</li>
            <li>Phone: +62 812-3456-7890</li>
            <li>Email: info@restaurant.com</li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557a9.93 9.93 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.38 4.482A13.944 13.944 0 011.671 3.149a4.916 4.916 0 001.523 6.556 4.9 4.9 0 01-2.228-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.085 4.918 4.918 0 004.59 3.417 9.867 9.867 0 01-6.102 2.104c-.396 0-.787-.023-1.175-.068A13.933 13.933 0 007.548 21c9.142 0 14.307-7.721 13.995-14.646A9.936 9.936 0 0024 4.557z" />
              </svg>
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.335 3.608 1.31.975.975 1.247 2.243 1.31 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.335 2.633-1.31 3.608-.975.975-2.243 1.247-3.608 1.31-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.335-3.608-1.31-.975-.975-1.247-2.243-1.31-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.335-2.633 1.31-3.608C4.518 2.568 5.786 2.296 7.152 2.234 8.418 2.175 8.798 2.163 12 2.163zm0-2.163C8.756 0 8.333.014 7.052.072 5.775.13 4.623.437 3.68 1.38 2.737 2.323 2.43 3.475 2.372 4.752.014 8.333 0 8.756 0 12s.014 3.667.072 4.948c.058 1.277.365 2.429 1.308 3.372.943.943 2.095 1.25 3.372 1.308C8.333 23.986 8.756 24 12 24s3.667-.014 4.948-.072c1.277-.058 2.429-.365 3.372-1.308.943-.943 1.25-2.095 1.308-3.372C23.986 15.667 24 15.244 24 12s-.014-3.667-.072-4.948c-.058-1.277-.365-2.429-1.308-3.372-.943-.943-2.095-1.25-3.372-1.308C15.667.014 15.244 0 12 0z" />
                <path d="M12 5.838A6.162 6.162 0 105.838 12 6.169 6.169 0 0012 5.838zm0 10.162A3.998 3.998 0 118 12a3.998 3.998 0 014 4z" />
                <circle cx="18.406" cy="5.594" r="1.44"/>
              </svg>
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.205 24 24 23.227 24 22.271V1.729C24 .774 23.205 0 22.225 0zM7.081 20.452H3.539V9h3.542v11.452zm-1.77-13.1c-1.135 0-2.052-.92-2.052-2.052a2.048 2.048 0 114.096 0c0 1.133-.917 2.052-2.044 2.052h-.001zm15.14 13.1h-3.542v-5.605c0-1.337-.026-3.062-1.865-3.062-1.867 0-2.153 1.459-2.153 2.968v5.699h-3.542V9h3.401v1.561h.049c.474-.897 1.632-1.846 3.36-1.846 3.593 0 4.257 2.364 4.257 5.437v6.3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t border-gray-700 mt-8 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Restaurant Name. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
