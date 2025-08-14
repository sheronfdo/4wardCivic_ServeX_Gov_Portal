import React, { useState, useEffect } from 'react';
import { Plus, User, ArrowLeft, Eye, Edit, Trash2 } from 'lucide-react';
import GoogleFormsClone from './AddForm';
import apiClient from '../../utils/apiClient';
import FormViewer from './ViewForm';
import {ClockLoader} from 'react-spinners';
// Update the main component to use the enhanced version
const ManageForms = ({ onBack, serviceId }) => {
  const [serviceDetails, setServiceDetails] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [forms, setForms] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  // useEffect(() => {
  //   if (!serviceId) return;
  //   apiClient.get(`/service/services/${serviceId}`)
  //     .then(res => setServiceDetails(res))
  //     .catch(err => console.error('Error fetching service details:', err));
  // }, [serviceId]);
  // useEffect(() => {
  //   if (!serviceId) return;
  //   apiClient.get(`/form/forms/${serviceId}`)
  //     .then(formres => setForms(formres.forms))
  //     .catch(err => console.error('Error fetching service details:', err));
  // }, [serviceId]);

  const fetchServiceandForm = async () => {
  try {
    if (!serviceId) return;

    const [res, formRes] = await Promise.all([
      apiClient.get(`/service/services/${serviceId}`),
      apiClient.get(`/form/forms/${serviceId}`)
    ]);

    setServiceDetails(res);
    setForms(formRes.forms);
  } catch (err) {
    console.error('Error fetching service or forms:', err);
  }
};

useEffect(() => {
  fetchServiceandForm();
}, [serviceId]);

  if (!serviceId) {
    return <div>No service selected.</div>;
  }

  if (!serviceDetails) {
    return <ClockLoader
        className="mx-auto my-40"
        color="#3b82f6"
        loading={true}
        size={122}
        aria-label="Loading Spinner"
        data-testid="loader"
      />;
  }




  //const serviceForms = forms.filter(form => form.serviceId === serviceDetails.id);
  const serviceForms = forms.filter(form => form.is_active);
  const handleAddForm = () => {
    setEditingForm(null);
    setShowAddForm(true);
  };

  const handleBackToForms = () => {
    setShowAddForm(false);
    setEditingForm(null);
    fetchServiceandForm();

  };

  const handleFormCreated = (newForm) => {
    if (editingForm) {
      // Update existing form
      setForms(forms.map(form =>
        form.id === editingForm.id
          ? { ...form, ...newForm }
          : form
      ));
    } else {
      // Add new form
      const formWithServiceId = {
        ...newForm,
        serviceId: serviceDetails.id,
      };
      setForms([...forms, formWithServiceId]);
    }
  };

  const handleViewForm = (form) => {
    setIsPreviewOpen(true);
  };

  const handleEditForm = (form) => {
    setEditingForm(form);
    setShowAddForm(true);
  };

  const handleDeleteForm = async (formId) => {
    if (!window.confirm('Are you sure you want to delete this form?')) return;

    try {
      // Call DELETE API
      await apiClient.delete(`/form/${formId}`);

      // Remove the form from state after successful deletion
      setForms(forms.filter(form => form.id !== formId));

      // Optional: show a success message
      console.log('Form deleted successfully');
    } catch (error) {
      console.error('Failed to delete form:', error);
      alert('Failed to delete form. Please try again.');
    }
  };


  if (showAddForm) {
    return (
      <GoogleFormsClone
        onBack={handleBackToForms}
        serviceId={serviceDetails.id}
        onFormCreated={handleFormCreated}
      //initialData={editingForm}
      //isEditing={!!editingForm}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
      {/* Service Header */}
      <div className="flex items-start space-x-4 mb-8">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-600">
              {serviceDetails.service_name}
            </h1>
            <p className="text-gray-500 mt-1">{serviceDetails.note}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-gray-400 text-xs uppercase">Fee</p>
            <p className="mt-1 font-semibold text-gray-800">{serviceDetails.service_fee_lrk} LKR</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-gray-400 text-xs uppercase">Time Duration</p>
            <p className="mt-1 font-semibold text-gray-800">
              {serviceDetails.start_time} - {serviceDetails.end_time}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-gray-400 text-xs uppercase">Max People/Slot</p>
            <p className="mt-1 font-semibold text-gray-800">{serviceDetails.max_people_per_slot}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-gray-400 text-xs uppercase">KYC Required</p>
            <p className="mt-1 font-semibold text-gray-800">{serviceDetails.kyc ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>


      {/* Manage Form Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-blue-600">Manage Form</h2>
          <button
            onClick={handleAddForm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        {/* Forms List */}
        <div className="space-y-3">
          {serviceForms.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-500">No forms found for this service.</p>
              <p className="text-gray-400 text-sm mt-1">Click "Add" to create your first form.</p>
            </div>
          ) : (
            serviceForms.map((form) => (
              <div key={form.id} className="bg-blue-100 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">Form Title</p>
                    <div className="grid grid-cols-5 gap-8 items-start">
                      <div>
                        <p className="font-medium text-gray-800 mb-1">
                          {form.title.replace(/<[^>]*>?/gm, '')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {form.description.replace(/<[^>]*>?/gm, '')}
                        </p>

                      </div>
                      <div>
                        <p className="text-gray-800">{form.is_active ? 'Active' : 'Inactive'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleViewForm(form)}
                      className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {isPreviewOpen && (
                      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
                          <button
                            onClick={() => setIsPreviewOpen(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                          >
                            ✕
                          </button>
                          <FormViewer formData={form} />
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleEditForm(form)}
                      title="Edit"
                      className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteForm(form.id)}
                      title="Delete"
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Service Selection */}
      {/* <div className="bg-white rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Select Service:</h3>
        <div className="flex flex-wrap gap-2">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service)}
              className={`px-3 py-2 rounded-md text-sm transition-colors ${
                selectedService.id === service.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {service.serviceName}
            </button>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default ManageForms;