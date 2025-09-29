import React from 'react';

const GrowthChart = ({ points }) => (
  <div className="bg-white text-gray-800 rounded-lg p-6">
    <h3 className="font-medium text-gray-600 mb-4">UMKMS Growth over the last 12 months</h3>
    <div className="h-48 flex items-end justify-center">
      <svg width="200" height="120" className="w-full h-full">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path
          d={`M 0,120 ${points.map((p, i) => `${i === 0 ? 'L' : 'L'} ${p.x},${120 - p.y}`).join(' ')} L 200,120 Z`}
          fill="url(#gradient)"
        />
        <path
          d={`M ${points.map((p, i) => `${i === 0 ? '' : 'L'} ${p.x},${120 - p.y}`).join(' ')}`}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
        />
      </svg>
    </div>
  </div>
);

export default GrowthChart;
