import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  MapPin,
  Filter,
  Clock,
  Package,
  CheckCircle,
  Truck,
  Heart,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";

const NGODashboard = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDonations = async () => {
    try {
      setError(null);
      setLoading(true);
      // pending donations available to NGO
      const availableRes = await axios.get("/api/donations/available");
      const available = (availableRes.data?.donations || []).map((d) => ({
        ...d,
      }));
      // donations already accepted by this NGO
      const myRes = await axios.get("/api/donations/my-donations");
      const mine = (myRes.data || []).map((d) => ({ ...d }));
      // merge and sort by createdAt desc
      const map = new Map();
      [...available, ...mine].forEach((d) => map.set(d._id, d));
      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setDonations(merged);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const stats = [
    {
      label: "Donations Collected",
      value: "89",
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Meals Distributed",
      value: "1,240",
      icon: Users,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Active Requests",
      value: "5",
      icon: Clock,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
    {
      label: "Impact Score",
      value: "87%",
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  const filters = [
    { id: "all", label: "All Donations", count: donations.length },
    {
      id: "available",
      label: "Available",
      count: donations.filter((d) => d.status === "pending").length,
    },
    {
      id: "accepted",
      label: "Accepted",
      count: donations.filter((d) => d.status === "accepted").length,
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      available: "bg-green-100 text-green-800",
      accepted: "bg-blue-100 text-blue-800",
      picked_up: "bg-purple-100 text-purple-800",
      delivered: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getTimeLeft = (expiryTime) => {
    const now = new Date();
    const diff = expiryTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const filteredDonations = donations.filter((donation) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "available") return donation.status === "pending";
    if (selectedFilter === "accepted") return donation.status === "accepted";
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">NGO Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Find and collect food donations in your area
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadDonations}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <MapPin className="h-5 w-5" />
          <span>Refresh</span>
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
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((filter) => (
          <motion.button
            key={filter.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedFilter(filter.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedFilter === filter.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filter.label} ({filter.count})
          </motion.button>
        ))}
      </div>

      {/* Available Donations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDonations.map((donation, index) => (
          <motion.div
            key={donation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            {donation.images && donation.images[0] && (
              <img
                src={donation.images[0]}
                alt={donation.foodType}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {donation.foodType}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {donation.restaurant?.organizationName ||
                      donation.restaurant?.name}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    donation.status
                  )}`}
                >
                  {donation.status === "pending" && (
                    <Package className="h-3 w-3 mr-1" />
                  )}
                  {donation.status === "accepted" && (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  )}
                  {donation.status.charAt(0).toUpperCase() +
                    donation.status.slice(1)}
                </span>
              </div>

              <p className="text-gray-600 mb-4 text-sm">
                {donation.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{donation.quantity}</span>
                </div>
                {donation.expiryTime && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Time left:</span>
                    <span className="font-medium text-orange-600">
                      {getTimeLeft(new Date(donation.expiryTime))}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                {donation.status === "pending" ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={async () => {
                        try {
                          await axios.post(
                            `/api/donations/${donation._id}/accept`
                          );
                          await loadDonations();
                        } catch (e) {
                          alert(
                            e.response?.data?.message || "Failed to accept"
                          );
                        }
                      }}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Accept
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Details
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                    >
                      <Truck className="h-4 w-4" />
                      <span>Mark Picked Up</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDonations.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No donations found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or check back later for new donations.
          </p>
        </div>
      )}
    </div>
  );
};

export default NGODashboard;
