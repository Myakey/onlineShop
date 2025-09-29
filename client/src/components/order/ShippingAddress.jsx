import React, { useState } from "react";

const ShippingOptions = ({ options, onSelect }) => {
  const [selected, setSelected] = useState(options[0]);

  const handleSelect = (option) => {
    setSelected(option);
    onSelect(option);
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold mb-2">Metode Pengiriman</h3>
      {options.map((option) => (
        <div
          key={option}
          className={`p-2 border rounded cursor-pointer ${selected === option ? "border-blue-500 bg-blue-50" : ""}`}
          onClick={() => handleSelect(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default ShippingOptions;
