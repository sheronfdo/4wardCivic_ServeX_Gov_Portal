import React, { useState, useEffect, useContext } from 'react';
import apiClient from '../utils/apiClient';
import LoadingSpinner from '../components/LoadingSpiner';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { token } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isChangepsw, setIsChangepsw] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileData, setProfileData] = useState({
    // Authority Details
    authorityName: '',
    email: '',
    address: '',
    phoneNumber: '',
    hotline: '',
    authorityIconurl: null,

    // Admin Details
    adminName: '',
    adminEmail: ''
  });

  const [formData, setFormData] = useState({ ...profileData });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // Use your get_profile endpoint
      const response = await apiClient.get('/auth/profile/authority', token);
      const data = response;

      setProfileData(data);
      setFormData(data);
      if (data.authorityIconurl) {
        setImagePreview(data.authorityIconurl);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // Set default values if API fails
      const defaultData = {
        authorityName: '',
        email: '',
        address: '',
        phoneNumber: '',
        hotline: '',
        authorityIconurl: null,
        adminName: '',
        adminEmail: ''
      };
      setProfileData(defaultData);
      setFormData(defaultData);
    } finally {
      setLoading(false);
    }
  };
  const handlePasswordChange = () => {
    // Add logic to handle password change here
    console.log('Password changed:', password);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    setUploading(true);

    try {
      const mediaForm = new FormData();
      mediaForm.append('file', file);

      const mediaRes = await apiClient.post('/media/upload', mediaForm, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }, token);

      if (mediaRes.data && mediaRes.data.id) {
        setFormData((prev) => ({
          ...prev,
          authorityIconurl: mediaRes.data.id, // save image ID
        }));
        // Update image preview with the actual URL if returned
        setImagePreview(mediaRes.data.url || URL.createObjectURL(file));
      } else {
        console.error('Upload response missing id:', mediaRes);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Create object for API request (not FormData since authorityIconurl is now an ID)
      const dataToSend = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '' && key !== 'authorityIconurl') {
          dataToSend[key] = formData[key];
        }
      });

      // Include authorityIconId if it exists
      if (formData.authorityIconurl) {
        dataToSend.authorityIconId = formData.authorityIconurl;
      }

      // Use your update_profile endpoint
      const response = await apiClient.put('/auth/profile/update', dataToSend, token);

      // Refresh data after successful update
      await fetchProfileData();
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    setImagePreview(profileData.authorityIconurl);
    setIsEditing(false);
  };

  if (loading && !isEditing) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Authority Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your authority and administrator information
          </p>
        </div>

        <div className="flex space-x-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading || uploading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading || uploading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Authority Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Authority Information</h3>

          {/* Authority Icon */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Authority Icon
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Authority Icon"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">No Icon</span>
                )}
              </div>
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              )}
            </div>
          </div>

          {/* Authority Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Authority Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="authorityName"
                  value={formData.authorityName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter authority name"
                />
              ) : (
                <p className="text-gray-800 py-2">{profileData.authorityName || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              ) : (
                <p className="text-gray-800 py-2">{profileData.email || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full address"
                />
              ) : (
                <p className="text-gray-800 py-2">{profileData.address || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              ) : (
                <p className="text-gray-800 py-2">{profileData.phoneNumber || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hotline
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="hotline"
                  value={formData.hotline}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter hotline number"
                />
              ) : (
                <p className="text-gray-800 py-2">{profileData.hotline || 'Not specified'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Administrator Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Administrator Information</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Administrator Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter administrator name"
                />
              ) : (
                <p className="text-gray-800 py-2">{profileData.adminName || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Administrator Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter administrator email"
                />
              ) : (
                <p className="text-gray-800 py-2">{profileData.adminEmail || 'Not specified'}</p>
              )}
              <button
                onClick={() => setIsChangepsw(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Change Password

              </button>
              {isChangepsw && (
                <div className="fixed inset-0 bg-black bg-opacity-20 overflow-y-auto h-full w-full z-50">
                  <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-4">

                        <h3 className="text-lg font-semibold text-gray-800">Add New Password</h3>
                        <button
                          onClick={() => {
                            setIsChangepsw(false);    
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="mt-4">
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            New Password
                          </label>
                          <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 px-4 py-2 border rounded-lg w-full"
                          />
                        </div>

                        <div className="mt-4">
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-2 px-4 py-2 border rounded-lg w-full"
                          />
                        </div>

                        <button
                          onClick={handlePasswordChange}
                          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-800 mb-4">Quick Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-500 rounded-lg p-4 text-white">
                <h5 className="text-sm font-medium opacity-90">Profile Status</h5>
                <p className="text-lg font-bold mt-1">Active</p>
              </div>
              <div className="bg-blue-600 rounded-lg p-4 text-white">
                <h5 className="text-sm font-medium opacity-90">Last Updated</h5>
                <p className="text-lg font-bold mt-1">Today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;