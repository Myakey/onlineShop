import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCard = ({ label, value, Icon, color, growth }) => {
  const isPositive = growth?.startsWith('+');
  const colorMap = {
    pink: 'from-pink-500 to-pink-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    cyan: 'from-cyan-500 to-cyan-600'
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-pink-100 p-6 hover:shadow-xl hover:border-pink-300 transition-all transform hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 bg-gradient-to-br ${colorMap[color]} rounded-xl shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {growth && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {growth}
          </div>
        )}
      </div>
      <div>
        <p className="text-gray-500 text-sm mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
