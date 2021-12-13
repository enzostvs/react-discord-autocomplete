import React, { useRef, forwardRef } from 'react';
import { Mention, Row, Text } from './block';

import UTILS from './../utils';

const ContentEditable = (
  {
    content,
    search,
    onChange = () => {},
    onNewRow = () => {},
    onSearch = () => {},
  },
  ref
) => {

  const state = useRef({ content, search, prevValue: null });

  if (JSON.stringify(state.current.prevValue) !== JSON.stringify(content)) {
    state.current.content = [ ...content ];
  }

  const handleChange = (event) => {
    const { target } = event;

    let changedElement = null;
    const childNodes = Array.from(target.childNodes);
    let newContent = JSON.parse(JSON.stringify(content));

    childNodes.filter(node => node?.contentEditable !== 'false').forEach(node => {
      const targetWord = node.textContent.match(/\*{2}(.*)\*{2}/g)?.[0]
      
      const contentElementIndex = newContent.findIndex(content => content.id === node.id);
      const notEqualElement = node.textContent !== newContent[contentElementIndex]?.value ? newContent[contentElementIndex] : null;
      const editableContent = content.findIndex(item => item.id === node.id);
      
      if (notEqualElement) changedElement = { item: notEqualElement, index: contentElementIndex };

      if (editableContent !== -1) {
        if (targetWord) {
          const splittedValue = node.textContent.split(targetWord).filter(e => e !== '');

          newContent[editableContent].value = splittedValue[0];
          newContent[editableContent].id = UTILS.generateId();

          const newElements = [{ type: 'text-bold', value: targetWord.replaceAll('**', '') , id: UTILS.generateId() }, { type: 'text', value: UTILS.SPECIAL_CHARACTER, id: UTILS.generateId() }];
          newContent = UTILS.insert(newContent, contentElementIndex + 1, newElements)
        } else {
          newContent[editableContent].value = node.textContent;
        }
      }
    });
    
    if (changedElement) handleChangeElement(changedElement);
    onChange(newContent);
  }

  const handleChangeElement = ({ item, index }) => {
    const targetWord = item?.value?.match(/@\w+$/g)?.[0] ?? item?.value?.match(/#\w+$/g)?.[0] ?? '';

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
      onSearch({ type, value: targetWord, character: targetWord.charAt(0), index })
    } else {
      onSearch(null)
    }
  }

  const disabledKey = (event) => {
    if (event.key === 'Backspace') {
      if (event.target?.childNodes.length === 1 && [1].includes(event.target.childNodes[0].textContent?.length)) event.preventDefault();
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      if (event.shiftKey) return onNewRow();
      console.warn('CALL FUNCTION TO SEND ALL CONTENT TO API')
    }
  }

  const renderBlock = (block) => {
    switch (block.type) {
      case 'text':
        return <Text data={block} />;
      case 'text-bold':
        return <Text data={block} strong={true} />;
      case 'channels':
      case 'members':
        return <Mention data={block} />;
      case 'row':
        return <Row data={block} />;
      default:
        return null
    }
  }
  const allowedPlaceholder = () => content?.length === 1 && content[0].value === UTILS.SPECIAL_CHARACTER;

  return (
    <div className="outline-none bg-gray-200 w-full p-5 mt-3 rounded-lg relative">
      { allowedPlaceholder() &&
        <p className="text-white text-opacity-30 absolute top-5 left-5 w-full pointer-events-none">
          Write your message here
        </p>
      }
      <div
        ref={ref}
        id="content-editable"
        contentEditable={true}
        suppressContentEditableWarning={true}
        className="max-h-56 overflow-scroll outline-none text-white text-opacity-70"
        onInput={handleChange}
        onKeyDown={disabledKey}
      >
        {state.current?.content?.map(item => (
          <React.Fragment key={item.id}>
            { renderBlock(item) }
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
export default forwardRef(ContentEditable);