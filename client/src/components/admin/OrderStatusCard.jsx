import React from 'react';

const OrderStatusCard = ({ label, value, Icon, color }) => (
  <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-2xl shadow-md p-6`}>
    <div className="flex items-center gap-3 mb-2">
      <Icon className={`w-5 h-5 text-${color}-600`} />
      <h3 className="font-semibold text-gray-800">{label}</h3>
    </div>
    <p className={`text-3xl font-bold text-${color}-700`}>{value}</p>
  </div>
);

export default OrderStatusCard;
