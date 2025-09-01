import React, { useState, useContext } from 'react';
import apiClient from '../utils/apiClient';
import { AuthContext } from '../context/AuthContext';

const Settings = () => {
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Government Authority Portal',
    siteDescription: 'Official Government Services Platform',
    contactEmail: 'admin@gov.portal.lk',
    supportPhone: '+94-11-123-4567',
    timezone: 'Asia/Colombo',
    language: 'English'
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    passwordExpiry: '90',
    twoFactorAuth: false,
    allowMultipleSessions: true,
    ipWhitelist: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    systemAlerts: true,
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: 'daily'
  });

  const handleSaveSettings = async (settingsType) => {
    setIsLoading(true);
    try {
      let endpoint = '';
      let data = {};
      
      switch(settingsType) {
        case 'general':
          endpoint = '/settings/general';
          data = generalSettings;
          break;
        case 'security':
          endpoint = '/settings/security';
          data = securitySettings;
          break;
        case 'notifications':
          endpoint = '/settings/notifications';
          data = notificationSettings;
          break;
      }

      // await apiClient.put(endpoint, data, token);
      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
    setIsLoading(false);
  };

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'users', name: 'User Management', icon: '👥' },
    { id: 'system', name: 'System', icon: '💻' }
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure your Government Authority Portal settings
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">General Settings</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Phone
                  </label>
                  <input
                    type="tel"
                    value={generalSettings.supportPhone}
                    onChange={(e) => setGeneralSettings({...generalSettings, supportPhone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Asia/Colombo">Asia/Colombo</option>
                    <option value="UTC">UTC</option>
                    <option value="Asia/Dhaka">Asia/Dhaka</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Description
                </label>
                <textarea
                  rows={3}
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => handleSaveSettings('general')}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save General Settings'}
              </button>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Security Settings</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Expiry (days)
                  </label>
                  <input
                    type="number"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="twoFactorAuth"
                    checked={securitySettings.twoFactorAuth}
                    onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="twoFactorAuth" className="ml-2 text-sm text-gray-700">
                    Enable Two-Factor Authentication
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="multipleSessions"
                    checked={securitySettings.allowMultipleSessions}
                    onChange={(e) => setSecuritySettings({...securitySettings, allowMultipleSessions: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="multipleSessions" className="ml-2 text-sm text-gray-700">
                    Allow Multiple Sessions
                  </label>
                </div>
              </div>

              <button
                onClick={() => handleSaveSettings('security')}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Security Settings'}
              </button>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Notification Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">SMS Notifications</h4>
                    <p className="text-sm text-gray-600">Receive critical alerts via SMS</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.smsNotifications}
                    onChange={(e) => setNotificationSettings({...notificationSettings, smsNotifications: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">System Alerts</h4>
                    <p className="text-sm text-gray-600">Important system notifications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.systemAlerts}
                    onChange={(e) => setNotificationSettings({...notificationSettings, systemAlerts: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">Maintenance Mode</h4>
                    <p className="text-sm text-gray-600">Put the system in maintenance mode</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.maintenanceMode}
                    onChange={(e) => setNotificationSettings({...notificationSettings, maintenanceMode: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Backup Frequency
                </label>
                <select
                  value={notificationSettings.backupFrequency}
                  onChange={(e) => setNotificationSettings({...notificationSettings, backupFrequency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <button
                onClick={() => handleSaveSettings('notifications')}
                disabled={isLoading}
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Notification Settings'}
              </button>
            </div>
          )}

          {/* User Management */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">User Management</h3>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium">
                  Add New User
                </button>
              </div>

              {/* User Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-500 rounded-lg p-4 text-white">
                  <h4 className="text-sm font-medium opacity-90">Total Users</h4>
                  <p className="text-2xl font-bold mt-1">1,247</p>
                  <p className="text-xs opacity-80">Active accounts</p>
                </div>
                <div className="bg-blue-600 rounded-lg p-4 text-white">
                  <h4 className="text-sm font-medium opacity-90">Admin Users</h4>
                  <p className="text-2xl font-bold mt-1">12</p>
                  <p className="text-xs opacity-80">Administrator roles</p>
                </div>
                <div className="bg-blue-700 rounded-lg p-4 text-white">
                  <h4 className="text-sm font-medium opacity-90">Pending Approvals</h4>
                  <p className="text-2xl font-bold mt-1">8</p>
                  <p className="text-xs opacity-80">Awaiting approval</p>
                </div>
              </div>

              {/* User Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <div className="text-center">
                    <h4 className="font-medium text-gray-800">Bulk User Import</h4>
                    <p className="text-sm text-gray-600 mt-1">Import users from CSV file</p>
                  </div>
                </button>
                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <div className="text-center">
                    <h4 className="font-medium text-gray-800">User Role Management</h4>
                    <p className="text-sm text-gray-600 mt-1">Manage user permissions</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">System Information</h3>
              
              {/* System Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">System Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Server Status:</span>
                      <span className="text-green-600 font-medium">Online</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Database:</span>
                      <span className="text-green-600 font-medium">Connected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Backup:</span>
                      <span className="text-gray-800">2024-01-28 03:00 AM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">System Version:</span>
                      <span className="text-gray-800">v2.1.4</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Storage Usage</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Database</span>
                        <span className="text-gray-800">2.3 GB / 10 GB</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '23%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Files</span>
                        <span className="text-gray-800">1.8 GB / 5 GB</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '36%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button className="bg-blue-800 hover:bg-blue-900 text-white p-4 rounded-lg font-medium">
                  Create Backup
                </button>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-lg font-medium">
                  Clear Cache
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg font-medium">
                  System Restart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;