import React, { useEffect, useState } from 'react';
import useAuthStore from '../../services/storage/Auth';
import { IWordGroupProps } from '../../types';
import './wordgroup.scss';

export default function WordGroup(props: IWordGroupProps) {
  const { onClickWordGroup, onClickDifficultWordGroup, currentGroup } = props;

  const auth = useAuthStore((state) => state.auth);

  const groupsArr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }];
  const [wordGroup, setWordGroup] = useState(groupsArr);

  useEffect(() => {
    if (auth.message === 'Authenticated' && wordGroup.length < 7)
      setWordGroup(wordGroup.concat({ id: 7 }));
    if (auth.message !== 'Authenticated') setWordGroup(groupsArr);
  }, [auth]);

  return (
    <div className="textbook__groups">
      {wordGroup.map((el) => {
        const active = el.id === currentGroup + 1 ? 'textbook__group--active' : '';
        return (
          (auth || (!auth && el.id !== 7)) && (
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
          )
        );
      })}
    </div>
  );
}
