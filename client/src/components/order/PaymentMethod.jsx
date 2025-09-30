import React from "react";

const PaymentMethod = ({ methods, selected, onSelect }) => (
  <div className="flex space-x-4">
    {methods.map((method) => (
      <button
        key={method}
        className={`px-4 py-2 rounded ${selected === method ? "bg-green-600 text-white" : "bg-gray-200"}`}
        onClick={() => onSelect(method)}
      >
        {method}
      </button>
    ))}
  </div>
);

export default PaymentMethod;
