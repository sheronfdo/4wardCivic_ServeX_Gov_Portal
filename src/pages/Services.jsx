import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, X, ArrowLeft } from 'lucide-react';
import AddService from '../components/Services/AddServices';
import ManageForms from '../components/Form/ManageForm';


// Main Services Component
const Services = () => {
  const [services, setServices] = useState([
    {
      id: 1,
      serviceName: 'Birth Certificate',
      serviceType: 'Civil Registration',
      description: 'Issue birth certificates for citizens',
      status: 'Active',
      createdDate: '2024-01-15'
    },
    {
      id: 2,
      serviceName: 'Business License',
      serviceType: 'Business Registration',
      description: 'Register new businesses and issue licenses',
      status: 'Active',
      createdDate: '2024-01-20'
    },
    {
      id: 3,
      serviceName: 'Passport Application',
      serviceType: 'Immigration',
      description: 'Process passport applications for citizens',
      status: 'Inactive',
      createdDate: '2024-02-01'
    }
  ]);

  const [showAddService, setShowAddService] = useState(false);
  const [showViewService, setShowViewService] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('edit');
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    serviceName: '',
    serviceType: '',
    description: '',
    status: 'Active'
  });

  const serviceTypes = [
    'Civil Registration',
    'Business Registration',
    'Immigration',
    'Healthcare',
    'Education',
    'Transportation',
    'Tax Services',
    'Other'
  ];

  const handleAdd = () => {
    setShowAddService(true);
  };

  const handleBackToServices = () => {
    setShowAddService(false);
    setShowViewService(false);
  };

  const handleServiceCreated = (newService) => {
    setServices([...services, newService]);
  };

  const handleEdit = (service) => {
    setModalType('edit');
    setSelectedService(service);
    setFormData({
      serviceName: service.serviceName,
      serviceType: service.serviceType,
      description: service.description,
      status: service.status
    });
    setShowModal(true);
  };

  const handleView = (service) => {
    setShowViewService(true)
    //setModalType('view');
    //setSelectedService(service);
    //setShowModal(true);
  };

  const handleDelete = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(service => service.id !== serviceId));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalType === 'edit') {
      setServices(services.map(service => 
        service.id === selectedService.id 
          ? { ...service, ...formData }
          : service
      ));
    }
    
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Show AddService component
  if (showAddService) {
    return (
      <AddService 
        onBack={handleBackToServices}
        onServiceCreated={handleServiceCreated}
      />
    );
  }
  if (showViewService){
    return(
      <ManageForms
        onBack={handleBackToServices}
      />
    )
  }
  // Show Services List
  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Manage Services</h1>
          <p className="text-gray-600 mt-1">
            Enter the details for the new public service
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Services</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Service Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Service Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Created Date</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {service.serviceName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {service.serviceType}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      service.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {service.createdDate}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleView(service)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {services.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>No services found. Click "Add" to create your first service.</p>
          </div>
        )}
      </div>

      {/* Modal for Edit/View */}
      {/* {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {modalType === 'edit' && 'Edit Service'}
                {modalType === 'view' && 'Service Details'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalType === 'view' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                  <p className="text-gray-900">{selectedService?.serviceName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                  <p className="text-gray-900">{selectedService?.serviceType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-900">{selectedService?.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedService?.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedService?.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                  <p className="text-gray-900">{selectedService?.createdDate}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                  <input
                    type="text"
                    name="serviceName"
                    value={formData.serviceName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select service type</option>
                    {serviceTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Services;