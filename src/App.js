import React, { useState, useRef, useEffect } from 'react';
import ContentEditable from './components/ContentEditable'
import Autocomplete from './components/autocomplete'

import UTILS from './utils';
import data from './api/data.json';

function App() {
  const [content, setContent] = useState([{ type: 'text', value: UTILS.SPECIAL_CHARACTER, id: UTILS.generateId() }]);
  const [search, setSearch] = useState(null);

  const [users, setUsers] = useState([data.users]);
  const [channels, setChannels] = useState(data.channels);
  
  const editableRef = useRef(null);

  const handleChangeContent = (changedContent) => setContent(changedContent);

  const handleAddRow = () => {
    setContent([...content, { type: 'row', id: UTILS.generateId() }, { type: 'text', value: UTILS.SPECIAL_CHARACTER, id: UTILS.generateId() }]);
    setSearch(null);
  }

  const handleFocus = (selectedElement, index = 1) => {
    if (!selectedElement) return editableRef.current.focus();
    const range = document.createRange();
    const selection = window.getSelection();
    range.setStart(selectedElement, index);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  const handleBlur = () => editableRef.current.blur();
  
  const handleSearch = (searchValue) => setSearch(searchValue);

  const filterData = () => {
    if (!search?.value) {
      setUsers(data.users);
      setChannels(data.channels);
    } else {
      const Dict = {
        channels: () => {
          const filtered = data.channels.filter(channel => `${search.character}${channel.name.toLowerCase()}`.startsWith(search.value.toLowerCase()));
          setChannels(filtered);
        },
        members: () => {
          const filtered = data.users.filter(user => `${search.character}${user.username.toLowerCase()}`.startsWith(search.value.toLowerCase()));
          setUsers(filtered)
        }
      }
      Dict[search.type].call()
    }
  }

  useEffect(() => {
    const childNodes = Array.from(editableRef.current.childNodes);
    if (content.at(-1)?.value === UTILS.SPECIAL_CHARACTER) handleFocus(childNodes.at(-1), 1);
    if (childNodes.length === 1 && childNodes[0].nodeName === 'BR') {
      editableRef.current.removeChild(childNodes[0]);
      setContent([...content, { type: 'text', value: UTILS.SPECIAL_CHARACTER, id: UTILS.generateId() }]);
    }
  }, [content])

  useEffect(filterData, [search])
  
  const renderData = () => !search ? [] : search.type === 'channels' ? channels : users;
  
  return (
    <div className="bg-red-500 max-w-2xl mx-auto flex items-center justify-center h-full">
      <div className="w-full relative">
        {/* onSubmit={addToContent} onBlur={handleBlur} */}
        <Autocomplete
          search={search}
          content={content}
          data={renderData()}
          onBlur={handleBlur}
          onSubmit={handleChangeContent}
          onSearch={handleSearch}
        />
        <ContentEditable
          ref={editableRef}
          content={content}
          search={search}
          onChange={handleChangeContent}
          onNewRow={handleAddRow}
          onSearch={handleSearch}
        />
      </div>
    </div>
  );
}

export default App;
