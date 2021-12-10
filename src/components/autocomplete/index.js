import React, { useRef, useState, useEffect } from 'react';
import { useKey } from 'react-use';

import ListChannel from './ListChannel';
import ListUser from './ListUser';

import { generateId, insert } from './../../utils/functions';

import data from './../../api/data.json';

const Autocomplete = ({ search, content, onSubmit = () => {}, onBlur = () => {}, onFocus = () => {} }) => {

  const state = useRef({ content, search, prevContent: null })

  if (JSON.stringify(state.current.prevContent) !== JSON.stringify(content)) state.current.content = [ ...content ];
  if (state.current.search !== search) state.current.search = { ...search };

  const [selected, setSelected] = useState(0)

  const [users, setUsers] = useState([data.users]);
  const [channels, setChannels] = useState(data.channels);

  const handleSubmit = ({ id, data }) => {
    const { type, character, value, index } = state.current.search
    let newContent = JSON.parse(JSON.stringify(state.current.content));
    const splittedValue = newContent[index].value.split(value);
    newContent[index].value = splittedValue[0];
    newContent[index].id = generateId();

    const newElements = [{ type, value: `<${character}${id}>`, data, id: generateId() }, { type: 'text', value: splittedValue[1] ?? ' ', id: generateId() }];
    newContent = insert(newContent, index + 1, newElements)

    state.current.prevContent = newContent;
    onSubmit(newContent);
  }

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
      setSelected(0)
    }
  }
  useEffect(filterData, [search])

  const increment = (i) => {
    onBlur()
    setSelected(selected => {
      const value = selected + i
      return value < 0 ? 0 : value
    });
  }
  useKey('ArrowUp', () => increment(-1));
  useKey('ArrowDown', () => increment(1));

  return (
    <div className={`bg-gray-500 p-3 rounded-lg border-gray-600 border-opacity-20 border shadow-lg absolute w-full transform -translate-y-full ${!search?.value || channels.length === 0 || users.length === 0 ? 'opacity-0 pointer-events-none' : ''}`}>
      <p className="text-white px-2">
        <span className="uppercase text-white text-opacity-60 text-sm mr-2">{ search?.type } started with</span>
        { search?.value ?? '' }
      </p>
      { search?.type &&
        <ul className="mt-3">
          {
            search.type === 'channels' && channels.map((channel, i) => (
              <ListChannel key={channel.id} index={i} data={channel} isSelected={selected === i} onSubmit={handleSubmit} onSelect={e => setSelected(e)} />
            ))
          }
          {
            search.type === 'members' && users.map((user, i) => (
              <ListUser key={user.id} index={i} data={user} isSelected={selected === i} onSubmit={handleSubmit} onSelect={e => setSelected(e)} />
            ))
          }
        </ul>
      }
    </div>
  )
}
export default Autocomplete;