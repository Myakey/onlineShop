import React, { useState } from 'react';
import { TrendingUp, Users, ShoppingCart, DollarSign, Eye } from 'lucide-react';

import Header from '../components/admin/Header';
import StatsCard from '../components/admin/StatsCard';
import GrowthChart from '../components/admin/GrowthChart';
import MostSellingProducts from '../components/admin/MostSellingProducts';
import LeastSellingProducts from '../components/admin/LeastSellingProducts';
import VIPMemberCard from '../components/admin/VIPMemberCard';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('12months');

  const analyticsData = {
    totalSales: 5023,
    earnings: 80218234,
    webVisitors: 12556,
    totalOrders: 346
  };

  const vipMembers = [
    { id: 1, name: 'Username', joinDate: 'Joined since Jan 13, 2022', earnings: 5321097, avatar: '👤' },
    { id: 2, name: 'Username 2', joinDate: 'Joined since Jan 13, 2022', earnings: 5321097, avatar: '👤' },
    { id: 3, name: 'Username 3', joinDate: 'Joined since Jan 13, 2022', earnings: 5321097, avatar: '👤' }
  ];

  const products = [
    { id: 'A', name: 'Product A', price: 24, sales: 234, image: '🕷️' },
    { id: 'B', name: 'Product B', price: 24, sales: 234, image: '🕷️' }
  ];

  const chartPoints = [
    { x: 10, y: 80 }, { x: 25, y: 60 }, { x: 40, y: 70 }, { x: 55, y: 65 },
    { x: 70, y: 85 }, { x: 85, y: 75 }, { x: 100, y: 90 }, { x: 115, y: 85 },
    { x: 130, y: 95 }, { x: 145, y: 88 }, { x: 160, y: 92 }, { x: 175, y: 78 }
  ];

  const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Analytic Dashboards</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatsCard title="Total Sales" value={formatNumber(analyticsData.totalSales)} icon={<TrendingUp className="w-5 h-5 text-blue-500" />} color="text-green-500"/>
            <StatsCard title="Earnings" value={`RP ${formatNumber(analyticsData.earnings)}`} icon={<DollarSign className="w-5 h-5 text-blue-500" />} color="text-purple-500"/>
            <StatsCard title="Total Web Visitors" value={formatNumber(analyticsData.webVisitors)} icon={<Eye className="w-5 h-5 text-blue-500" />} color="text-orange-500"/>
            <StatsCard title="Total Order" value={analyticsData.totalOrders} icon={<ShoppingCart className="w-5 h-5 text-blue-500" />} color="text-pink-500"/>
          </div>

          <GrowthChart points={chartPoints} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <MostSellingProducts products={products} />
          <LeastSellingProducts products={products} />
          <div className="bg-white text-gray-800 rounded-lg p-6">
            <h3 className="font-medium text-gray-600 mb-4 text-orange-500">VIP Members</h3>
            <div className="space-y-3">
              {vipMembers.map(member => (
                <VIPMemberCard key={member.id} member={member} formatNumber={formatNumber} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
