import React from "react";

const FilterPanel = ({ filterOpen, priceRange, setPriceRange }) => {
  if (!filterOpen) return null;

  const options = [
    { value: "all", label: "Semua" },
    { value: "low", label: "Di bawah $22" },
    { value: "mid", label: "$22 - $26" },
    { value: "high", label: "$27+" },
  ];

  return (
    <div className="max-w-7xl mx-auto mt-4 p-4 bg-pink-50 rounded-xl border border-pink-200">
      <h3 className="font-semibold mb-3 text-gray-800">Rentang Harga</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setPriceRange(option.value)}
            className={`px-4 py-2 rounded-lg transition-all ${
              priceRange === option.value
                ? "bg-gradient-to-r from-pink-400 to-sky-400 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-pink-100 border border-pink-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;
