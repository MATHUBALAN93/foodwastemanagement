import React from "react";
import { useAuth } from "../context/AuthContext";
import RestaurantDashboard from "../components/Dashboard/RestaurantDashboard";
import NGODashboard from "../components/Dashboard/NGODashboard";
import VolunteerDashboard from "../components/Dashboard/VolunteerDashboard";
import AdminDashboard from "../components/Dashboard/AdminDashboard";

const DashboardPage = () => {
  const { user } = useAuth();

  const getDashboardComponent = () => {
    if (!user) {
      return (
        <div className="p-8 text-center text-gray-600">
          Loading your dashboard...
        </div>
      );
    }
    switch (user?.role) {
      case "restaurant":
        return <RestaurantDashboard />;
      case "ngo":
        return <NGODashboard />;
      case "volunteer":
        return <VolunteerDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return (
          <div className="p-8 text-center text-gray-600">Unknown role</div>
        );
    }
  };

  return getDashboardComponent();
};

export default DashboardPage;
