import React, { useState } from 'react';
import './wordgroup.scss';

export default function WordGroup(props: {
  onClickWordGroup: (group: number) => void;
  currentGroup: number;
}) {
  const { onClickWordGroup, currentGroup } = props;
  const [wordGroup] = useState([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }]);

  return (
    <div className="textbook__groups">
      {wordGroup.map((el) => (
        <button
          key={el.id}
          type="button"
          onClick={() => onClickWordGroup(el.id)}
          className={`button textbook__group ${
            el.id === currentGroup + 1 ? 'textbook__group--active' : ''
          }`}
        >
          {el.id.toString()}
        </button>
      ))}
    </div>
  );
}
