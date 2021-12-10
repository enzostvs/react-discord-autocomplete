import React, { useRef, forwardRef } from 'react';
import { Mention, Row, Text } from './block';

const ContentEditable = ({ content, onChange = () => {}, onClose = () => {} }, ref) => {
  const state = useRef({ content, prevValue: null });

  if (JSON.stringify(state.current.prevValue) !== JSON.stringify(content)) {
    state.current.content = [ ...content ];
  }

  const handleChange = (e) => {
    const { target } = e

    if (e.key === 'Enter' && !e.shiftKey) return target.removeChild(target.lastChild)

    let newContent = JSON.parse(JSON.stringify(state.current.content));
    let changedElement;
    let newRow = false;
  
    newContent = newContent.filter(content => Array.from(target.childNodes).map(element => element.id).includes(content.id));
    
    for (const element of target.childNodes) {
      if (element.contentEditable === 'false') continue;
      const notEqual = element.innerHTML !== newContent.find(content => content.id === element.id)?.value ?? false;
      if (notEqual) {
        const countBreak = Array.from(element.childNodes).some(element => element.nodeName === 'BR');
        if (element?.children) Array.from(element.children).forEach(child => child && element?.removeChild(child));
        newRow = countBreak;
        changedElement = element.id
      }
      const contentIndex = newContent.findIndex(item => item.id === element.id)
      if (newContent[contentIndex]) {
        newContent[contentIndex].value = element.textContent;
      }
    }

    state.current.prevValue = newContent
    onChange(newContent, changedElement, newRow)
  }

  const handleClose = (event) => {
    if (['Escape', ' '].includes(event.key)) onClose()
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
      contentEditable={true}
      ref={ref}
      suppressContentEditableWarning={true}
      className="bg-gray-200 w-full p-5 mt-3 rounded-lg max-h-56 overflow-scroll outline-none text-white text-opacity-70"
      onKeyUp={handleChange}
      onKeyDown={handleClose}
    >
      { state.current.content.map((element, e) => (
        <React.Fragment key={element.id}>
          { renderBlock(element) }
        </React.Fragment>
      ))}
    </div>
  );
};
export default forwardRef(ContentEditable);