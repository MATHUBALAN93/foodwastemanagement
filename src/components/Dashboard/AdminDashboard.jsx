import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  Award,
  BarChart3,
  Activity,
  Shield,
  UserCheck,
  UserX
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Users', value: '2,847', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', change: '+12%' },
    { label: 'Total Donations', value: '1,562', icon: Package, color: 'text-green-500', bg: 'bg-green-50', change: '+8%' },
    { label: 'Meals Saved', value: '45,230', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50', change: '+15%' },
    { label: 'Active Reports', value: '23', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', change: '-5%' }
  ];

  const monthlyData = [
    { month: 'Jan', donations: 120, meals: 2800, users: 45 },
    { month: 'Feb', donations: 145, meals: 3200, users: 52 },
    { month: 'Mar', donations: 132, meals: 2950, users: 48 },
    { month: 'Apr', donations: 167, meals: 3800, users: 61 },
    { month: 'May', donations: 156, meals: 3600, users: 58 },
    { month: 'Jun', donations: 189, meals: 4200, users: 67 }
  ];

  const userDistribution = [
    { name: 'Restaurants', value: 45, color: '#3B82F6' },
    { name: 'NGOs', value: 28, color: '#10B981' },
    { name: 'Volunteers', value: 27, color: '#8B5CF6' }
  ];

  const topDonors = [
    { name: 'Green Garden Restaurant', donations: 89, meals: 2100, rating: 4.9 },
    { name: 'Spice Palace', donations: 76, meals: 1840, rating: 4.8 },
    { name: 'Corner Bakery', donations: 65, meals: 1560, rating: 4.7 },
    { name: 'Ocean View Cafe', donations: 58, meals: 1390, rating: 4.6 },
    { name: 'Mountain Grill', donations: 52, meals: 1250, rating: 4.5 }
  ];

  const recentUsers = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'restaurant', status: 'pending', joinedAt: '2 hours ago' },
    { id: 2, name: 'Hope Kitchen NGO', email: 'admin@hopekitchen.org', role: 'ngo', status: 'approved', joinedAt: '5 hours ago' },
    { id: 3, name: 'Mike Chen', email: 'mike@example.com', role: 'volunteer', status: 'pending', joinedAt: '1 day ago' },
    { id: 4, name: 'Community Center', email: 'info@community.org', role: 'ngo', status: 'approved', joinedAt: '2 days ago' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'donations', label: 'Donations' },
    { id: 'reports', label: 'Reports' }
  ];

  const getRoleColor = (role) => {
    const colors = {
      restaurant: 'bg-blue-100 text-blue-800',
      ngo: 'bg-green-100 text-green-800',
      volunteer: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      blocked: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage platform operations and monitor performance</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
        >
          <Shield className="h-5 w-5" />
          <span>Security Center</span>
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Donations Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Donations</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="donations" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* User Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {userDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Donors Leaderboard */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Donors This Month</h3>
            <div className="space-y-4">
              {topDonors.map((donor, index) => (
                <motion.div
                  key={donor.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{donor.name}</h4>
                      <p className="text-sm text-gray-600">{donor.donations} donations • {donor.meals} meals saved</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-gray-900">{donor.rating}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent User Registrations</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {recentUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Joined {user.joinedAt}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                  <div className="flex space-x-2">
                    {user.status === 'pending' && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <UserCheck className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <UserX className="h-4 w-4" />
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Similar tab content for donations and reports would go here */}
    </div>
  );
};

export default AdminDashboard;