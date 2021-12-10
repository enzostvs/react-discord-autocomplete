import { useRef } from 'react';
import { useKey } from 'react-use';

const ListUser = ({ data, isSelected, index, onSelect = () => {}, onSubmit = () => {} }) => {
  const state = useRef({ isSelected, data });
  if (isSelected !== state.current.isSelected) {
    state.current.isSelected = isSelected
  }
  useKey('Enter', () => {
    if (state.current.isSelected) onSubmit({ id: data.id, data: data.username });
  })

  return (
    <li
      className={`text-white text-base flex items-center w-full justify-start rounded-lg px-4 py-2.5 cursor-pointer ${state.current.isSelected && 'bg-gray-300'}`}
      onClick={() => onSubmit({ id: data.id, data: data.username })}
      onMouseEnter={(e) => onSelect(index)}
    >
      
      <div className="w-full flex justify-start">
        <img src="https://cdn.discordapp.com/avatars/452475691410128906/cfa040759be770762bf37e35d415f356.webp?size=32" alt="hash" className="w-8 h-8 rounded-full mr-3" />
        <p className="leading-loose">
          { data.username }
        </p>
      </div>
      <p className="text-white text-opacity-70">
        { data.dataname }#{ data.discriminator }
      </p>
    </li>
  )
}
export default ListUser;