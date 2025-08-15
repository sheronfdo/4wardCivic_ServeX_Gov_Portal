import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Upload } from 'lucide-react';
import apiClient from '../utils/apiClient';
import NotificationModal from '../components/NotificationModal';
import { AuthContext } from '../context/AuthContext';

const AuthorityRegistrationForm = () => {
  const navigate = useNavigate();
  const {token} = useContext(AuthContext);
  const [formData, setFormData] = useState({
    authorityName: '',
    email: '',
    address: '',
    phoneNumber: '',
    hotline: '',
    authorityIconId: null, // store uploaded image ID
  });

  const [uploading, setUploading] = useState(false); // for loading state
  const [selectedFileName, setSelectedFileName] = useState('');
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'loading',
    message: '',
  });

  // Handle text input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file selection & immediate upload
  const handleFileUpload = async (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    setSelectedFileName(file.name);
    setUploading(true);

    try {
      const mediaForm = new FormData();
      mediaForm.append('file', file);

      const mediaRes = await apiClient.post('/media/upload', mediaForm, {
        headers: { 'Content-Type': 'multipart/form-data' },
      },token);

      if (mediaRes.data && mediaRes.data && mediaRes.data.id) {
        setFormData((prev) => ({
          ...prev,
          authorityIconId: mediaRes.data.id, // save image ID
        }))
      } else {
        console.error('Upload response missing id:', mediaRes);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const authorityRes = await apiClient.post('/auth/authority/register', {
        authorityName: formData.authorityName,
        email: formData.email,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        hotline: formData.hotline,
        authorityIconId: formData.authorityIconId, // send uploaded image ID
      },token);

      if (authorityRes.authority_id) {
        console.log('Authority registered:', authorityRes);
        setModalState({
          isOpen: true,
          type: 'success',
          message: 'Authority registered successfully. Please check your email for verification.',
        });
        setFormData(({
          authorityName: '',
          email: '',
          address: '',
          phoneNumber: '',
          hotline: '',
          authorityIconId: null, // store uploaded image ID
        }))
        setTimeout(() => {
          navigate('/');
        }, 5000);
        // setSuccess('Authority registered successfully. Please check your email for verification.');
      }
    } catch (error) {
      console.error('Error registering authority:', error);
      setModalState({
        isOpen: true,
        type: 'error',
        message: error.message || 'Registration failed',
      });
    }
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <NotificationModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        message={modalState.message}
        onClose={closeModal}
      />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 rounded-lg mb-4">
            <Building2 className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Register Your Authority
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              Enter your credentials to access the Government Authority Portal
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="authorityName" className="block text-white text-sm font-medium mb-2">
                  Authority name
                </label>
                <input
                  type="text"
                  id="authorityName"
                  name="authorityName"
                  value={formData.authorityName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none"
                  placeholder="Enter authority name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none"
                  placeholder="Enter email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-white text-sm font-medium mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none"
                placeholder="Enter address"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phoneNumber" className="block text-white text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label htmlFor="hotline" className="block text-white text-sm font-medium mb-2">
                  Hotline
                </label>
                <input
                  type="tel"
                  id="hotline"
                  name="hotline"
                  value={formData.hotline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none"
                  placeholder="Enter hotline"
                />
              </div>
            </div>

            {/* Upload Field */}
            <div>
              <label htmlFor="authorityIcon" className="block text-white text-sm font-medium mb-2">
                Authority Icon
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="authorityIcon"
                  name="authorityIcon"
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <label
                  htmlFor="authorityIcon"
                  className="flex items-center justify-center w-full px-4 py-12 rounded-lg bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 text-white cursor-pointer hover:bg-white/20 transition-all group"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-white/70 group-hover:text-white transition-colors" />
                    <p className="text-sm text-white/70 group-hover:text-white transition-colors">
                      {uploading
                        ? 'Uploading...'
                        : selectedFileName || 'Drag & drop your icon here, or click to browse'}
                    </p>
                    <p className="text-xs text-white/50 mt-1">
                      PNG, JPG, SVG up to 10MB
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={uploading || !formData.authorityIconId}
                className="w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg disabled:bg-gray-300"
              >
                Register
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityRegistrationForm;
