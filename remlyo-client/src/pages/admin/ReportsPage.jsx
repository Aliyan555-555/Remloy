// src/pages/admin/ReportsPage.jsx
import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/common/Button";
import { LineChart } from "../../components/charts/LineChart";

const ReportsPage = () => {
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState("monthly");

  // Mock data for stats with icons
const statsData = [
  {
    title: "Total users",
    value: "50,289",
    trend: "up",
    trendValue: "12%",
    trendPeriod: "this month",
    icon: (
      <div className="h-16 w-16 bg-opacity-40 flex items-center justify-center">
        <img
          src="/images/users-icon.png"
          alt="Users Icon"
          className="w-14 h-14"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/56?text=👥";
          }}
        />
      </div>
    ),
  },
  {
    title: "Active Users",
    value: "1,234",
    trend: "up",
    trendValue: "8%",
    trendPeriod: "this month",
    icon: (
      <div className="h-16 w-16 bg-opacity-40 flex items-center justify-center">
        <img
          src="/images/active-users.png"
          alt="Active Users Icon"
          className="w-14 h-14"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/56?text=👥";
          }}
        />
      </div>
    ),
  },
  {
    title: "Revenue",
    value: "$50",
    trend: "up",
    trendValue: "4%",
    trendPeriod: "this month",
    icon: (
      <div className="h-16 w-16 bg-opacity-40 flex items-center justify-center">
        <img
          src="/images/report 1.png"
          alt="Revenue Icon"
          className="w-14 h-14"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/56?text=💰";
          }}
        />
      </div>
    ),
  },
  {
    title: "User Growth Rate",
    value: "2208",
    trend: "up",
    trendValue: "17%",
    trendPeriod: "this month",
    icon: (
      <div className="h-16 w-16 bg-opacity-40 flex items-center justify-center">
        <img
          src="/images/subscription 1.png"
          alt="Growth Icon"
          className="w-14 h-14"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/56?text=📈";
          }}
        />
      </div>
    ),
  },
  {
    title: "Engagement Rate",
    value: "95%",
    trend: "up",
    trendValue: "3%",
    trendPeriod: "this month",
    icon: (
      <div className="h-16 w-16 bg-opacity-40 flex items-center justify-center">
        <img
          src="/images/success-rate-icon.png"
          alt="Engagement Icon"
          className="w-14 h-14"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/56?text=👍";
          }}
        />
      </div>
    ),
  },
  {
    title: "Churn Rate",
    value: "5.2%",
    trend: "up",
    trendValue: "1.5%",
    trendPeriod: "this month",
    icon: (
      <div className="h-16 w-16 bg-opacity-40 flex items-center justify-center">
        <img
          src="/images/churn-rate 1.png"
          alt="Churn Icon"
          className="w-14 h-14"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/56?text=👋";
          }}
        />
      </div>
    ),
  },
  {
    title: "Conversion Rate",
    value: "12.3%",
    trend: "up",
    trendValue: "2.1%",
    trendPeriod: "this month",
    icon: (
      <div className="h-16 w-16 bg-opacity-40 flex items-center justify-center">
        <img
          src="/images/conversion 1.png"
          alt="Conversion Icon"
          className="w-14 h-14"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/56?text=🔄";
          }}
        />
      </div>
    ),
  },
  {
    title: "5 Ailments Viewed",
    value: "Migraine",
    trend: null,
    trendValue: null,
    trendPeriod: null,
    icon: (
      <div className="h-16 w-16 bg-opacity-40 flex items-center justify-center">
        <img
          src="/images/remedy-icon.png"
          alt="Ailments Icon"
          className="w-14 h-14"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/56?text=🩺";
          }}
        />
      </div>
    ),
  },
  {
    title: "Avg Remedy Rating",
    value: "4.6/5",
    trend: "up",
    trendValue: "0.3%",
    trendPeriod: "this month",
    icon: (
      <div className="h-16 w-16 bg-opacity-40 flex items-center justify-center">
        <img
          src="/images/review 1.png"
          alt="Rating Icon"
          className="w-14 h-14"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/56?text=⭐";
          }}
        />
      </div>
    ),
  },
];

  // Revenue data for line chart
  const revenueData = [
    { month: "Jan", revenue: 5000 },
    { month: "Feb", revenue: 6000 },
    { month: "Mar", revenue: 8000 },
    { month: "Apr", revenue: 11000 },
    { month: "May", revenue: 15000 },
    { month: "Jun", revenue: 20000 },
    { month: "Jul", revenue: 18000 },
    { month: "Aug", revenue: 22000 },
    { month: "Sep", revenue: 28000 },
    { month: "Oct", revenue: 25000 },
    { month: "Nov", revenue: 30000 },
    { month: "Dec", revenue: 27000 },
  ];

  // User distribution data
  const userDistribution = [
    { name: "Premium", value: 650, color: "#2F6A50" },
    { name: "Pay per remedy / 5 remedy", value: 200, color: "#10B981" },
    { name: "Pay per remedy / 10 remedy", value: 250, color: "#34D399" },
    { name: "Free", value: 1100, color: "#E5E7EB" },
  ];

  // Calculate total users
  const totalUsers = userDistribution.reduce((sum, item) => sum + item.value, 0);

  return (
    <DashboardLayout pageTitle="Reports & Analytics" user={user} isPremiumUser={true}>
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600">Track user engagement and revenue metrics</p>
        <Button
          variant="outlined"
          color="brand"
          className="flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          Export Report
        </Button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {statsData.slice(0, 9).map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                {stat.trend && (
                  <div className="flex items-center text-sm">
                    <span className={`mr-1 ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                      {stat.trend === "up" ? "↑" : "↓"}
                    </span>
                    <span className="text-green-500 mr-1">{stat.trendValue}</span>
                    <span className="text-gray-500">{stat.trendPeriod}</span>
                  </div>
                )}
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Tracking Section */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Revenue Tracking</h2>
        {/* Improved green background with proper height and styling */}
        <div className="bg-brand-green rounded-lg pb-6" style={{ backgroundColor: "#2F6A50" }}>
          <div className="flex pt-6 px-6 space-x-4">
            <div className="relative">
              <button
                className="flex items-center bg-brand-green border border-white text-white px-4 py-2 rounded-md"
              >
                <span>Yearly</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <button
                className="flex items-center bg-brand-green border border-white text-white px-4 py-2 rounded-md"
              >
                <span>Premium</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          {/* Line chart with a white background */}
          <div className="bg-white mx-6 mt-4 rounded-lg p-4" style={{ height: "400px", minHeight: "350px" }}>
            <LineChart
              data={revenueData}
              lines={[{ key: "revenue", color: "#276749", name: "Revenue" }]}
              xAxisKey="month"
              showGrid={true}
              showLegend={false}
            />
          </div>
        </div>
      </div>

      {/* User Engagement Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">User Engagement</h2>
          <div className="relative">
            <button
              className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-1 rounded-md text-sm"
            >
              <span>Monthly</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 mb-6 md:mb-0">
            {/* Custom Donut Chart to replace PieChart */}
            <div className="relative flex items-center justify-center h-80">
              <div className="relative w-64 h-64">
                {/* Custom donut chart using CSS */}
                <div className="absolute inset-0 rounded-full bg-gray-200"></div>
                <div 
                  className="absolute inset-0 rounded-full bg-brand-green"
                  style={{ 
                    clipPath: 'polygon(50% 50%, 100% 50%, 100% 0, 50% 0, 0 0, 0 50%, 50% 50%)',
                  }}
                ></div>
                <div 
                  className="absolute inset-0 rounded-full bg-green-500"
                  style={{ 
                    clipPath: 'polygon(50% 50%, 50% 0, 20% 0, 0 20%, 0 50%, 50% 50%)',
                  }}
                ></div>
                <div 
                  className="absolute inset-0 rounded-full bg-green-300"
                  style={{ 
                    clipPath: 'polygon(50% 50%, 0 50%, 0 80%, 20% 100%, 50% 100%, 50% 50%)',
                  }}
                ></div>
                {/* Center circle for donut effect */}
                <div className="absolute inset-0 m-16 rounded-full bg-white flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold">{totalUsers}</h3>
                    <p className="text-sm text-gray-600">Total User</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 md:pl-8">
            <ul className="space-y-4">
              {userDistribution.map((item, index) => (
                <li key={index} className="flex items-center">
                  <span 
                    className="w-4 h-4 rounded-full mr-3" 
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span>{item.name} - {item.value} user</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;