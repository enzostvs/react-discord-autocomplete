import React, { useRef } from 'react';

const Text = ({ data, strong }) => {
  const state = useRef({ data, prevValue: null, key: null });

  return (
    <span id={state.current.data.id} dangerouslySetInnerHTML={{ __html: state.current.data.value }} className={`${strong && 'font-semibold'}`} />
  );
};
export default Text;