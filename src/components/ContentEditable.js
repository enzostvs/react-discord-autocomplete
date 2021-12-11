import React, { useRef, forwardRef } from 'react';
import { Mention, Row, Text } from './block';
import { getTypes, generateId } from './../utils/functions';

const ContentEditable = ({ content, onChange = () => {}, onNewRow = () => {}, onFocus = () => {} }, ref) => {
  const state = useRef({ content, prevValue: null });

  if (JSON.stringify(state.current.prevValue) !== JSON.stringify(content)) {
    state.current.content = [ ...content ];
  }

  const handleChange = (event) => {
    const { target } = event;
    const newContent = JSON.parse(JSON.stringify(state.current.content));
    Array.from(target.childNodes).filter(node => node?.contentEditable !== 'false').forEach(node => {
      const editableContent = content.findIndex(item => item.id === node.id);
      if (editableContent !== -1) newContent[editableContent].value = node.textContent;
    });

    state.current.prevValue = newContent;
    onChange(newContent);
  }

  const disabledEnter = (event) => {    
    if (event.key === 'Enter') {
      event.preventDefault();
      if (event.shiftKey) onNewRow();
    }
  }

  const renderBlock = (block) => {
    switch (block.type) {
      case 'text':
        return <Text data={block} />;
      case 'channels':
      case 'members':
        return <Mention data={block} />;
      case 'row':
        return <Row data={block} />;
      default:
        return null
    }
  }

  return (
    <div
      ref={ref}
      contentEditable={true}
      suppressContentEditableWarning={true}
      className="bg-gray-200 w-full p-5 mt-3 rounded-lg max-h-56 overflow-scroll outline-none text-white text-opacity-70"
      onInput={handleChange}
      onKeyDown={disabledEnter}
    >
      {state.current.content.map(item => (
        <React.Fragment key={item.id}>
          { renderBlock(item) }
        </React.Fragment>
      ))}
    </div>
  );
};
export default forwardRef(ContentEditable);