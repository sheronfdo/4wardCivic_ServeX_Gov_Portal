import React, { useState, useRef, useEffect } from 'react';
import { Plus, Copy, Trash2, Image, Video, Palette, Eye, Send, MoreVertical, GripVertical, Bold, Italic, Underline, Link, X } from 'lucide-react';

const RichTextEditor = ({ type, value, onChange, placeholder, className }) => {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // Save and restore cursor position
  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
    return null;
  };

  const restoreCursorPosition = (range) => {
    if (range) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const format = (command, value = null) => {
    const range = saveCursorPosition();
    document.execCommand(command, false, value);
    onChange(editorRef.current.innerHTML);
    setTimeout(() => restoreCursorPosition(range), 0);
  };

  const handleInput = () => {
    onChange(editorRef.current.innerHTML);
  };

  const handleBlur = () => {
    // Small delay to allow toolbar clicks to register
    setTimeout(() => setIsFocused(false), 150);
  };

  // Only update content if it's different from current content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      const range = saveCursorPosition();
      editorRef.current.innerHTML = value || '';
      setTimeout(() => restoreCursorPosition(range), 0);
    }
  }, [value]);

  const ToolbarButton = ({ onClick, icon: Icon, tooltip }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={onClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          type="button"
        >
          <Icon size={18} />
        </button>
        {showTooltip && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
            {tooltip}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
       
      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        type={type}
        className={`${className} ${!value && placeholder ? 'empty' : ''}`}
        style={{
          minHeight: '1.5em',
        }}
        data-placeholder={placeholder}
      />
      
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>

      {/* Toolbar */}
      {isFocused && (
        <div className="flex gap-2 mb-2 text-gray-600 border-b pb-2">
          <ToolbarButton 
            onClick={() => format('bold')} 
            icon={Bold} 
            tooltip="Bold" 
          />
          <ToolbarButton 
            onClick={() => format('italic')} 
            icon={Italic} 
            tooltip="Italic" 
          />
          <ToolbarButton 
            onClick={() => format('underline')} 
            icon={Underline} 
            tooltip="Underline" 
          />
          <ToolbarButton 
            onClick={() => {
              const url = prompt("Enter link:");
              if (url) format('createLink', url);
            }} 
            icon={Link} 
            tooltip="Link" 
          />
          <ToolbarButton 
            onClick={() => format('removeFormat')} 
            icon={X} 
            tooltip="Clear Format" 
          />
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;