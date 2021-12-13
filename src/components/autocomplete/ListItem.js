import { useRef } from 'react';
import { useKey } from 'react-use';

import hash from './../../assets/images/hash.svg';

const ListItem = ({ data, isSelected, index, onSelect = () => {}, onSubmit = () => {} }) => {
  const state = useRef({ isSelected });
  if (isSelected !== state.current.isSelected) {
    state.current.isSelected = isSelected
  }
  
  const handleSubmit = (data) => onSubmit({ id: data.id, data: data.username ?? data.name })
  useKey('Enter', (e) => {
    e.preventDefault();
    if (state.current.isSelected) handleSubmit(data);
  })

  return (
    <li
      className={`text-white text-base flex items-center w-full justify-start rounded-lg px-4 py-2.5 cursor-pointer ${state.current.isSelected && 'bg-gray-300'}`}
      onClick={() => handleSubmit(data)}
      onMouseEnter={(e) => onSelect(index)}
    >
      { data.username ?
        <>
          <div className="w-full flex justify-start">
            <img src="https://cdn.discordapp.com/avatars/452475691410128906/cfa040759be770762bf37e35d415f356.webp?size=32" alt="hash" className="w-8 h-8 rounded-full mr-3" />
            <p className="leading-loose">
              { data.username }
            </p>
          </div>
          <p className="text-white text-opacity-70">
            { data.dataname }#{ data.discriminator }
          </p>
        </>
        :
        <>
          <img src={hash} alt="hash" className="w-5 mr-2" />
          <p>
            { data.name }
          </p>
        </>
      }
    </li>
  )
}
export default ListItem;