import React, { useState, useEffect, useRef, useContext } from 'react';
import * as Chart from 'chart.js/auto';
import apiClient from '../utils/apiClient';
import { AuthContext } from '../context/AuthContext';
import RoleBasedProtected from '../components/RoleBasedProtected';
const ServiceUsageChart = ({ chartData }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartData) return; // No data yet

    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        // console.log('chartData:', chartData.datasets); // Log the chart dat
        chartInstance.current = new Chart.Chart(ctx, {
          type: 'bar',
          data: {
            labels: chartData.labels || [],
            datasets: chartData.datasets || {},
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  stepSize: 20,
                  callback: (value) => value + '%',
                },
              },
              x: { grid: { display: false } },
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
  }, [chartData]);

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


  const { token ,user} = useContext(AuthContext);
  const [fetchdata, setfetchdata] = useState({});
  const [fetchpeek, setfetchpeek] = useState({})
  const [requestedservic,setrequestedservic] = useState({})
  const userRole = user?.role || 'GovAdmin'; 
  
  useEffect(() => {
    fetchDataStats();
  }, []);

  const fetchDataStats = async () => {
    try {
      const [servicesres, peekRes,requestedservicRes] = await Promise.all([
        apiClient.get("/dash/summary", token),
        apiClient.get("/servicerequested/peek", token),
        apiClient.get("/servicerequested/requested/count", token)
      ]);
      //const servicesres = await apiClient.get('/dash/summary', token);
      setfetchdata(servicesres.data);
      setfetchpeek(peekRes.peak_hours);
      setrequestedservic(requestedservicRes)
    } catch (error) {
      console.error('Error fetching services:', error);
      setfetchdata({});
    }
  };

  useEffect(() => {
    console.log(JSON.stringify(fetchdata, null, 2)); // Pretty print JSON
  }, [fetchdata]);

  const topPeak = fetchpeek && fetchpeek.length > 0 
  ? fetchpeek.reduce((max, curr) => (curr[1] > max[1] ? curr : max))[0] + "h"
  : "0 h";
  console.log(requestedservic.data)
  const keyStats = [
    {
      title: 'Total Services',
      value: fetchdata.summary?.total_services || '0',
      subtitle: 'Up by 5 from last month',
      color: 'bg-blue-500',
    },
    {
      title: 'Total Tasks',
      value: requestedservic?.count ?? 0,
      subtitle: 'Up by government',
      color: 'bg-blue-600',
    },
    {
      title: 'Total Form Requested',
      value: requestedservic?.data?.[0]?.form_responses_count ?? 0,
      subtitle: 'Pending from last month',
      color: 'bg-blue-700',
    },
    {
      title: 'Peak Booking Time',
      value: topPeak,
      subtitle: 'peak times booked',
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
      <div className="flex justify-between items-start">
        <div>
          <RoleBasedProtected userRole={userRole} allowedRoles={['GovAdmin']}>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Welcome, Administrator!</h1>
          <p className="text-gray-600 mt-1">
            Create your administrator account for the Government Authority Portal
          </p>
          </RoleBasedProtected>
          <RoleBasedProtected userRole={userRole} allowedRoles={['GovStaff']}>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Welcome, Staff Member!</h1>
          <p className="text-gray-600 mt-1">
            Access your staff dashboard for daily operations and service management
          </p>
          </RoleBasedProtected>
        </div>

        {/* Peak Booking Box - Right Aligned */}
        {/* <div className="bg-gradient-to-br from-red-100 to-red-500 shadow-lg rounded-lg p-4 w-72 ml-4">
          <h2 className="text-lg font-semibold text-red-800 mb-3">Peak Booking Time</h2>
          <div className="space-y-2">
            {fetchpeek && fetchpeek.length > 0 ? (
              <ul className="space-y-2">
                {fetchpeek.map(([hour, count], index) => (
                  <li key={index} className="flex justify-between items-center bg-white bg-opacity-50 rounded px-3 py-2">
                    <span className="font-medium text-red-700">{hour}h:</span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                      {count} count
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-red-600 italic">No peak hours data available</p>
            )}
          </div>
        </div> */}
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
      <ServiceUsageChart chartData={fetchdata.chart_data} />

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
