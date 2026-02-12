import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Package, CheckCircle, Truck, XCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const DonationsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donations, setDonations] = useState([]);

  const fetchAvailable = async () => {
    try {
      setError(null);
      setLoading(true);
      const endpoint =
        user?.role === "volunteer"
          ? "/api/donations/ready-for-pickup"
          : "/api/donations/available";
      const res = await axios.get(endpoint);
      setDonations(res.data.donations || []);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  const acceptDonation = async (id) => {
    try {
      const res = await axios.post(`/api/donations/${id}/accept`);
      setDonations((prev) =>
        prev.map((d) => (d._id === id ? res.data.donation : d))
      );
    } catch (e) {
      alert(e.response?.data?.message || "Failed to accept donation");
    }
  };

  const claimDonation = async (id) => {
    try {
      await axios.post(`/api/donations/${id}/claim`);
      setDonations((prev) => prev.filter((d) => d._id !== id));
    } catch (e) {
      alert(e.response?.data?.message || "Failed to claim donation");
    }
  };

  useEffect(() => {
    fetchAvailable();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-600">
        Loading donations...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Available Donations
        </h1>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={fetchAvailable}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          Refresh
        </motion.button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {donations.map((donation) => (
          <div
            key={donation._id}
            className="bg-white border border-gray-100 rounded-xl p-5"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {donation.foodType}
                </h3>
                <p className="text-sm text-gray-600">
                  Quantity: {donation.quantity}
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {donation.status}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-4">{donation.description}</p>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="mr-4">
                  Restaurant:{" "}
                  {donation.restaurant?.organizationName ||
                    donation.restaurant?.name}
                </span>
              </div>
              {user?.role === "ngo" && donation.status === "pending" && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => acceptDonation(donation._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                >
                  Accept
                </motion.button>
              )}
              {user?.role === "volunteer" && donation.status === "accepted" && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => claimDonation(donation._id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  Claim Pickup
                </motion.button>
              )}
            </div>
          </div>
        ))}
      </div>

      {donations.length === 0 && (
        <div className="text-center py-16 text-gray-600">
          No donations available right now.
        </div>
      )}
    </div>
  );
};

export default DonationsPage;
