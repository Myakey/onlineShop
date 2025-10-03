import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

const OrderStatusCard = ({ type = 'pending', count = 0 }) => {
  const config = {
    pending: { color: 'yellow', icon: Clock, label: 'Pesanan Menunggu', note: 'Butuh perhatian' },
    completed: { color: 'green', icon: CheckCircle, label: 'Pesanan Selesai', note: '+5 hari ini' },
    cancelled: { color: 'red', icon: AlertCircle, label: 'Pesanan Dibatalkan', note: 'Review diperlukan' },
  }[type];

  const Icon = config.icon;

  const bgMap = {
    yellow: 'from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700',
    green: 'from-green-50 to-green-100 border-green-200 text-green-700',
    red: 'from-red-50 to-red-100 border-red-200 text-red-700',
  };

  return (
    <div className={`bg-gradient-to-br ${bgMap[config.color]} rounded-2xl border-2 p-6 hover:shadow-xl transition-all`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-${config.color}-500 rounded-xl shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs font-semibold bg-opacity-30 px-3 py-1 rounded-full">{config.note}</span>
      </div>
      <p className={`text-${config.color}-700 text-sm mb-1 font-medium`}>{config.label}</p>
      <p className={`text-4xl font-bold text-${config.color}-800`}>{count}</p>
    </div>
  );
};

export default OrderStatusCard;
