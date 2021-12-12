import React, { useRef } from 'react';
import { mention } from '../../utils/functions';

const Mention = ({ data }) => {
  const state = useRef({ data, prevValue: null, key: null });

  const renderType = (type) => {
    switch (type) {
      case 'members':
        return '@';
      case 'channels':
        return '#';
      default:
        return '';
    }
  }
  return (
    <span id={state.current.data.id} contentEditable={false} className={`${mention(state.current.data.type)}`}>
      {renderType(state.current.data.type)}
      { state.current.data.data }
    </span>
  );
};
export default Mention;