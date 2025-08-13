import React, { useState } from "react";

export default function FormViewer({ formData }) {
  // Temporary state just to let users interact during preview
  const [answers, setAnswers] = useState({});

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

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50">
      {/* Form Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1
          className="text-2xl font-bold mb-2"
          dangerouslySetInnerHTML={{ __html: formData.title }}
        />
        <p className="text-gray-600">{formData.description}</p>
      </div>

      {/* Questions */}
      {formData.questions.map((q) => (
        <div
          key={q.id}
          className="bg-white shadow-sm rounded-lg p-5 mb-4 border border-gray-200"
        >
          <h2 className="font-medium mb-3">{q.question}</h2>

          {/* Multiple choice */}
          {q.type === "multiple-choice" &&
            q.options.map((opt, idx) => (
              <label
                key={idx}
                className="flex items-center mb-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => handleChange(q.id, opt, false)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}

          {/* Checkboxes */}
          {q.type === "checkboxes" &&
            q.options.map((opt, idx) => (
              <label
                key={idx}
                className="flex items-center mb-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={`q-${q.id}`}
                  value={opt}
                  checked={answers[q.id]?.includes(opt) || false}
                  onChange={() => handleChange(q.id, opt, true)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}

          {/* Short answer */}
          {q.type === "short-answer" && (
            <input
              type="text"
              placeholder="Short answer text"
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value, false)}
              className="border-b border-gray-300 w-full focus:outline-none"
            />
          )}

          {/* Paragraph */}
          {q.type === "paragraph" && (
            <textarea
              placeholder="Long answer text"
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value, false)}
              className="border border-gray-300 rounded-md w-full p-2"
            />
          )}

          {/* Dropdown */}
          {q.type === "dropdown" && (
            <select
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value, false)}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">Choose</option>
              {q.options.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}

          {q.required && (
            <p className="text-red-500 text-xs mt-2">* Required</p>
          )}
        </div>
      ))}
    </div>
  );
}
