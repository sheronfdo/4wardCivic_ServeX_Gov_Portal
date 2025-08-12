import { useState } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import ManageForms from '../Form/ManageForm';

const AddService = ({ onBack, onServiceCreated }) => {
  const [formData, setFormData] = useState({
    serviceName: '',
    serviceType: '',
    serviceFeeLRK: '',
    description: '',
    status: 'Active'
  });


  const handleSubmit = (e) => {
    e.preventDefault();

    const newService = {
      id: Date.now(),
      ...formData,
      createdDate: new Date().toISOString().split('T')[0]
    };

    onServiceCreated(newService);

    setFormData({
      serviceName: '',
      serviceType: '',
      serviceTypeLRK: '',
      description: '',
      status: 'Active'
    });

    alert('Service created successfully!');
    onBack();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    setFormData({
      serviceName: '',
      serviceType: '',
      serviceTypeLRK: '',
      description: '',
      serviceIcon: null,
      status: 'Active'
    });
    onBack();
  };


  const handleFileUpload = () => {

  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Manage services</h1>
            </div>
          </div>
          <h2 className="text-lg lg:text-xl font-semibold text-blue-600 mb-1">Create New Service</h2>
          <p className="text-gray-600 text-sm lg:text-base">
            Enter the service information and requirements for a new service offering.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
              <input
                type="text"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-blue-50"
                placeholder="Enter service name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
              <div className="bg-blue-50 rounded-lg border border-gray-300 p-4 min-h-[120px]">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-transparent resize-none outline-none placeholder-gray-500"
                  placeholder="Enter a brief description about the service..."
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Fee in LRK</label>
              <input
                type="text"
                name="serviceFeeLRK"
                value={formData.serviceTypeLRK}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-blue-50"
                placeholder="Enter service Fee"
              />
            </div>

            <div>
              <label htmlFor="serviceIcon" className="text-sm font-medium text-gray-700 mb-2">
                Service Icon
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="serviceIcon"
                  name="serviceIcon"
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <label
                  htmlFor="serviceIcon"
                  className="flex items-center justify-center w-full px-4 py-12 rounded-lg bg-blue-50 backdrop-blur-sm border-2 border-dashed border-gray-300 text-gray-700 cursor-pointer hover:bg-blue-100 transition-all group"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-600 group-hover:text-gray-800 transition-colors" />
                    <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                      {formData.serviceIcon
                        ? formData.serviceIcon.name
                        : 'Drag & drop your icon here, or click to browse'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, SVG up to 10MB
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot Duration (in minutes)</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-blue-50"
                  placeholder="Enter time duration in minutes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max People Per Slot</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-blue-50"
                  placeholder="Enter max people per slot"
                />
              </div>
            </div>

            <div className="flex items-center mt-4">
              <input type="checkbox" id="kycMandatory" className="mr-2 " />
              <label htmlFor="kycMandatory" className="text-m text-gray-700">KYC Mandatory</label>
            </div>


            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
              >
                Create Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddService;
