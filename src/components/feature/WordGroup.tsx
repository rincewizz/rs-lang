import React, { useState } from 'react';
import useAuthStore from '../../services/storage/Auth';
import { IWordGroupProps } from '../../types';
import './wordgroup.scss';

export default function WordGroup(props: IWordGroupProps) {
  const { onClickWordGroup, onClickDifficultWordGroup, currentGroup } = props;

  const auth = useAuthStore((state) => state.auth);

  const isAuth = auth.message === 'Authenticated';
  const groupsArr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }];
  if (isAuth) groupsArr.push({ id: 7 });

  const [wordGroup] = useState(groupsArr);

  return (
    <div className="textbook__groups">
      {wordGroup.map((el) => {
        const active = el.id === currentGroup + 1 ? 'textbook__group--active' : '';
        return (
          <button
            key={el.id}
            type="button"
            onClick={
              el.id === 7 ? () => onClickDifficultWordGroup() : () => onClickWordGroup(el.id)
            }
            className={`textbook__group ${active}`}
          >
            {el.id.toString()}
          </button>
        );
      })}
    </div>
  );
}
