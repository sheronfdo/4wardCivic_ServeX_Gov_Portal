import React, { useState, useEffect, useRef } from 'react';
import * as Chart from 'chart.js/auto';
import Layout from '../components/Layout';


// Chart Component
const ServiceUsageChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        chartInstance.current = new Chart.Chart(ctx, {
          type: 'bar',
          data: {
            labels: [
              'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ],
            datasets: [
              {
                label: 'Service Usage',
                data: [65, 59, 80, 81, 56, 55, 70, 85, 75, 90, 95, 88],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
                borderRadius: 4,
              },
              {
                label: 'Applications',
                data: [45, 49, 60, 71, 46, 45, 50, 65, 55, 70, 75, 68],
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 1,
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  stepSize: 20,
                  callback: function (value) {
                    return value + '%';
                  },
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)',
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
          },
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Usage Trends</h3>
      <p className="text-sm text-gray-600 mb-4">Monthly Service Applications</p>
      <div className="h-64">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const keyStats = [
    {
      title: 'Total Registered',
      value: '1000',
      subtitle: 'Up by 5 from last month',
      color: 'bg-blue-500',
    },
    {
      title: 'Active',
      value: '75',
      subtitle: 'Up by government',
      color: 'bg-blue-600',
    },
    {
      title: 'Pending',
      value: '5',
      subtitle: 'Pending from last month',
      color: 'bg-blue-700',
    },
    {
      title: 'Recent',
      value: '25',
      subtitle: 'New from today',
      color: 'bg-blue-800',
    },
  ];

  const activities = [
    {
      id: 1,
      description: 'New Authority Daily Police Report Application',
      timestamp: '2024-07-30 10:30 AM',
      status: 'Approved',
    },
    {
      id: 2,
      description: 'Service User For Data Updated',
      timestamp: '2024-07-30 09:30 PM',
      status: 'Approved',
    },
    {
      id: 3,
      description: 'A New User Dan Pella Modified',
      timestamp: '2024-07-30 08:30 PM',
      status: 'Approved',
    },
    {
      id: 4,
      description: 'Authority City Hall Contract Updated',
      timestamp: '2024-07-30 07:30 AM',
      status: 'Approved',
    },
    {
      id: 5,
      description: 'New Admin Account for Department Of Town Planning',
      timestamp: '2024-07-30 06:30 AM',
      status: 'Approved',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
      <div className="p-4 lg:p-6 space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Welcome, Administrator!</h1>
          <p className="text-gray-600 mt-1">
            Create your administrator account for the Government Authority Portal
          </p>
        </div>

        {/* Key Statistics */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Key statics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyStats.map((stat, index) => (
              <div key={index} className={`${stat.color} rounded-lg p-6 text-white`}>
                <h3 className="text-sm font-medium opacity-90">{stat.title}</h3>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                <p className="text-xs opacity-80 mt-1">{stat.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <ServiceUsageChart />

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
            <p className="text-sm text-gray-600 mt-1">Activity log</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">{activity.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{activity.timestamp}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          activity.status
                        )}`}
                      >
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
