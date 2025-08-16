import React, { useState, useContext, useEffect } from 'react';
import { Search, Filter, ChevronDown, AlertTriangle, Eye } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../utils/apiClient';
import { ClockLoader } from 'react-spinners';
import FormViewerResponse from '../components/Form/viewfromwithrespose';

const Task = () => {
  const { token } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
  const [requestedData, setRequestedData] = useState([]);
  const [loadingForm, setLoadingForm] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedFormData, setSelectedFormData] = useState(null);
  const [selectedResponseData, setSelectedResponseData] = useState(null);

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
      case 'in_progress':
        return 'bg-orange-100 text-orange-800';
      case 'done':
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchDataRequestedService();
  }, []);

  const fetchDataRequestedService = async () => {
    try {
      const res = await apiClient.get('/servicerequested/requested', token);
      console.log('Full API Response:', res.data);

      const dataArray = res.data.data || (Array.isArray(res.data) ? res.data : null);

      if (dataArray && Array.isArray(dataArray)) {
        const mappedData = dataArray.map(item => {
          const service = item.service || {};
          const user = item.user || {};

          return {
            id: item.id || 'N/A',
            userName: user.name || user.email || 'Unknown User',
            userEmail: user.email || 'N/A',
            serviceName: service.service_name || 'Unknown Service',
            submittedDate: item.created_at
              ? new Date(item.created_at).toISOString().split('T')[0]
              : 'N/A',
            appointmentDate: item.appointment_date
              ? new Date(item.appointment_date).toISOString().split('T')[0]
              : 'N/A',
            slotTime: item.slot_start_time && item.slot_end_time
              ? `${new Date(item.slot_start_time).toLocaleTimeString()} - ${new Date(item.slot_end_time).toLocaleTimeString()}`
              : 'N/A',
            status: item.status || 'ACTIVE',
            statusColor: getStatusColor(item.status || 'ACTIVE'),
            formResponsesCount: item.form_responses_count || 0,
            formResponses: item.form_responses || []
          };
        });

        console.log('Mapped Data:', mappedData);
        setRequestedData(mappedData);
      } else {
        console.log('No data found or invalid response structure');
        setRequestedData([]);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setRequestedData([]);
    }
  };

  const fetchFormData = async (form_id, responseData) => {
    try {
      setLoadingForm(true);
      const formResponse = await apiClient.get(`/form/${form_id}`, token);
      const fetchedFormData = formResponse; // Make sure to get .data from response

      console.log('Form data fetched:', fetchedFormData);
      console.log('Response data:', responseData);

      setSelectedFormData(fetchedFormData);
      setSelectedResponseData(responseData);
      setIsPreviewOpen(true);

    } catch (error) {
      console.error('Error fetching form data:', error);
      alert('Failed to load form. Please try again.');
    } finally {
      setLoadingForm(false);
    }
  };

  const filteredRequests = requestedData.filter(request => {
    const matchesSearch =
      request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.includes(searchTerm) ||
      request.serviceName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || request.status === statusFilter;
    const matchesServiceType = !serviceTypeFilter || request.serviceName === serviceTypeFilter;

    return matchesSearch && matchesStatus && matchesServiceType;
  });

  const handleUpdateStatus = (id) => {
    setCurrentRequestId(id);
    setIsUpdateFormVisible(true);
  };

  const handleSubmit = () => {
    console.log('Updating status for request:', currentRequestId, 'New status:', newStatus);
    setIsUpdateFormVisible(false);
  };

  const handleClose = () => {
    setIsUpdateFormVisible(false);
  };

  const handleViewForm = (request) => {
    // Get the first form response (you might want to handle multiple form responses differently)
    const firstFormResponse = request.formResponses[0];
    if (firstFormResponse) {
      fetchFormData(firstFormResponse.form_id, firstFormResponse.responses);
    } else {
      alert('No form responses found for this request.');
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
          View User Submitted Service Requests
        </h1>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by name, ID, or service..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="relative min-w-[150px]">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Filter Status</option>
            <option value="Pending">Pending</option>
            <option value="In progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
        </div>

        {/* Service Type Filter */}
        <div className="relative min-w-[180px]">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            value={serviceTypeFilter}
            onChange={(e) => setServiceTypeFilter(e.target.value)}
          >
            <option value="">Filter Service Type</option>
            {[...new Set(requestedData.map(r => r.serviceName))].map((name, idx) => (
              <option key={idx} value={name}>{name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.userName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.serviceName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.submittedDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${request.statusColor}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleViewForm(request)}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                          title="View"
                          disabled={loadingForm}
                        >
                          {loadingForm ? (
                            <ClockLoader size={16} color="#3b82f6" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(request.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Update Status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredRequests.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Filter className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Footer */}
          {filteredRequests.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
              Showing {filteredRequests.length} of {requestedData.length} requests
            </div>
          )}
        </div>
      </div>

      {/* Form Preview Modal */}
      {isPreviewOpen && selectedFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto relative">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold z-10"
            >
              ✕
            </button>
            <FormViewerResponse
              formData={selectedFormData.form}
              responseData={selectedResponseData}
            />
          </div>
        </div>
      )}


      {/* Update Status Form */}
      {isUpdateFormVisible && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md mx-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Update Status</h3>
            <p className="text-sm mb-4 text-gray-600">
              Current Status:{' '}
              <span className="font-medium text-gray-800">
                {filteredRequests.find(req => req.id === currentRequestId)?.status}
              </span>
            </p>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            >
              <option value="">Select New Status</option>
              <option value="Pending">Pending</option>
              <option value="In progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={handleClose} className="text-gray-900">Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={!newStatus}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-medium transition-all duration-200"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;