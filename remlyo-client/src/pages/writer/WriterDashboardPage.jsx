// src/pages/admin/AdminDashboardPage.jsx
import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import Button from "../../components/common/Button";
import { LineChart } from "../../components/charts/LineChart";
import { useAuth } from "../../contexts/AuthContext";

const WriterDashboardPage = () => {
  const { user } = useAuth();

  // Stats data
  const statsData = [
    {
      title: "Total users",
      value: "50,289",
      icon: (
        <div className="opacity-400">
          <img
            src="/images/users-icon.png"
            alt="Users Icon"
            className="w-12 h-12"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/48?text=👥";
            }}
          />
        </div>
      ),
      trend: "up",
      trendValue: "12%",
      trendPeriod: "this month",
    },
    {
      title: "Active Remedies",
      value: "1,234",
      icon: (
        <div className="opacity-400">
          <img
            src="/images/remedy-icon.png"
            alt="Remedies Icon"
            className="w-12 h-12"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/48?text=💊";
            }}
          />
        </div>
      ),
      trend: "up",
      trendValue: "8%",
      trendPeriod: "this month",
    },
    {
      title: "Success rate",
      value: "95%",
      icon: (
        <div className="opacity-400">
          <img
            src="/images/success-rate-icon.png"
            alt="Success Icon"
            className="w-12 h-12"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/48?text=📈";
            }}
          />
        </div>
      ),
      trend: "up",
      trendValue: "3%",
      trendPeriod: "this month",
    },
  ];

  // Second row stat cards
  const secondRowStats = [
    {
      title: "Review Flagged Remedies",
      value: "330",
      icon: (
        <div className="opacity-400">
          <img
            src="/images/review 1.png"
            alt="Flag Icon"
            className="w-12 h-12"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/48?text=🚩";
            }}
          />
        </div>
      ),
      trend: "up",
      trendValue: "9%",
      trendPeriod: "this month",
      actionLabel: "Flagged Remedies",
      actionUrl: "/admin/flagged-remedies",
    },
    {
      title: "Moderate User Reports",
      value: "50",
      icon: (
        <div className="opacity-400">
          <img
            src="/images/report 1.png"
            alt="Report Icon"
            className="w-12 h-12"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/48?text=📋";
            }}
          />
        </div>
      ),
      trend: "up",
      trendValue: "4%",
      trendPeriod: "this month",
      actionLabel: "See Report",
      actionUrl: "/admin/user-reports",
    },
    {
      title: "User Subscriptions",
      value: "2208",
      icon: (
        <div className="opacity-400">
          <img
            src="/images/subscription 1.png"
            alt="Subscription Icon"
            className="w-12 h-12"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/48?text=💼";
            }}
          />
        </div>
      ),
      trend: "up",
      trendValue: "17%",
      trendPeriod: "this month",
      actionLabel: "Manage Subscriptions",
      actionUrl: "/admin/subscriptions",
    },
  ];

  // User growth chart data
  const userGrowthData = [
    { month: "Jan", users: 5000 },
    { month: "Feb", users: 7000 },
    { month: "Mar", users: 10000 },
    { month: "Apr", users: 15000 },
    { month: "May", users: 20000 },
    { month: "Jun", users: 25000 },
    { month: "Jul", users: 30000 },
    { month: "Aug", users: 28000 },
    { month: "Sep", users: 32000 },
    { month: "Oct", users: 30000 },
    { month: "Nov", users: 29000 },
    { month: "Dec", users: 30000 },
  ];

  // Recent activity data
  const recentActivity = [
    {
      id: 1,
      type: "remedy-try",
      user: "User JohnDoe123",
      action: "tried a new remedy",
      target: "Turmeric Tea",
      time: "5h ago",
    },
    {
      id: 2,
      type: "review",
      user: "User WellnessGuru",
      action: "left a review on",
      target: "Ginger Root",
      extraInfo: "⭐⭐⭐⭐⭐",
      time: "5h ago",
    },
  ];

  // Notifications data
  const notifications = [
    {
      id: 1,
      user: "Julia Wilson",
      avatar: "/images/BG.png",
      message: "A new remedy has been flagged for review",
      action: "See review...",
      status: "warning",
      time: "5h ago",
    },
    {
      id: 2,
      user: "Julia Wilson",
      avatar: "/images/BG.png",
      message: "complaint about a subscription issue",
      action: "Address issue now",
      status: "question",
      time: "5h ago",
    },
  ];

  return (
    <DashboardLayout pageTitle="Writer Dashboard" user={user}>
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendValue={stat.trendValue}
            trendPeriod={stat.trendPeriod}
          />
        ))}
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {secondRowStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-semibold text-gray-700 mb-2">
                  {stat.title}
                </h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-green-500 mr-1">↑</span>
                  <span className="mr-1">{stat.trendValue}</span>
                  <span className="text-gray-500">{stat.trendPeriod}</span>
                </div>
              </div>
              {stat.icon}
            </div>

            {/* Action Button */}
            {stat.actionLabel && (
              <div className="mt-4">
                <Button
                  variant="outlined"
                  color="brand"
                  size="small"
                  to={stat.actionUrl}
                >
                  {stat.actionLabel}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User Growth Chart */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">User Growth</h2>
          <div>
            <select
              className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              defaultValue="monthly"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <LineChart
            data={userGrowthData}
            lines={[{ key: "users", color: "#276749", name: "Total Users" }]}
            xAxisKey="month"
            showGrid={true}
            showLegend={false}
          />

          {/* Annotation for significant event */}
          <div className="flex justify-center items-center mt-2 text-sm text-gray-600">
            <div className="bg-green-100 rounded-lg px-3 py-1">
              +10K new users after campaign
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="p-4 flex items-start">
              <div className="mr-3 mt-1">
                <div className="h-2 w-2 rounded-full bg-brand-green"></div>
              </div>
              <div className="flex-grow">
                <p className="text-gray-700">
                  <span className="font-medium">{activity.user}</span>{" "}
                  {activity.action}{" "}
                  <span className="font-medium">{activity.target}</span>
                  {activity.extraInfo && (
                    <span className="ml-2">{activity.extraInfo}</span>
                  )}
                </p>
                {activity.reviewText && (
                  <p className="text-sm text-gray-500 mt-1">
                    {activity.reviewText}
                  </p>
                )}
                {activity.linkText && (
                  <button className="text-brand-green text-sm underline mt-1">
                    {activity.linkText}
                  </button>
                )}
              </div>
              <div className="text-sm text-gray-500 ml-4">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Notification</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-4 flex items-start">
              <div className="flex-shrink-0 mr-3">
                <img
                  src={notification.avatar}
                  alt={notification.user}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/32?text=👤";
                  }}
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-start">
                  <div>
                    <p className="text-gray-700">
                      <span className="font-medium">{notification.user}</span>
                    </p>
                    <div className="flex items-center mt-1">
                      {notification.status === "warning" && (
                        <span className="text-yellow-500 mr-2">⚠️</span>
                      )}
                      {notification.status === "question" && (
                        <span className="text-blue-500 mr-2">❓</span>
                      )}
                      <p className="text-gray-600">{notification.message}</p>
                    </div>
                    <button className="text-brand-green text-sm underline mt-1">
                      {notification.action}
                    </button>
                  </div>
                  <div className="text-sm text-gray-500 ml-auto">
                    {notification.time}
                  </div>
                </div>
              </div>
              <div className="flex ml-4 space-x-2">
                <Button
                  variant="outlined"
                  size="small"
                  color="brand"
                  className="text-xs px-2 py-1"
                >
                  Review Now
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="default"
                  className="text-xs px-2 py-1"
                >
                  Resolved
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WriterDashboardPage;
