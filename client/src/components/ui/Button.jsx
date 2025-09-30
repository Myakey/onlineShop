import React from "react";

const Button = ({ onClick, text, className }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold text-white transition-colors ${className || ""}`}
    >
      {text}
    </button>
  );
};

export default Button;
