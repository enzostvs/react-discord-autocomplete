import React, { useRef } from 'react';

const Row = ({ data }) => {
  const state = useRef({ data, prevValue: null, key: null });

  return (
    <div id={state.current.data.id} contentEditable={false} className="mt-1" />
  );
};
export default Row;