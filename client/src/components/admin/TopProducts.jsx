import React from "react";
import { Star, ArrowUpRight } from "lucide-react";

const TopProducts = ({ products = [] }) => {
  return (
    <div className="bg-white rounded-2xl border-2 border-pink-100 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Star className="text-pink-600 fill-pink-600" size={24} /> Top Produk
        </h3>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500 text-sm italic">Belum ada produk tersedia.</p>
      ) : (
        <div className="space-y-4">
          {products.map((p, i) => (
            <div
              key={p.product_id || i}
              className="bg-pink-50 rounded-xl p-4 border-2 border-pink-100 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                {/* Product Image */}
                <img
                  src={p.image_url || "/placeholder.png"}
                  alt={p.name || "Produk"}
                  className="w-14 h-14 rounded-lg object-cover border border-pink-100"
                />

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-gray-800 text-sm">
                        {p.name || `Produk ${i + 1}`}
                      </p>
                      {/* <p className="text-xs text-gray-500 mt-1">
                        {p.sold ? `Terjual: ${p.sold} unit` : "Terjual: -"}
                      </p> */}
                    </div>

                    {/* <div className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                      <ArrowUpRight size={12} /> +5%
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Price + Stock */}
              <div className="flex items-center justify-between text-sm pt-3 border-t border-pink-100">
                <span className="text-pink-600 font-bold">
                  Rp {Number(p.price).toLocaleString("id-ID")}
                </span>
                <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full font-semibold">
                  Stok: {p.stock ?? "-"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopProducts;
