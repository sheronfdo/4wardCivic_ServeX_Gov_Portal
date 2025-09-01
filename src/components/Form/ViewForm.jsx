import React, { useState } from "react";
import { Upload } from "lucide-react";

export default function FormViewer({formData}) {
  // Using the actual form data from your JSON
  
  // Temporary state just to let users interact during preview
  const [answers, setAnswers] = useState({});

  const getFileTypeName = (type) => {
    const names = {
      'images': 'Images only (JPG, PNG, GIF, etc.)',
      'pdf': 'PDF files only',
      'audio': 'Audio files only (MP3, WAV, etc.)',
      'video': 'Video files only (MP4, AVI, etc.)',
      'documents': 'Document files only (DOC, TXT, etc.)',
      'spreadsheets': 'Spreadsheet files only (XLS, CSV, etc.)',
      'presentations': 'Presentation files only (PPT, etc.)',
      'archives': 'Archive files only (ZIP, RAR, etc.)',
      'custom': 'Custom file types',
      'any': 'Any file type'
    };
    return names[type] || 'Any file type';
  };

  const getAcceptAttribute = (fileUploadType, customFileTypes) => {
    const fileTypeMap = {
      'images': 'image/*',
      'pdf': '.pdf',
      'audio': 'audio/*',
      'video': 'video/*',
      'documents': '.doc,.docx,.txt,.rtf,.odt',
      'spreadsheets': '.xls,.xlsx,.csv,.ods',
      'presentations': '.ppt,.pptx,.odp',
      'archives': '.zip,.rar,.7z,.tar,.gz',
      'custom': customFileTypes,
      'any': '*'
    };
    
    return fileTypeMap[fileUploadType] || '*';
  };

  const handleChange = (qId, value, isMultiple, isFile = false) => {
    if (isFile) {
      // Handle file upload
      setAnswers(prev => ({
        ...prev,
        [qId]: value // value will be the File object or FileList
      }));
    } else if (isMultiple) {
      // For checkboxes — toggle array values
      setAnswers(prev => {
        const prevValues = prev[qId] || [];
        if (prevValues.includes(value)) {
          return {
            ...prev,
            [qId]: prevValues.filter(v => v !== value)
          };
        } else {
          return {
            ...prev,
            [qId]: [...prevValues, value]
          };
        }
      });
    } else {
      // For radios / single-value inputs
      setAnswers(prev => ({
        ...prev,
        [qId]: value
      }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50">
      {/* Form Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {formData.title}
        </h1>
        <p className="text-gray-600">{formData.description}</p>
      </div>

      {/* Questions */}
      {formData.questions.map((q) => (
        <div
          key={q.id}
          className="bg-white shadow-sm rounded-lg p-5 mb-4 border border-gray-200"
        >
          <h2 className="font-medium mb-3">
            {q.question}
            {q.required && <span className="text-red-500 ml-1">*</span>}
          </h2>

          {/* Multiple choice */}
          {q.type === "multiple-choice" && (
            <div className="space-y-2">
              {q.options.map((opt, idx) => (
                <label
                  key={idx}
                  className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => handleChange(q.id, opt, false)}
                    className="mr-3 w-4 h-4 text-blue-600"
                  />
                  <span>{opt}</span>
                </label>
              ))}
              {q.hasOther && (
                <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value="other"
                    checked={answers[q.id] === "other"}
                    onChange={() => handleChange(q.id, "other", false)}
                    className="mr-3 w-4 h-4 text-blue-600"
                  />
                  <span>Other:</span>
                  <input
                    type="text"
                    placeholder="Please specify"
                    className="ml-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                    onClick={(e) => e.stopPropagation()}
                  />
                </label>
              )}
            </div>
          )}

          {/* Checkboxes */}
          {q.type === "checkboxes" && (
            <div className="space-y-2">
              {q.options.map((opt, idx) => (
                <label
                  key={idx}
                  className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    name={`q-${q.id}`}
                    value={opt}
                    checked={answers[q.id]?.includes(opt) || false}
                    onChange={() => handleChange(q.id, opt, true)}
                    className="mr-3 w-4 h-4 text-blue-600 rounded"
                  />
                  <span>{opt}</span>
                </label>
              ))}
              {q.hasOther && (
                <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    name={`q-${q.id}-other`}
                    className="mr-3 w-4 h-4 text-blue-600 rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span>Other:</span>
                  <input
                    type="text"
                    placeholder="Please specify"
                    className="ml-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                    onClick={(e) => e.stopPropagation()}
                  />
                </label>
              )}
            </div>
          )}

          {/* Dropdown */}
          {q.type === "dropdown" && (
            <select
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value, false)}
              className="border border-gray-300 rounded-md p-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose</option>
              {q.options.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}

          {/* Linear Scale */}
          {q.type === "linear-scale" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{q.minLabel || q.scaleMin}</span>
                <div className="flex items-center gap-4">
                  {Array.from({ length: q.scaleMax - q.scaleMin + 1 }, (_, i) => {
                    const value = q.scaleMin + i;
                    return (
                      <label key={value} className="flex flex-col items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={value}
                          checked={answers[q.id] == value}
                          onChange={() => handleChange(q.id, value, false)}
                          className="w-4 h-4 text-blue-600 mb-1"
                        />
                        <span className="text-xs text-gray-500">{value}</span>
                      </label>
                    );
                  })}
                </div>
                <span className="text-sm text-gray-600">{q.maxLabel || q.scaleMax}</span>
              </div>
            </div>
          )}

          {/* Short answer */}
          {q.type === "short-answer" && (
            <input
              type="text"
              placeholder="Your answer"
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value, false)}
              className="border-b border-gray-300 w-full py-2 focus:outline-none focus:border-blue-500 bg-transparent"
            />
          )}

          {/* Paragraph */}
          {q.type === "paragraph" && (
            <textarea
              placeholder="Your answer"
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value, false)}
              rows={4}
              className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            />
          )}

          {/* Date */}
          {q.type === "date" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value, false)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-sm text-gray-500">Select a date</span>
            </div>
          )}

          {/* Time */}
          {q.type === "time" && (
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value, false)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-sm text-gray-500">Select a time</span>
            </div>
          )}

          {/* File Upload */}
          {q.type === "file-upload" && (
            <div className="space-y-4">
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />

                  <input
                    type="file"
                    id={`file-${q.id}`}
                    accept={getAcceptAttribute(q.fileUploadType, q.customFileTypes)}
                    onChange={(e) => handleChange(q.id, e.target.files[0], false, true)}
                    className="hidden"
                  />

                  <label
                    htmlFor={`file-${q.id}`}
                    className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium mb-2"
                  >
                    Click to upload or drag and drop
                  </label>

                  <p className="text-sm text-gray-600 mb-1">
                    {getFileTypeName(q.fileUploadType)}
                  </p>

                  <p className="text-xs text-gray-500">
                    Maximum file size: {q.maxFileSize}MB
                  </p>

                  {q.fileUploadType === 'custom' && q.customFileTypes && (
                    <p className="text-xs text-gray-500 mt-1">
                      Accepted: {q.customFileTypes}
                    </p>
                  )}
                </div>
              </div>

              {/* Display Selected File */}
              {answers[q.id] && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Upload className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {answers[q.id].name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {(answers[q.id].size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => handleChange(q.id, null, false, true)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* File Upload Instructions/Warnings */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Preview Note:</strong> File uploads are functional in this preview.
                  Selected files will be shown but not actually uploaded until form submission.
                </p>
              </div>
            </div>
          )}

        </div>
      ))}

      {/* Submit Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => {
            console.log("Form Answers:", answers);
            alert("This is only for Preview. No submission will happen.");
          }}
          className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Submit
        </button>
      </div>
    </div>
  );
}