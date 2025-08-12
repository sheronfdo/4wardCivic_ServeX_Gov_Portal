// Enhanced AddForm component for editing
const AddFormEnhanced = ({ onBack, onFormCreated, serviceName, initialData, isEditing }) => {
  const [formData, setFormData] = useState(
    initialData || {
      formTitle: '',
      description: '',
      fee: '',
      timeDuration: '',
      maxPeople: '',
      kyc: 'No'
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.formTitle.trim()) {
      alert('Please enter a form title');
      return;
    }
    
    if (isEditing) {
      onFormCreated(formData);
    } else {
      const newForm = {
        id: Date.now(),
        ...formData,
        createdDate: new Date().toISOString().split('T')[0]
      };
      onFormCreated(newForm);
    }
    
    onBack();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Back to {serviceName}
        </button>
      </div>

      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {isEditing ? 'Edit Form' : 'Add New Form'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Form Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="formTitle"
              value={formData.formTitle}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter form title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fee</label>
              <input
                type="text"
                name="fee"
                value={formData.fee}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., $50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Duration For Slot</label>
              <input
                type="text"
                name="timeDuration"
                value={formData.timeDuration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 30 mins"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max People Per Slot</label>
              <input
                type="number"
                name="maxPeople"
                value={formData.maxPeople}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">KYC Required</label>
              <select
                name="kyc"
                value={formData.kyc}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              onClick={onBack}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              {isEditing ? 'Update Form' : 'Create Form'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};