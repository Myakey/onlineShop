import React from 'react';
import { TrendingUp } from 'lucide-react';

const RevenueChart = ({ data = [25,30,28,35,40,38,45] }) => {
  const maxRevenue = Math.max(...data);

  return (
    <div className="bg-white rounded-2xl border-2 border-pink-100 p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <TrendingUp className="text-pink-600" size={20} /> Pendapatan Bulanan
      </h3>
      <div className="flex items-end justify-between h-32 gap-2">
        {data.map((rev, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-pink-100 rounded-t-lg relative group cursor-pointer hover:bg-pink-200 transition-all"
                 style={{ height: `${(rev / maxRevenue) * 100}%` }}>
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Rp {rev}jt
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-pink-500 to-cyan-500 rounded-t-lg"></div>
            </div>
            <span className="text-xs text-gray-600 font-medium">Bulan {idx+1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueChart;
