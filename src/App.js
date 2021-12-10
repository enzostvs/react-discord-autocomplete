import React, { useState, useRef, useEffect } from 'react';
import ContentEditable from './components/ContentEditable'
import Autocomplete from './components/autocomplete'
import { generateId } from './utils/functions';

function App() {
  const [content, setContent] = useState([
    { type: 'text', value: 'Hello World', id: generateId() }
  ]);
  const [search, setSearch] = useState(null);
  const [newRow, setNewRow] = useState(false);

  const editableRef = useRef(null);

  useEffect(() => {
    if (newRow) {
      setFocus()
      setNewRow(false)
    }
  }, [newRow])

  const addToContent = (newContent) => {
    setContent(newContent)
    setSearch(null)
  }

  const handleChange = (changedContent, id, addRow) => {
    const newContent = [ ...changedContent ];
    if (addRow) {
      newContent.push({ type: 'row', value: '', id: generateId() }, { type: 'text', value: ' ', id: generateId() });
      setNewRow(true)
    } else {
      const index = newContent.findIndex(element => element.id === id);
      const targetWord = newContent[index]?.value?.match(/@[\w-]+/g)?.[0] ?? newContent[index]?.value?.match(/#[\w-]+/g)?.[0] ?? '';

      if (search?.value === targetWord) setSearch(null)
      let type;
      switch (targetWord.charAt(0)) {
        case '@':
          type = 'members';
          break;
        case '#':
          type = 'channels';
          break;
        default:
          type = null;
      }
  
      if (type) {
        setSearch({ type, value: targetWord, character: targetWord.charAt(0), index })
      } else {
        setSearch(null)
      }
    }
    setContent(newContent);
  };

  const setFocus = () => {
    const range = document.createRange()
    const sel = window.getSelection()
    range.setStart(editableRef.current.childNodes[editableRef.current.childNodes.length - 1], 0)
    range.setEnd(editableRef.current.childNodes[editableRef.current.childNodes.length - 1], 0)
    range.collapse(true)
    sel.removeAllRanges()
    sel.addRange(range)
  }

  const handleClose = () => setSearch(null);
  const handleBlur = () => editableRef.current.blur();
  const handleFocus = () => editableRef.current.focus();

  // const handleSubmit = () => {
  //   todo add submit message
  // }

  return (
    <div className="bg-red-500 max-w-2xl mx-auto flex items-center justify-center h-full">
      <div className="w-full relative">
        <Autocomplete search={search} content={content} onSubmit={addToContent} onBlur={handleBlur} onFocus={handleFocus} />
        <ContentEditable ref={editableRef} content={content} onChange={handleChange} onClose={handleClose} />
      </div>
    </div>
  );
}

export default App;
