import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Plus,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  TrendingUp,
  Users,
  Heart,
  Camera,
} from "lucide-react";
import { format } from "date-fns";

const RestaurantDashboard = () => {
  const [showAddDonation, setShowAddDonation] = useState(false);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    foodType: "Cooked Meals",
    quantity: "",
    expiryTime: "",
    pickupAddress: "",
    description: "",
  });

  const fetchMyDonations = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await axios.get("/api/donations/my-donations");
      setDonations(res.data || []);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, []);

  const stats = [
    {
      label: "Total Donations",
      value: "127",
      icon: Heart,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      label: "Meals Provided",
      value: "2,450",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Active Listings",
      value: "8",
      icon: Package,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Impact Score",
      value: "94%",
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      picked_up: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      expired: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      accepted: CheckCircle,
      picked_up: Truck,
      delivered: CheckCircle,
      expired: XCircle,
    };
    const Icon = icons[status] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Restaurant Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your food donations and track impact
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddDonation(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Donation</span>
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

      {/* Recent Donations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Donations
          </h2>
        </div>

        {error && (
          <div className="px-6 py-3 text-sm text-red-700 bg-red-50 border-b border-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-6 text-gray-600">Loading...</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {donations.map((donation, index) => (
              <motion.div
                key={donation._id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  {donation.images && donation.images[0] && (
                    <img
                      src={donation.images[0]}
                      alt={donation.foodType}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {donation.foodType}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {donation.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>Quantity: {donation.quantity}</span>
                          {donation.createdAt && (
                            <span>
                              Created:{" "}
                              {format(
                                new Date(donation.createdAt),
                                "MMM d, HH:mm"
                              )}
                            </span>
                          )}
                          {donation.expiryTime && (
                            <span>
                              Expires:{" "}
                              {format(
                                new Date(donation.expiryTime),
                                "MMM d, HH:mm"
                              )}
                            </span>
                          )}
                        </div>
                        {donation.acceptedBy?.organizationName ||
                        donation.acceptedBy?.name ? (
                          <p className="text-sm text-blue-600 mt-1">
                            Accepted by{" "}
                            {donation.acceptedBy.organizationName ||
                              donation.acceptedBy.name}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            donation.status
                          )}`}
                        >
                          {getStatusIcon(donation.status)}
                          <span className="ml-1 capitalize">
                            {String(donation.status).replace("_", " ")}
                          </span>
                        </span>
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            View
                          </motion.button>
                          {donation.status === "pending" && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-sm text-red-600 hover:text-red-800 transition-colors"
                            >
                              Cancel
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {donations.length === 0 && (
              <div className="p-6 text-gray-600">
                No donations yet. Click "Add Donation" to create one.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Donation Modal */}
      {showAddDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Add New Donation
                </h2>
                <button
                  onClick={() => setShowAddDonation(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form
                className="space-y-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const formData = new FormData();
                    const foodTypeMap = {
                      "Cooked Meals": "cooked_meals",
                      "Fresh Vegetables": "fresh_vegetables",
                      Fruits: "fruits",
                      "Bread & Pastries": "bread_pastries",
                      "Dairy Products": "dairy_products",
                      Other: "other",
                    };
                    const apiFoodType = foodTypeMap[form.foodType] || "other";
                    formData.append("foodType", apiFoodType);
                    formData.append("quantity", form.quantity);
                    formData.append("expiryTime", form.expiryTime);
                    formData.append("pickupAddress", form.pickupAddress);
                    formData.append("description", form.description);
                    const res = await axios.post("/api/donations", formData, {
                      headers: { "Content-Type": "multipart/form-data" },
                    });
                    setShowAddDonation(false);
                    setForm({
                      foodType: "Cooked Meals",
                      quantity: "",
                      expiryTime: "",
                      pickupAddress: "",
                      description: "",
                    });
                    await fetchMyDonations();
                  } catch (err) {
                    alert(
                      err.response?.data?.message || "Failed to create donation"
                    );
                  }
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Food Type
                    </label>
                    <select
                      value={form.foodType}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, foodType: e.target.value }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Cooked Meals">Cooked Meals</option>
                      <option value="Fresh Vegetables">Fresh Vegetables</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Bread & Pastries">Bread & Pastries</option>
                      <option value="Dairy Products">Dairy Products</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 20 portions, 5 kg"
                      value={form.quantity}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, quantity: e.target.value }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="datetime-local"
                      value={form.expiryTime}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, expiryTime: e.target.value }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Location
                    </label>
                    <input
                      type="text"
                      placeholder="Street address"
                      value={form.pickupAddress}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          pickupAddress: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Describe the food, preparation method, storage conditions..."
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Create Donation
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowAddDonation(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;
