import React, { useState } from 'react';
import { Plus, Copy, Trash2, Image, Video, Palette, Eye, Send, MoreVertical } from 'lucide-react';
import RichTextEditor from '../../context/RitchTextEditorContext';


const GoogleFormsClone = () => {
  const [form, setForm] = useState({
    title: 'Untitled form',
    description: 'Form description',
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'Untitled Question',
        options: ['Option 1'],
        required: false,
        hasOther: false
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

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      type: 'multiple-choice',
      question: 'Untitled Question',
      options: ['Option 1'],
      required: false,
      hasOther: false
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
              {/* <input
                type="text"
                value={question.question}
                onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                className="text-lg font-medium w-full border-none outline-none focus:border-b-2 focus:border-blue-500 bg-transparent pb-2"
                placeholder="Question"
              /> */}
              <RichTextEditor
                type="text"
                value={question.question}
                onChange={(e) => updateQuestion(question.id, 'question', e)}
                className="text-lg font-medium w-full border-none outline-none focus:border-b-2 focus:border-blue-500 bg-transparent pb-2"
                placeholder="Question"
              />
            </div>
            <div className="flex items-center gap-2">
              <Image className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
              <select
                value={question.type}
                onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
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

          {question.type === 'dropdown' && (
            <select className="border border-gray-300 rounded px-3 py-2 text-gray-500 w-48">
              <option>Choose</option>
              {question.options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
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
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="text-lg font-medium border-none outline-none focus:border-b-2 focus:border-blue-500 bg-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                <Palette className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                <Eye className="w-5 h-5" />
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Form Header */}
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-l-blue-500 mb-6">
          <div className="p-6">
            {/* <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="text-3xl font-normal w-full border-none outline-none focus:border-b-2 focus:border-purple-500 bg-transparent mb-4"
              placeholder="Form title"
            /> */}
            <RichTextEditor
              type="text"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e }))}
              placeholder="Form title"
              className="text-3xl font-normal w-full border-none outline-none focus:border-b-2 focus:border-purple-500 bg-transparent mb-4"

            />
            {/* <input
              type="text"
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              className="text-base w-full border-none outline-none focus:border-b focus:border-gray-400 bg-transparent text-gray-600"
              placeholder="Form description"
            /> */}
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
        <button className="w-12 h-12 bg-white text-gray-600 rounded-full shadow-lg hover:shadow-xl hover:text-gray-800 transition-all duration-200 flex items-center justify-center">
          <Video className="w-6 h-6" />
        </button>
        <button className="w-12 h-12 bg-white text-gray-600 rounded-full shadow-lg hover:shadow-xl hover:text-gray-800 transition-all duration-200 flex items-center justify-center">
          <Image className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default GoogleFormsClone;