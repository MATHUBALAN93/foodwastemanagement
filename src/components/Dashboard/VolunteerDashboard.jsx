import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  Package,
  Route,
  Star,
  Award,
  Navigation,
  Phone,
} from "lucide-react";
import { format } from "date-fns";

const VolunteerDashboard = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await axios.get("/api/donations/ready-for-pickup");
      const ready = res.data?.donations || [];
      const myRes = await axios.get("/api/donations/my-donations");
      const mine = (myRes.data || []).filter((d) => d.status !== "delivered");
      const map = new Map();
      [...ready, ...mine].forEach((d) => map.set(d._id, d));
      setTasks(Array.from(map.values()));
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const stats = [
    {
      label: "Deliveries Completed",
      value: "42",
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Total Distance",
      value: "238 km",
      icon: Route,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Active Deliveries",
      value: "2",
      icon: Truck,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
    {
      label: "Rating",
      value: "4.9",
      icon: Star,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status) => {
    const colors = {
      available: "bg-blue-100 text-blue-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const icons = {
      available: Package,
      in_progress: Truck,
      completed: CheckCircle,
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
            Volunteer Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Help deliver food donations and make a difference
          </p>
        </div>
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <MapPin className="h-5 w-5" />
            <span>View Map</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Go Online
          </motion.button>
        </div>
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

      {/* Delivery Tasks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Delivery Tasks
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadTasks}
              className="text-sm px-3 py-1.5 border rounded-lg"
            >
              Refresh
            </motion.button>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-6 text-gray-600">Loading...</div>
          ) : error ? (
            <div className="p-6 text-red-700 bg-red-50 border-b border-red-200 text-sm">
              {error}
            </div>
          ) : (
            tasks.map((task, index) => (
              <motion.div
                key={task._id || task.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  {task.images && task.images[0] && (
                    <img
                      src={task.images[0]}
                      alt={task.foodType}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {task.foodType}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Quantity: {task.quantity}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority} priority
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {getStatusIcon(task.status)}
                          <span className="ml-1 capitalize">
                            {task.status.replace("_", " ")}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Pickup Location */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Package className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">
                            Pickup
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {task.restaurant?.organizationName ||
                            task.restaurant?.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {task.pickupLocation?.address}
                        </p>
                      </div>

                      {/* Delivery Location */}
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPin className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-900">
                            Delivery
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {task.acceptedBy?.organizationName ||
                            task.acceptedBy?.name ||
                            "TBD"}
                        </p>
                        <p className="text-xs text-gray-600">
                          {task.acceptedBy
                            ? "Accepted organization"
                            : "Awaiting NGO acceptance"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-4">
                        <span>Status: {task.status}</span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      {task.status === "accepted" && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={async () => {
                              try {
                                await axios.post(
                                  `/api/donations/${task._id}/claim`
                                );
                                await loadTasks();
                              } catch (e) {
                                alert(
                                  e.response?.data?.message || "Failed to claim"
                                );
                              }
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            Claim Pickup
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Navigation className="h-4 w-4" />
                            <span>Get Directions</span>
                          </motion.button>
                        </>
                      )}

                      {task.status === "picked_up" && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={async () => {
                              try {
                                await axios.put(
                                  `/api/donations/${task._id}/status`,
                                  { status: "delivered" }
                                );
                                await loadTasks();
                              } catch (e) {
                                alert(
                                  e.response?.data?.message ||
                                    "Failed to mark delivered"
                                );
                              }
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            Mark Delivered
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Phone className="h-4 w-4" />
                            <span>Contact</span>
                          </motion.button>
                        </>
                      )}

                      {task.status === "delivered" && (
                        <div className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>Task Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Achievement Section */}
      <div className="mt-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Volunteer of the Month!</h3>
            <p className="text-purple-100">
              You've completed 42 deliveries this month. Keep up the great work!
            </p>
          </div>
          <div className="text-right">
            <Award className="h-12 w-12 text-yellow-300 mx-auto mb-2" />
            <p className="text-sm text-purple-100">Achievement Unlocked</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
