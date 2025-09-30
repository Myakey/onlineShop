import React from "react";
import Button from "../ui/Button";

const ShippingOptions = ({ options, selected, onSelect }) => (
  <div className="flex space-x-4">
    {options.map((opt) => (
      <button
        key={opt}
        className={`px-4 py-2 rounded ${selected === opt ? "bg-green-600 text-white" : "bg-gray-200"}`}
        onClick={() => onSelect(opt)}
      >
        {opt}
      </button>
    ))}
  </div>
);

export default ShippingOptions;
