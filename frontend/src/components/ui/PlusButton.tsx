import React from 'react';

const PlusButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button  className="plus-button" onClick={onClick}  > + </button>
);

export default PlusButton;