import React, { useState, useEffect } from "react";

export default function FormViewerResponse({ formData, responseData }) {
  // Initialize with response data if provided, otherwise empty state
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (responseData) {
      // Pre-populate answers with response data
      setAnswers(responseData);
    }
  }, [responseData]);

  const handleChange = (qId, value, isMultiple) => {
    if (isMultiple) {
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

  const isReadOnly = !!responseData; // If response data exists, make form read-only

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50">
      {/* Form Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1
          className="text-2xl font-bold mb-2"
          dangerouslySetInnerHTML={{ __html: formData.title }}
        />
        <p className="text-gray-600">{formData.description}</p>
        {isReadOnly && (
          <div className="mt-3 p-2 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
            <p className="text-sm">This form shows the submitted response data.</p>
          </div>
        )}
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
                  className={`flex items-center p-2 rounded ${isReadOnly ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50'}`}
                >
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => !isReadOnly && handleChange(q.id, opt, false)}
                    disabled={isReadOnly}
                    className="mr-3 w-4 h-4 text-blue-600"
                  />
                  <span className={answers[q.id] === opt && isReadOnly ? 'font-semibold text-blue-600' : ''}>{opt}</span>
                </label>
              ))}
              {q.hasOther && (
                <label className={`flex items-center p-2 rounded ${isReadOnly ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value="other"
                    checked={answers[q.id] === "other"}
                    onChange={() => !isReadOnly && handleChange(q.id, "other", false)}
                    disabled={isReadOnly}
                    className="mr-3 w-4 h-4 text-blue-600"
                  />
                  <span>Other:</span>
                  <input
                    type="text"
                    placeholder="Please specify"
                    disabled={isReadOnly}
                    className="ml-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent disabled:bg-gray-100"
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
                  className={`flex items-center p-2 rounded ${isReadOnly ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50'}`}
                >
                  <input
                    type="checkbox"
                    name={`q-${q.id}`}
                    value={opt}
                    checked={answers[q.id]?.includes(opt) || false}
                    onChange={() => !isReadOnly && handleChange(q.id, opt, true)}
                    disabled={isReadOnly}
                    className="mr-3 w-4 h-4 text-blue-600 rounded"
                  />
                  <span className={answers[q.id]?.includes(opt) && isReadOnly ? 'font-semibold text-blue-600' : ''}>{opt}</span>
                </label>
              ))}
              {q.hasOther && (
                <label className={`flex items-center p-2 rounded ${isReadOnly ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50'}`}>
                  <input
                    type="checkbox"
                    name={`q-${q.id}-other`}
                    disabled={isReadOnly}
                    className="mr-3 w-4 h-4 text-blue-600 rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span>Other:</span>
                  <input
                    type="text"
                    placeholder="Please specify"
                    disabled={isReadOnly}
                    className="ml-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent disabled:bg-gray-100"
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
              onChange={(e) => !isReadOnly && handleChange(q.id, e.target.value, false)}
              disabled={isReadOnly}
              className="border border-gray-300 rounded-md p-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
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
                    const isSelected = answers[q.id] == value;
                    return (
                      <label key={value} className={`flex flex-col items-center ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}`}>
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={value}
                          checked={isSelected}
                          onChange={() => !isReadOnly && handleChange(q.id, value, false)}
                          disabled={isReadOnly}
                          className="w-4 h-4 text-blue-600 mb-1"
                        />
                        <span className={`text-xs ${isSelected && isReadOnly ? 'font-bold text-blue-600' : 'text-gray-500'}`}>{value}</span>
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
            <div className="relative">
              <input
                type="text"
                placeholder={isReadOnly ? "No answer provided" : "Your answer"}
                value={answers[q.id] || ""}
                onChange={(e) => !isReadOnly && handleChange(q.id, e.target.value, false)}
                disabled={isReadOnly}
                className={`border-b border-gray-300 w-full py-2 focus:outline-none focus:border-blue-500 bg-transparent disabled:bg-gray-50 ${isReadOnly && answers[q.id] ? 'font-medium text-blue-700' : ''}`}
              />
            </div>
          )}

          {/* Paragraph */}
          {q.type === "paragraph" && (
            <textarea
              placeholder={isReadOnly ? "No answer provided" : "Your answer"}
              value={answers[q.id] || ""}
              onChange={(e) => !isReadOnly && handleChange(q.id, e.target.value, false)}
              disabled={isReadOnly}
              rows={4}
              className={`border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical disabled:bg-gray-50 ${isReadOnly && answers[q.id] ? 'font-medium text-blue-700' : ''}`}
            />
          )}

          {/* Date */}
          {q.type === "date" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={answers[q.id] || ""}
                onChange={(e) => !isReadOnly && handleChange(q.id, e.target.value, false)}
                disabled={isReadOnly}
                className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 ${isReadOnly && answers[q.id] ? 'font-medium text-blue-700' : ''}`}
              />
              <span className="text-sm text-gray-500">
                {isReadOnly ? (answers[q.id] ? 'Selected date' : 'No date selected') : 'Select a date'}
              </span>
            </div>
          )}

          {/* Time */}
          {q.type === "time" && (
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={answers[q.id] || ""}
                onChange={(e) => !isReadOnly && handleChange(q.id, e.target.value, false)}
                disabled={isReadOnly}
                className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 ${isReadOnly && answers[q.id] ? 'font-medium text-blue-700' : ''}`}
              />
              <span className="text-sm text-gray-500">
                {isReadOnly ? (answers[q.id] ? 'Selected time' : 'No time selected') : 'Select a time'}
              </span>
            </div>
          )}
        </div>
      ))}

      {/* Submit Button */}
      <div className="flex justify-center mt-8">
        {isReadOnly ? (
          <div className="text-center">
            <div className="inline-block bg-green-100 text-green-800 px-6 py-3 rounded-md font-medium">
              ✓ Form Submitted
            </div>
            <p className="text-sm text-gray-600 mt-2">
              This form was submitted and cannot be modified.
            </p>
          </div>
        ) : (
          <button
            onClick={() => {
              console.log("Form Answers:", answers);
              alert("This is only For Preview. No submission will happen.");
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}