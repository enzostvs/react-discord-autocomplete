import React, { useRef } from 'react';

const Text = ({ data }) => {
  const state = useRef({ data, prevValue: null, key: null });

  return (
    <span id={state.current.data.id} className="inline-block h-5 mr-1">
      {state.current.data.value}
    </span>
  );
};
export default Text;