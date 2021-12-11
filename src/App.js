import React, { useState, useRef, useEffect } from 'react';
import ContentEditable from './components/ContentEditable'
import Autocomplete from './components/autocomplete'
import { generateId, getTypes } from './utils/functions';

function App() {
  const [content, setContent] = useState([
    { type: 'text', value: '&#xFEFF;', id: generateId() },
  ]);
  const [search, setSearch] = useState(null);
  
  const editableRef = useRef(null);

  const handleChangeContent = (changedContent) => setContent(changedContent);

  const handleAddRow = () => {
    setContent([...content, { type: 'row', id: generateId() }, { type: 'text', value: '&#xFEFF;', id: generateId() }]);
  }

  const handleFocus = (selectedElement) => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.setStart(selectedElement, 1);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  return (
    <div className="bg-red-500 max-w-2xl mx-auto flex items-center justify-center h-full">
      <div className="w-full relative">
        <ContentEditable ref={editableRef} content={content} onChange={handleChangeContent} onNewRow={handleAddRow} onFocus={handleFocus} />
      </div>
    </div>
  );
}

export default App;
