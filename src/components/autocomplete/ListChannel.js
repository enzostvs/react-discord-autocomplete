import { useRef } from 'react';
import hash from './../../assets/images/hash.svg';
import { useKey } from 'react-use';

const ListMember = ({ data, isSelected, index, onSelect = () => {}, onSubmit = () => {} }) => {
  const state = useRef({ isSelected, data });
  if (isSelected !== state.current.isSelected) {
    state.current.isSelected = isSelected
  }
  useKey('Enter', () => {
    if (state.current.isSelected) onSubmit({ id: data.id, data: data.name });
  })

  return (
    <li
      className={`text-white text-base flex items-center w-full justify-start rounded-lg px-4 py-2.5 cursor-pointer ${state.current.isSelected && 'bg-gray-300'}`}
      onClick={() => onSubmit({ id: data.id, data: data.name })}
      onMouseEnter={(e) => onSelect(index)}
    >
      <img src={hash} alt="hash" className="w-5 mr-2" />
      <p>
        { data.name }
      </p>
    </li>
  )
}
export default ListMember;