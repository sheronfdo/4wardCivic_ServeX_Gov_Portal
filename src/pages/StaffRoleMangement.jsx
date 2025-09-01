import React, { useState, useEffect, useContext } from 'react';
import apiClient from '../utils/apiClient';
import { AuthContext } from '../context/AuthContext';
const DepartmentManagement = () => {
  const [rolls, setRolls] = useState([]);
  const { token } = useContext(AuthContext);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRollName, setNewRollName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);


  // Fetch existing rolls on component mount
  useEffect(() => {
    fetchRolls();
  }, []);

  const fetchRolls = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const response = await apiClient.get('/staff/rolls', token);

      // Assuming the API returns an array of rolls or an object with rolls data
      const rollsData = response.rolls|| [];
      console.log(rollsData)
      setRolls(rollsData);
    } catch (error) {
      console.error('Error fetching rolls:', error);
      setErrorMessage('Failed to load rolls. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoll = async (e) => {
    e.preventDefault();

    if (newRollName.trim() === '') {
      setErrorMessage('Roll name cannot be empty');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');

      const rollData = {
        staffroll: newRollName.trim()
      };

      const response = await apiClient.post('/staff/roll/create', rollData, token);

      // Add the new roll to the existing rolls
      // Assuming the API returns the created roll data
      const newRoll = response.data?.roll || response.data || { name: newRollName.trim() };
      setRolls([...rolls, newRoll]);

      setSuccessMessage('Roll added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setNewRollName('');
      setShowAddModal(false);

    } catch (error) {
      console.error('Error creating roll:', error);
      const errorMsg = error.response?.data?.message || 'Failed to create roll. Please try again.';
      setErrorMessage(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRoll = async (rollToDelete) => {
    const rollName = typeof rollToDelete === 'object' ? rollToDelete.name : rollToDelete;

    if (window.confirm(`Are you sure you want to delete the "${rollName}" roll?`)) {
      try {
        // If you have a delete API endpoint, uncomment and modify this section:
        // const token = getToken();
        // await apiClient.delete(`/staff/roll/${rollToDelete.id}`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`
        //   }
        // });

        // For now, just remove from local state
        setRolls(rolls.filter(roll => {
          const currentRollName = typeof roll === 'object' ? roll.name : roll;
          return currentRollName !== rollName;
        }));

        setSuccessMessage('Roll deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting roll:', error);
        setErrorMessage('Failed to delete roll. Please try again.');
      }
    }
  };

  const clearMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Staff Roll Management</h1>
          <p className="text-gray-600 mt-1">Manage and organize rolls in the system</p>
        </div>
        <button
          onClick={() => {
            setShowAddModal(true);
            clearMessages();
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
          disabled={loading}
        >
          Add New Roll
        </button>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      {/* Roll List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Staff Rolls</h3>
              <p className="text-sm text-gray-600 mt-1">Manage the rolls for staff members</p>
            </div>
            <button
              onClick={fetchRolls}
              disabled={loading}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="2" className="px-6 py-8 text-center">
                    <div className="text-gray-500">Loading rolls...</div>
                  </td>
                </tr>
              ) : rolls.length > 0 ? (
                rolls.map((roll, index) => {
                  const rollName = typeof roll === 'object' ? roll.
                    staffroll : roll;
                  return (
                    <tr key={roll.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{rollName}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDeleteRoll(roll)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="2" className="px-6 py-8 text-center">
                    <div className="text-gray-500">No rolls available.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Roll Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Add New Roll</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewRollName('');
                    clearMessages();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddRoll} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Roll Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRollName}
                    onChange={(e) => setNewRollName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter roll name"
                    disabled={submitting}
                  />
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setNewRollName('');
                      clearMessages();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium disabled:opacity-50"
                    disabled={submitting}
                  >
                    {submitting ? 'Adding...' : 'Add Roll'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;