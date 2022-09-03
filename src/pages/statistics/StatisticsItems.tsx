/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useState } from 'react';
import useAuthStore from '../../services/storage/Auth';
import { IStatGameParam } from '../../types';

export default function StatisticsItems(props: IStatGameParam) {
  const auth = useAuthStore((state) => state.auth);
  const [isAuth, setIsAuth] = useState(auth.message === 'Authenticated');
  const { game } = props;

  useEffect(() => {
    setIsAuth(auth.message === 'Authenticated');
  }, [auth]);

  return (
    <>
      {isAuth ? (
        <>
          <td>{game.countNewWords}</td>
          <td>{game.percent}</td>
          <td>{game.lengthCorrect}</td>
        </>
      ) : (
        <>
          <td>0</td>
          <td>0</td>
          <td>0</td>
        </>
      )}
    </>
  );
}
