import React, { useState ,useEffect, useContext} from 'react';
import { Plus, Edit, Trash2, Eye, X, ArrowLeft } from 'lucide-react';
import AddService from '../components/Services/AddServices';
import ManageForms from '../components/Form/ManageForm';
import apiClient from '../utils/apiClient';
import { AuthContext } from '../context/AuthContext';

// Main Services Component
const Services = () => {
  const {token} = useContext(AuthContext);
  const [services, setServices] = useState([]);
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


  useEffect(() => {
    fetchServices();
  }, []);

 const fetchServices = async () => {
  try {
    const res = await apiClient.get('/service/Authority/services', token);
    if (Array.isArray(res)) {
      setServices(res);
    } else {
      console.error('Unexpected response format:', res);
      setServices([]);
    }
  } catch (error) {
    console.error('Error fetching services:', error);
    setServices([]);
  }
};


  const handleAdd = () => {
    setShowAddService(true);
  };

  const handleBackToServices = () => {
    setShowAddService(false);
    setShowViewService(false);
    fetchServices();
  };

  const handleServiceCreated = (newService) => {
    setServices([...services, newService]);
    fetchServices();
  };

  const handleEdit = (service) => {
    setModalType('edit');
    setSelectedService(service);
    setFormData({
      serviceName: service.service_name,
      serviceType: service.service_type || 'N/A', // fallback if service_type doesn't exist
      description: service.note,
      status: service.status
    });
    setShowModal(true);
  };

  const handleView = (service) => {
    setSelectedService(service);
    setShowViewService(true)
  };

  const handleDelete = async (serviceId) => {
  try {
    const confirmDelete = window.confirm('Are you sure you want to delete this service?');
    
    if (confirmDelete) { 
      const response = await apiClient.delete(`/service/services/${serviceId}`,token );

      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
        setServices(services.filter(service => service.id !== serviceId));
      } else {
        // Handle error
        console.error(data.error);
      }
    }
  } catch (error) {
    console.error('Error deleting service:', error);
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format date helper function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
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
        serviceId={selectedService?.id}
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
                    {service.service_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {service.service_type || 'General Service'}
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
                    {formatDate(service.created_at)}
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
    </div>
  );
};

export default Services;