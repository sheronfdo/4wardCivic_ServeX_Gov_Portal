import React, { useState } from 'react';
import { Plus, Copy, Trash2, Image, Video, Palette, Eye, Send, MoreVertical, ArrowLeft } from 'lucide-react';
import RichTextEditor from '../../context/RitchTextEditorContext';
import apiClient from '../../utils/apiClient';
import FormViewer from './ViewForm';
import NotificationModal from '../NotificationModal';

const GoogleFormsClone = ({ serviceId, onBack }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [notificationType, setNotificationType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
 
  const closeModal = () => setIsModalOpen(false);


  const [form, setForm] = useState({
    title: 'Untitled form',
    description: 'Form description',
    serviceId: serviceId,
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'Untitled Question',
        options: ['Option 1'],
        required: false,
        hasOther: false,
        scaleMin: 1,
        scaleMax: 5,
        minLabel: '',
        maxLabel: '',
        media_id: null,
      }
    ]
  });

  const [activeQuestion, setActiveQuestion] = useState(1);

  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple choice' },
    { value: 'checkboxes', label: 'Checkboxes' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'short-answer', label: 'Short answer' },
    { value: 'paragraph', label: 'Paragraph' },
    { value: 'linear-scale', label: 'Linear scale' },
    { value: 'date', label: 'Date' },
    { value: 'time', label: 'Time' }
  ];

  // Function to export form data as JSON (ready for backend)
  const exportFormData = async () => {
    const formData = {
      title: form.title,
      description: form.description,
      serviceId: serviceId,
      questions: form.questions.map(q => ({
        id: q.id,
        type: q.type,
        question: q.question,
        options: q.options,
        required: q.required,
        hasOther: q.hasOther,
        scaleMin: q.scaleMin,
        scaleMax: q.scaleMax,
        minLabel: q.minLabel,
        maxLabel: q.maxLabel,
        mediaId: q.media_id || null,
      }))
    };

    try {
      const formRes = await apiClient.post('/form/create', formData);

      if (formRes.success) {
        setNotificationType('success');
        setMessage('Form created successfully!');
        setIsPreviewOpen(false);
        setTimeout(() => {
          onBack();
        }, 2000);

      } else {
        setNotificationType('error');
        setMessage('Error: ' + formRes.data.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error('Error creating form:', error);
      setNotificationType('error');
      setMessage('Error: ' + error.message || 'An unexpected error occurred');
    } finally {
      setIsModalOpen(true);
    }
    return formData;
  };

  // Handle file selection & immediate upload
  const handleFileSelect = async (event, questionId) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await apiClient.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (res.data && res.data.id) {
      const mediaId = res.data.id;
      const mediaUrl = res.data.file_path;
      // Update the selected question with media info
      setForm(prev => ({
        ...prev,
        questions: prev.questions.map(q =>
          q.id === questionId
            ? { ...q, media_id: mediaId, previewImage: mediaUrl }
            : q
        )
      }));
    }
  } catch (err) {
    console.error('Error uploading file:', err);
  }
};



  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      type: 'multiple-choice',
      question: 'Untitled Question',
      options: ['Option 1'],
      required: false,
      hasOther: false,
      scaleMin: 1,
      scaleMax: 5,
      minLabel: '',
      maxLabel: '',
      mediaId: null
    };
    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    setActiveQuestion(newQuestion.id);
  };

  const updateQuestion = (id, field, value) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === id ? { ...q, [field]: value } : q
      )
    }));
  };

  const handleQuestionTypeChange = (questionId, newType) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === questionId) {
          const updatedQuestion = { ...q, type: newType };

          // Ensure options exist for types that need them
          if (['multiple-choice', 'checkboxes', 'dropdown'].includes(newType) &&
            (!updatedQuestion.options || updatedQuestion.options.length === 0)) {
            updatedQuestion.options = ['Option 1'];
          }

          // Reset hasOther for types that don't support it
          if (['dropdown', 'linear-scale', 'date', 'time', 'short-answer', 'paragraph'].includes(newType)) {
            updatedQuestion.hasOther = false;
          }

          // Set default linear scale values
          if (newType === 'linear-scale') {
            updatedQuestion.scaleMin = updatedQuestion.scaleMin || 1;
            updatedQuestion.scaleMax = updatedQuestion.scaleMax || 5;
            updatedQuestion.minLabel = updatedQuestion.minLabel || '';
            updatedQuestion.maxLabel = updatedQuestion.maxLabel || '';
          }

          return updatedQuestion;
        }
        return q;
      })
    }));
  };

  const addOption = (questionId) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] }
          : q
      )
    }));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? {
            ...q,
            options: q.options.map((opt, idx) =>
              idx === optionIndex ? value : opt
            )
          }
          : q
      )
    }));
  };

  const deleteOption = (questionId, optionIndex) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? { ...q, options: q.options.filter((_, idx) => idx !== optionIndex) }
          : q
      )
    }));
  };

  const duplicateQuestion = (questionId) => {
    const questionToDuplicate = form.questions.find(q => q.id === questionId);
    const newQuestion = {
      ...questionToDuplicate,
      id: Date.now(),
      question: questionToDuplicate.question + ' (Copy)'
    };
    const questionIndex = form.questions.findIndex(q => q.id === questionId);
    setForm(prev => ({
      ...prev,
      questions: [
        ...prev.questions.slice(0, questionIndex + 1),
        newQuestion,
        ...prev.questions.slice(questionIndex + 1)
      ]
    }));
  };

  const deleteQuestion = (questionId) => {
    if (form.questions.length === 1) return;
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
    if (activeQuestion === questionId) {
      setActiveQuestion(form.questions[0].id);
    }
  };

  const toggleOther = (questionId) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, hasOther: !q.hasOther } : q
      )
    }));
  };

  const renderQuestion = (question) => {
    const isActive = activeQuestion === question.id;

    return (
      <div
        key={question.id}
        className={`bg-white rounded-lg border-l-4 mb-4 transition-all duration-200 ${isActive ? 'border-l-blue-500 shadow-md' : 'border-l-transparent shadow-sm hover:shadow-md'
          }`}
        onClick={() => setActiveQuestion(question.id)}
      >
        <div className="p-6">
          {/* Question Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-1">
              <RichTextEditor
                type="text"
                value={question.question}
                onChange={(e) => updateQuestion(question.id, 'question', e)}
                className="text-lg font-medium w-full border-none outline-none focus:border-b-2 focus:border-blue-500 bg-transparent pb-2"
                placeholder="Question"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="file"
                  id={`questionImage-${question.id}`}
                  name={`questionImage-${question.id}`}
                  onChange={(e) => handleFileSelect(e, question.id)}
                  accept="image/*"
                  className="hidden"
                />

                <label
                  htmlFor={`questionImage-${question.id}`}
                  className="flex items-center justify-center w-full px-2 py-2 rounded-lg bg-blue-50 backdrop-blur-sm border-2 border-dashed border-gray-300 text-gray-700 cursor-pointer hover:bg-blue-100 transition-all group"
                >
                  <div className="text-center">
                    <Image className="w-8 h-8 mx-auto mb-2 text-gray-600 group-hover:text-gray-800 transition-colors" />
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, SVG up to 10MB
                    </p>
                  </div>
                </label>
              </div>
              <select
                value={question.type}
                onChange={(e) => handleQuestionTypeChange(question.id, e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                {questionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Question Options */}
          {(question.type === 'multiple-choice' || question.type === 'checkboxes') && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="w-4 h-4 border-2 border-gray-400 rounded-full flex-shrink-0">
                    {question.type === 'checkboxes' && (
                      <div className="w-full h-full bg-gray-100 rounded-sm"></div>
                    )}
                  </div>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(question.id, index, e.target.value)}
                    className="flex-1 border-none outline-none focus:border-b focus:border-gray-400 bg-transparent py-1"
                    placeholder={`Option ${index + 1}`}
                  />
                  {question.options.length > 1 && (
                    <button
                      onClick={() => deleteOption(question.id, index)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}

              {question.hasOther && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-gray-400 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-600">Other...</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-sm">
                <div className="w-4 h-4 border-2 border-gray-400 rounded-full flex-shrink-0"></div>
                <button
                  onClick={() => addOption(question.id)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Add option
                </button>
                <span className="text-gray-400">or</span>
                <button
                  onClick={() => toggleOther(question.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  add "Other"
                </button>
              </div>
            </div>
          )}

          {question.type === 'dropdown' && (
            <div className="space-y-3">
              {/* Preview of dropdown */}
              <select className="border border-gray-300 rounded px-3 py-2 text-gray-500 w-48">
                <option>Choose</option>
                {question.options.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>

              {/* Options editing section */}
              <div className="mt-4 space-y-3">
                <div className="text-sm font-medium text-gray-700">Options:</div>
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="text-sm text-gray-500 w-6">{index + 1}.</div>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(question.id, index, e.target.value)}
                      className="flex-1 border-none outline-none focus:border-b focus:border-gray-400 bg-transparent py-1"
                      placeholder={`Option ${index + 1}`}
                    />
                    {question.options.length > 1 && (
                      <button
                        onClick={() => deleteOption(question.id, index)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

                <div className="flex items-center gap-3 text-sm">
                  <div className="text-sm text-gray-500 w-6">{question.options.length + 1}.</div>
                  <button
                    onClick={() => addOption(question.id)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Add option
                  </button>
                </div>
              </div>
            </div>
          )}

          {question.type === 'linear-scale' && (
            <div className="space-y-4">
              {/* Scale Configuration */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">Scale:</label>
                  <select
                    value={question.scaleMin}
                    onChange={(e) => updateQuestion(question.id, 'scaleMin', parseInt(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                  </select>
                  <span className="text-gray-500">to</span>
                  <select
                    value={question.scaleMax}
                    onChange={(e) => updateQuestion(question.id, 'scaleMax', parseInt(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                    <option value={9}>9</option>
                    <option value={10}>10</option>
                  </select>
                </div>
              </div>

              {/* Scale Preview */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Label (optional)"
                    value={question.minLabel}
                    onChange={(e) => updateQuestion(question.id, 'minLabel', e.target.value)}
                    className="w-24 text-xs border-none outline-none focus:border-b focus:border-gray-400 bg-transparent text-center"
                  />
                </div>
                <div className="flex items-center gap-2 mx-4">
                  {Array.from({ length: question.scaleMax - question.scaleMin + 1 }, (_, i) => {
                    const value = question.scaleMin + i;
                    return (
                      <div key={value} className="flex flex-col items-center gap-1">
                        <input
                          type="radio"
                          name={`scale-${question.id}`}
                          value={value}
                          className="w-4 h-4"
                          disabled
                        />
                        <span className="text-xs text-gray-600">{value}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Label (optional)"
                    value={question.maxLabel}
                    onChange={(e) => updateQuestion(question.id, 'maxLabel', e.target.value)}
                    className="w-24 text-xs border-none outline-none focus:border-b focus:border-gray-400 bg-transparent text-center"
                  />
                </div>
              </div>
            </div>
          )}

          {question.type === 'date' && (
            <div className="flex items-center gap-4">
              <input
                type="date"
                className="border border-gray-300 rounded px-3 py-2 text-gray-500"
                disabled
              />
              <span className="text-sm text-gray-500">Date picker will appear here</span>
            </div>
          )}

          {question.type === 'time' && (
            <div className="flex items-center gap-4">
              <input
                type="time"
                className="border border-gray-300 rounded px-3 py-2 text-gray-500"
                disabled
              />
              <span className="text-sm text-gray-500">Time picker will appear here</span>
            </div>
          )}

          {question.type === 'short-answer' && (
            <div className="border-b border-gray-300 pb-2 text-gray-500">
              Short answer text
            </div>
          )}

          {question.type === 'paragraph' && (
            <div className="border border-gray-300 rounded p-3 text-gray-500">
              Long answer text
            </div>
          )}
        </div>

        {/* Question Footer */}
        {isActive && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <button
                onClick={() => duplicateQuestion(question.id)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                title="Duplicate"
              >
                <Copy className="w-5 h-5" />
              </button>
              <button
                onClick={() => deleteQuestion(question.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-gray-300"></div>
              <label className="flex items-center gap-2 text-sm">
                <span>Required</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={question.required}
                    onChange={(e) => updateQuestion(question.id, 'required', e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-6 rounded-full transition-colors duration-200 ${question.required ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 transform ${question.required ? 'translate-x-5' : 'translate-x-1'
                        } mt-1`}
                    ></div>
                  </div>
                </div>
              </label>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <input
                type="text"
                value={form.title.replace(/<[^>]*>/g, '')} // remove HTML tags
                onChange={(e) => setForm(prev => ({
                  ...prev,
                  title: e.target.value.replace(/<[^>]*>/g, '')
                }))}
                className="text-lg font-medium border-none outline-none focus:border-b-2 focus:border-blue-500 bg-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                <Palette className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                <Eye className="w-5 h-5" />
              </button>
              {isPreviewOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl h-[90vh] flex flex-col relative">
                    {/* Modal Header - Fixed */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-lg">
                      <h2 className="text-lg font-semibold text-gray-800">Form Preview</h2>
                      <button
                        onClick={() => setIsPreviewOpen(false)}
                        className="text-gray-500 hover:text-gray-700 text-2xl leading-none p-1"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Modal Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-0">
                      <FormViewer formData={form} />
                    </div>

                    {/* Modal Footer - Fixed (Optional) */}
                    <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setIsPreviewOpen(false)}
                          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          Close Preview
                        </button>
                        <button
                          onClick={exportFormData}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Publish Form
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={exportFormData}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send
              </button>
              <NotificationModal
                type={notificationType}
                message={message}
                isOpen={isModalOpen}
                onClose={closeModal}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Form Header */}
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-l-blue-500 mb-6">
          <div className="p-6">
            <RichTextEditor
              type="text"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e }))}
              placeholder="Form title"
              className="text-3xl font-normal w-full border-none outline-none focus:border-b-2 focus:border-purple-500 bg-transparent mb-4"
            />
            <RichTextEditor
              type="text"
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e }))}
              placeholder="Form description"
              className="text-base w-full border-none outline-none focus:border-b focus:border-gray-400 bg-transparent text-gray-600"
            />
          </div>
        </div>

        {/* Questions */}
        {form.questions.map(renderQuestion)}

        {/* Add Question Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={addQuestion}
            className="flex items-center gap-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200 px-6 py-3 text-gray-600 hover:text-gray-800"
          >
            <Plus className="w-5 h-5" />
            Add Question
          </button>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed right-6 bottom-6 flex flex-col gap-3">
        <button
          onClick={addQuestion}
          className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-200 flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </button>
        {/* <button className="w-12 h-12 bg-white text-gray-600 rounded-full shadow-lg hover:shadow-xl hover:text-gray-800 transition-all duration-200 flex items-center justify-center">
          <Video className="w-6 h-6" />
        </button>
        <button className="w-12 h-12 bg-white text-gray-600 rounded-full shadow-lg hover:shadow-xl hover:text-gray-800 transition-all duration-200 flex items-center justify-center">
          <Image className="w-6 h-6" />
        </button> */}
      </div>
    </div>
  );
};

export default GoogleFormsClone;