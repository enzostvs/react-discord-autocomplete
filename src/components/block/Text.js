import React, { useRef } from 'react';

const Text = ({ data }) => {
  const state = useRef({ data, prevValue: null, key: null });

  return (
    <span id={state.current.data.id} dangerouslySetInnerHTML={{ __html: state.current.data.value }} />
  );
};
export default Text;