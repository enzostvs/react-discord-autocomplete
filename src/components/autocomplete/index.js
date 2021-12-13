import React, { useRef, useState } from 'react';
import { useKey } from 'react-use';

import ListItem from './ListItem';

import UTILS from './../../utils';

const Autocomplete = ({ search, content, data, onSubmit = () => {}, onBlur = () => {}, onSearch = () => {} }) => {

  const state = useRef({ content, data, search, prevContent: null })

  if (JSON.stringify(state.current.prevContent) !== JSON.stringify(content)) state.current.content = [ ...content ];
  if (data) state.current.data = [ ...data ];
  if (state.current.search !== search) state.current.search = { ...search };

  const [selected, setSelected] = useState(0)

  const handleSubmit = ({ id, data }) => {
    const { type, character, value, index } = state.current.search
    let newContent = JSON.parse(JSON.stringify(state.current.content));

    const splittedValue = newContent[index]?.value.split(value).filter(e => e !== '');
    newContent[index].value = splittedValue[0];
    newContent[index].id = UTILS.generateId();

    const newElements = [{ type, value: `<${character}${id}>`, data, id: UTILS.generateId() }, { type: 'text', value: splittedValue[1] ?? UTILS.SPECIAL_CHARACTER, id: UTILS.generateId() }];
    newContent = UTILS.insert(newContent, index + 1, newElements)

    state.current.prevContent = newContent;
    setSelected(0);
    onSubmit(newContent);
    onSearch(null);
  }

  const increment = (i) => {
    if (!state.current.search?.value) return;
    onBlur()
    setSelected(selected => {
      const value = selected + i
      const totalLength = state.current.data.length - 1
      if (value > totalLength ) return 0
      return value < 0 ? 0 : value
    });
  }
  useKey('ArrowUp', () => increment(-1));
  useKey('ArrowDown', () => increment(1));
  useKey('Escape', () => onSearch(null))

  return (
    <div className={`bg-gray-500 p-3 rounded-lg border-gray-600 border-opacity-20 border shadow-lg absolute w-full transform -translate-y-full ${!search?.value || data.length === 0 ? 'opacity-0 pointer-events-none' : ''}`}>
      <p className="text-white px-2">
        <span className="uppercase text-white text-opacity-60 text-sm mr-2">{ search?.type } started with</span>
        { search?.value ?? '' }
      </p>
      <ul className="mt-3">
        { data.map((item, i) => (
          <ListItem
            key={item.id}
            index={i}
            data={item}
            isSelected={selected === i}
            onSubmit={handleSubmit}
            onSelect={e => setSelected(e)}
          />
        )) }
      </ul>
    </div>
  )
}
export default Autocomplete;