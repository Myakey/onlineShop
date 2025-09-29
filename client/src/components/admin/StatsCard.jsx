import React from 'react';

const StatsCard = ({ title, value, icon, color }) => (
  <div className="bg-white text-gray-800 rounded-lg p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-medium text-gray-600">{title}</h3>
      {icon}
    </div>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

export default StatsCard;
