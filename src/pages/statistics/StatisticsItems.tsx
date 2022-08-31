import React from 'react';
import { IStatGameParam } from '../../types';

export default function StatisticsItems(props: IStatGameParam) {
  const { game } = props;
  return (
    <>
      <td>{game.countNewWords}</td>
      <td>{game.percent}</td>
      <td>{game.lengthCorrect}</td>
    </>
  );
}
