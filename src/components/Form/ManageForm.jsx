import React, { useState } from 'react';
import { Plus, User ,ArrowLeft} from 'lucide-react';
import GoogleFormsClone from './AddForm';


// // Main Forms Management Component
// const FormsManagement = () => {
//   // Mock services data
//   const [services] = useState([
//     {
//       id: 1,
//       serviceName: 'Birth Certificate',
//       serviceType: 'Civil Registration',
//       description: 'Issue birth certificates for citizens',
//       status: 'Active'
//     },
//     {
//       id: 2,
//       serviceName: 'Business License',
//       serviceType: 'Business Registration', 
//       description: 'Register new businesses and issue licenses',
//       status: 'Active'
//     },
//     {
//       id: 3,
//       serviceName: 'Passport Application',
//       serviceType: 'Immigration',
//       description: 'Process passport applications for citizens',
//       status: 'Active'
//     }
//   ]);

//   const [selectedService, setSelectedService] = useState(services[0]); // Default to first service
//   const [forms, setForms] = useState([
//     {
//       id: 1,
//       formTitle: 'Birth Certificate Application',
//       description: 'Standard birth certificate request form',
//       fee: '$25',
//       timeDuration: '15 mins',
//       maxPeople: '1',
//       kyc: 'Yes',
//       serviceId: 1
//     },
//     {
//       id: 2,
//       formTitle: 'Birth Certificate Correction',
//       description: 'Form to correct errors in birth certificate',
//       fee: '$35',
//       timeDuration: '20 mins', 
//       maxPeople: '1',
//       kyc: 'Yes',
//       serviceId: 1
//     },
//     {
//       id: 3,
//       formTitle: 'Certified Copy Request',
//       description: 'Request certified copies of birth certificate',
//       fee: '$15',
//       timeDuration: '10 mins',
//       maxPeople: '1', 
//       kyc: 'No',
//       serviceId: 1
//     }
//   ]);

//   const [showAddForm, setShowAddForm] = useState(false);
//   const [editingForm, setEditingForm] = useState(null);

//   // Filter forms for selected service
//   const serviceForms = forms.filter(form => form.serviceId === selectedService.id);

//   const handleAddForm = () => {
//     setShowAddForm(true);
//   };

//   const handleBackToForms = () => {
//     setShowAddForm(false);
//     setEditingForm(null);
//   };

//   const handleFormCreated = (newForm) => {
//     const formWithServiceId = {
//       ...newForm,
//       serviceId: selectedService.id
//     };
//     setForms([...forms, formWithServiceId]);
//   };

//   const handleEditForm = (form) => {
//     setEditingForm(form);
//     setShowAddForm(true);
//   };

//   const handleDeleteForm = (formId) => {
//     if (window.confirm('Are you sure you want to delete this form?')) {
//       setForms(forms.filter(form => form.id !== formId));
//     }
//   };

//   const handleFormUpdate = (updatedForm) => {
//     setForms(forms.map(form => 
//       form.id === editingForm.id 
//         ? { ...form, ...updatedForm }
//         : form
//     ));
//   };

//   // Show Add/Edit Form
//   if (showAddForm) {
//     return (
//       <AddForm 
//         onBack={handleBackToForms}
//         onFormCreated={editingForm ? handleFormUpdate : handleFormCreated}
//         serviceName={selectedService.serviceName}
//         initialData={editingForm}
//         isEditing={!!editingForm}
//       />
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Service Header */}

//       <div className="flex items-start space-x-4 mb-8">
//         <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
//           <User className="w-10 h-10 text-blue-600" />
//         </div>
//         <div className="flex-1">
//           <h1 className="text-2xl font-bold text-blue-600 mb-2">
//             {selectedService.serviceName}
//           </h1>
//           <div className="grid grid-cols-5 gap-8 text-sm">
//             <div>
//               <span className="text-gray-500">Description</span>
//             </div>
//             <div>
//               <span className="text-gray-500">Fee</span>
//             </div>
//             <div>
//               <span className="text-gray-500">Time Duration For Slot</span>
//             </div>
//             <div>
//               <span className="text-gray-500">Max People Per Slot</span>
//             </div>
//             <div>
//               <span className="text-gray-500">KYC</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Manage Form Section */}
//       <div className="mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-semibold text-blue-600">Manage Form</h2>
//           <button
//             onClick={handleAddForm}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors text-sm"
//           >
//             <Plus className="w-4 h-4" />
//             <span>Add</span>
//           </button>
//         </div>

//         {/* Forms List */}
//         <div className="space-y-3">
//           {serviceForms.length === 0 ? (
//             <div className="bg-white rounded-lg p-8 text-center">
//               <p className="text-gray-500">No forms found for this service.</p>
//               <p className="text-gray-400 text-sm mt-1">Click "Add" to create your first form.</p>
//             </div>
//           ) : (
//             serviceForms.map((form) => (
//               <div key={form.id} className="bg-blue-100 rounded-lg p-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex-1">
//                     <div className="grid grid-cols-5 gap-8 items-center">
//                       <div>
//                         <p className="font-medium text-gray-800 mb-1">{form.formTitle}</p>
//                         <p className="text-sm text-gray-600">{form.description}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-800">{form.fee || '-'}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-800">{form.timeDuration || '-'}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-800">{form.maxPeople || '-'}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-800">{form.kyc}</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex space-x-2 ml-4">
//                     <button
//                       onClick={() => handleEditForm(form)}
//                       className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteForm(form.id)}
//                       className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Service Selection (for demo purposes) */}
//       <div className="mt-8 bg-white rounded-lg p-4">
//         <h3 className="text-lg font-medium text-gray-700 mb-3">Select Service:</h3>
//         <div className="flex flex-wrap gap-2">
//           {services.map((service) => (
//             <button
//               key={service.id}
//               onClick={() => setSelectedService(service)}
//               className={`px-3 py-2 rounded-md text-sm transition-colors ${
//                 selectedService.id === service.id
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//             >
//               {service.serviceName}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };



// Update the main component to use the enhanced version
const ManageForms = ({onBack}) => {
  // Mock services data
  const [services] = useState([
    {
      id: 1,
      serviceName: 'Birth Certificate',
      serviceType: 'Civil Registration',
      description: 'Issue birth certificates for citizens',
      status: 'Active'
    },
    {
      id: 2,
      serviceName: 'Business License', 
      serviceType: 'Business Registration',
      description: 'Register new businesses and issue licenses',
      status: 'Active'
    },
    {
      id: 3,
      serviceName: 'Passport Application',
      serviceType: 'Immigration',
      description: 'Process passport applications for citizens',
      status: 'Active'
    }
  ]);

  const [selectedService, setSelectedService] = useState(services[0]);
  const [forms, setForms] = useState([
    {
      id: 1,
      formTitle: 'Birth Certificate Application',
      description: 'Standard birth certificate request form',
      fee: '$25',
      timeDuration: '15 mins',
      maxPeople: '1',
      kyc: 'Yes',
      serviceId: 1
    },
    {
      id: 2,
      formTitle: 'Birth Certificate Correction',
      description: 'Form to correct errors in birth certificate', 
      fee: '$35',
      timeDuration: '20 mins',
      maxPeople: '1',
      kyc: 'Yes',
      serviceId: 1
    },
    {
      id: 3,
      formTitle: 'Certified Copy Request',
      description: 'Request certified copies of birth certificate',
      fee: '$15',
      timeDuration: '10 mins',
      maxPeople: '1',
      kyc: 'No',
      serviceId: 1
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingForm, setEditingForm] = useState(null);

  const serviceForms = forms.filter(form => form.serviceId === selectedService.id);

  const handleAddForm = () => {
    setEditingForm(null);
    setShowAddForm(true);
  };

  const handleBackToForms = () => {
    setShowAddForm(false);
    setEditingForm(null);
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
        serviceId: selectedService.id
      };
      setForms([...forms, formWithServiceId]);
    }
  };

  const handleEditForm = (form) => {
    setEditingForm(form);
    setShowAddForm(true);
  };

  const handleDeleteForm = (formId) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      setForms(forms.filter(form => form.id !== formId));
    }
  };

  if (showAddForm) {
    return (
      <GoogleFormsClone
        onBack={handleBackToForms}
        onFormCreated={handleFormCreated}
        serviceName={selectedService.serviceName}
        initialData={editingForm}
        isEditing={!!editingForm}
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
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-10 h-10 text-blue-600" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-blue-600 mb-2">
            {selectedService.serviceName}
          </h1>
          <div className="grid grid-cols-5 gap-8 text-sm text-gray-500">
            <div>Description</div>
            <div>Fee</div>
            <div>Time Duration For Slot</div>
            <div>Max People Per Slot</div>
            <div>KYC</div>
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
                        <p className="font-medium text-gray-800 mb-1">{form.formTitle}</p>
                        <p className="text-sm text-gray-600">{form.description}</p>
                      </div>
                      <div>
                        <p className="text-gray-800">{form.fee || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-800">{form.timeDuration || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-800">{form.maxPeople || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-800">{form.kyc}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEditForm(form)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteForm(form.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Delete
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