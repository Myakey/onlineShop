import React from 'react';

const InputField = ({ icon: Icon, name, type = "text", placeholder, value, onChange }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-purple-400" />
    </div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-12 pr-4 py-3 bg-white/90 border-0 rounded-xl text-gray-800 placeholder-gray-500
                 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all duration-300"
      required={name !== 'phoneNumber'}
    />
  </div>
);

export default InputField;