import React, { useState, useEffect, useContext } from 'react';
import apiClient from '../utils/apiClient';
import { AuthContext } from '../context/AuthContext';
import ReactDOM from 'react-dom';

const ModalPortal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

const StaffManagement = () => {
  const { token } = useContext(AuthContext);
  const [staffList, setStaffList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRoll, setFilterRoll] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [rolls, setRolls] = useState([]); // Store full roll objects

  // Form state for adding/editing staff
  const [staffForm, setStaffForm] = useState({
    username: '',
    email: '',
    fullname: '',
    phone: '',
    roll: '', 
  });

  useEffect(() => {
    fetchRolls();
    fetchStaffData();
  }, []);

  const fetchRolls = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const response = await apiClient.get('/staff/rolls', token);
      const rollsData = response.rolls || [];
      // Store the complete roll objects instead of just the names
      setRolls(rollsData);
    } catch (error) {
      console.error('Error fetching rolls:', error);
      setErrorMessage('Failed to load rolls. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStaffData = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/staff/staff-list', token);
      setStaffList(response.staff_list || []); // Use staff_list
    } catch (error) {
      console.error('Error fetching staff data:', error);
      setErrorMessage('Failed to load staff data');
      setStaffList([]); // Fallback to empty array
    }
    setIsLoading(false);
  };

  // Helper function to get roll name by ID
  const getRollNameById = (rollId) => {
    const roll = rolls.find(r => r.id === rollId);
    return roll ? roll.staffroll : rollId; // Fallback to ID if not found
  };

  // Helper function to get roll ID by name (for backwards compatibility)
  const getRollIdByName = (rollName) => {
    const roll = rolls.find(r => r.staffroll === rollName);
    return roll ? roll.id : rollName; // Fallback to name if not found
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      // Submit with roll ID
      const response = await apiClient.post('/auth/staff-registration', staffForm, token);
      setStaffList([...staffList, { id: response.data.id, ...staffForm, createdAt: new Date().toISOString().split('T')[0], lastLogin: 'Never' }]);
      setShowAddModal(false);
      resetForm();
      setSuccessMessage('Staff member added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding staff:', error);
      setErrorMessage('Failed to add staff member');
    }
  };

  const handleEditStaff = async (e) => {
    e.preventDefault();
    try {
      // Submit with roll ID
      await apiClient.put(`/staff/${selectedStaff.id}`, staffForm, token);
      const updatedStaffList = staffList.map((staff) =>
        staff.id === selectedStaff.id ? { ...staff, ...staffForm } : staff
      );
      setStaffList(updatedStaffList);
      setShowEditModal(false);
      setSelectedStaff(null);
      resetForm();
      setSuccessMessage('Staff member updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating staff:', error);
      setErrorMessage('Failed to update staff member');
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await apiClient.delete(`/staff/${staffId}`, token);
        const updatedStaffList = staffList.filter((staff) => staff.id !== staffId);
        setStaffList(updatedStaffList);
        setSuccessMessage('Staff member deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting staff:', error);
        setErrorMessage('Failed to delete staff member');
      }
    }
  };

  const openEditModal = (staff) => {
    setSelectedStaff(staff);
    const currentRoll = staff.roll || staff.Roll;
    // Convert roll name to ID if needed (for backwards compatibility)
    const rollId = rolls.find(r => r.staffroll === currentRoll)?.id || currentRoll;
    
    setStaffForm({
      username: staff.username,
      email: staff.email,
      fullname: staff.fullname || `${staff.firstName} ${staff.lastName}`,
      phone: staff.phone,
      roll: rollId, // Store the ID
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setStaffForm({
      username: '',
      email: '',
      fullname: '',
      phone: '',
      roll: '',
    });
  };

  const toggleStaffStatus = async (staffId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await apiClient.put(`/staff/${staffId}/status`, { status: newStatus }, token);
      const updatedStaffList = staffList.map((staff) =>
        staff.id === staffId ? { ...staff, status: newStatus } : staff
      );
      setStaffList(updatedStaffList);
      setSuccessMessage(`Staff member ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating staff status:', error);
      setErrorMessage('Failed to update staff status');
    }
  };

  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch =
      (staff.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.fullname || '').toLowerCase().includes(searchTerm.toLowerCase());

    const staffRollId = staff.staff_role?.id || '';
    const staffRollName = getRollNameById(staffRollId);
    const matchesRoll = filterRoll === 'all' || staffRollName === filterRoll || staffRollId === filterRoll;

    return matchesSearch && matchesRoll;
  });

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getRoleColor = (role) => {
    return role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading staff data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage government authority staff members and their access permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
        >
          Add New Staff
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-500 rounded-lg p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Total Staff</h3>
          <p className="text-3xl font-bold mt-2">{staffList.length}</p>
          <p className="text-xs opacity-80 mt-1">All staff members</p>
        </div>
        <div className="bg-blue-600 rounded-lg p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Active Staff</h3>
          <p className="text-3xl font-bold mt-2">{staffList.filter((s) => s.status === 'active').length}</p>
          <p className="text-xs opacity-80 mt-1">Currently active</p>
        </div>
        <div className="bg-blue-700 rounded-lg p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Administrators</h3>
          <p className="text-3xl font-bold mt-2">{staffList.filter((s) => s.role === 'admin').length}</p>
          <p className="text-xs opacity-80 mt-1">Admin privileges</p>
        </div>
        <div className="bg-blue-800 rounded-lg p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Rolls</h3>
          <p className="text-3xl font-bold mt-2">{rolls.length}</p>
          <p className="text-xs opacity-80 mt-1">Total Rolls</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Staff</label>
            <input
              type="text"
              placeholder="Search by name, username, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full lg:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Roll</label>
            <select
              value={filterRoll}
              onChange={(e) => setFilterRoll(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Rolls</option>
              {rolls.map((roll) => (
                <option key={roll.id} value={roll.staffroll}>
                  {roll.staffroll}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Staff Members</h3>
          <p className="text-sm text-gray-600 mt-1">
            Showing {filteredStaff.length} of {staffList.length} staff members
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{staff.fullname || `${staff.firstName} ${staff.lastName}`}</div>
                      <div className="text-sm text-gray-500">@{staff.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{staff.email}</div>
                    <div className="text-sm text-gray-500">{staff.phone_number}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{getRollNameById(staff.staff_role?.id)}</div>
                  </td>
            
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(staff.status)}`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{staff.last_login || 'Never'}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(staff)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleStaffStatus(staff.id, staff.status)}
                        className={`text-sm font-medium ${
                          staff.status === 'ACTIVE' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {staff.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(staff.id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStaff.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-500">No staff members found matching your criteria.</div>
            </div>
          )}
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <ModalPortal>
          <div className="fixed inset-0 bg-black bg-opacity-20 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Add New Staff Member</h3>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddStaff} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={staffForm.fullname}
                      onChange={(e) => setStaffForm({ ...staffForm, fullname: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                      <input
                        type="text"
                        required
                        value={staffForm.username}
                        onChange={(e) => setStaffForm({ ...staffForm, username: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={staffForm.email}
                        onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={staffForm.phone}
                        onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Roll *</label>
                      <select
                        required
                        value={staffForm.roll}
                        onChange={(e) => setStaffForm({ ...staffForm, roll: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Roll</option>
                        {rolls.map((roll) => (
                          <option key={roll.id} value={roll.id}>
                            {roll.staffroll}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium"
                    >
                      Add Staff Member
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Edit Staff Modal */}
      {showEditModal && (
        <ModalPortal>
          <div className="fixed inset-0 bg-black bg-opacity-20 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Edit Staff Member</h3>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedStaff(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleEditStaff} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={staffForm.fullname}
                      onChange={(e) => setStaffForm({ ...staffForm, fullname: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                      <input
                        type="text"
                        required
                        value={staffForm.username}
                        onChange={(e) => setStaffForm({ ...staffForm, username: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={staffForm.email}
                        onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={staffForm.phone}
                        onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Roll *</label>
                      <select
                        required
                        value={staffForm.roll}
                        onChange={(e) => setStaffForm({ ...staffForm, roll: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Roll</option>
                        {rolls.map((roll) => (
                          <option key={roll.id} value={roll.id}>
                            {roll.staffroll}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                      <input
                        type="text"
                        value={staffForm.position}
                        onChange={(e) => setStaffForm({ ...staffForm, position: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                      <select
                        required
                        value={staffForm.role}
                        onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="staff">Staff</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedStaff(null);
                        resetForm();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium"
                    >
                      Update Staff Member
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
};

export default StaffManagement;