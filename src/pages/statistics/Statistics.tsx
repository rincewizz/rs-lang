import React, { useEffect, useState } from 'react';
import Footer from '../../components/shared/Footer';
import Header from '../../components/shared/Header';
import StatisticsItems from './StatisticsItems';
import { userStatisticApi } from '../../services/api/Statistic';
import useAuthStore from '../../services/storage/Auth';
import { IStatGameForTable, IStatisticGame } from '../../types';
import './statistics.scss';

function createObjForStat(count: number, perc: number, length: number) {
  return {
    countNewWords: count,
    percent: perc,
    lengthCorrect: length,
  };
}

function getStatForTable(game: IStatisticGame) {
  const { countCorrect, lengthCorrect, countNewWords, totalWords } = game as IStatisticGame;
  const percent = totalWords > 0 ? (countCorrect / totalWords) * 100 : 0;
  return {
    countNewWords,
    percent: +percent.toFixed(2),
    lengthCorrect,
  };
}

function getTotalStat(gameS: IStatisticGame, gameV: IStatisticGame) {
  const totalWords = gameS.totalWords + gameV.totalWords;
  const countCorrect = gameS.countCorrect + gameV.countCorrect;
  const percent = totalWords > 0 ? (countCorrect / totalWords) * 100 : 0;
  const lengthCorrect =
    gameS.lengthCorrect > gameV.lengthCorrect ? gameS.lengthCorrect : gameV.lengthCorrect;
  return {
    countNewWords: gameS.countNewWords + gameV.countNewWords,
    percent: +percent.toFixed(2),
    lengthCorrect,
  };
}

export default function Statistics() {
  const auth = useAuthStore((state) => state.auth);
  const isAuth = auth.message === 'Authenticated';
  const [gameVoice, setGameVoice] = useState<IStatGameForTable>(createObjForStat(0, 0, 0));
  const [gameSprint, setGameSprint] = useState<IStatGameForTable>(createObjForStat(0, 0, 0));
  const [totalStat, setTotalStat] = useState<IStatGameForTable>(createObjForStat(0, 0, 0));

  async function updateStatistics() {
    const userStat = await userStatisticApi.getUserStatistic({
      token: auth.token as string,
      userId: auth.userId as string,
    });
    const { optional } = userStat;
    const statGameVoice = getStatForTable(optional?.gameVoice as IStatisticGame);
    setGameVoice(statGameVoice);
    const statGameSprint = getStatForTable(optional?.gameSprint as IStatisticGame);
    setGameSprint(statGameSprint);
    const statGamesTotal = getTotalStat(
      optional?.gameVoice as IStatisticGame,
      optional?.gameSprint as IStatisticGame
    );
    setTotalStat(statGamesTotal);
  }

  useEffect(() => {
    if (isAuth && auth.token && auth.userId) {
      updateStatistics();
    }
  }, []);

  return (
    <>
      <Header />
      <div className="main">
        <section className="container statistics">
          {isAuth ? (
            <h2 className="title-page">Статистика за день</h2>
          ) : (
            <h2 className="title-page">
              Статистика доступна только для авторизованных пользователей
            </h2>
          )}
          <table className="statistics-table">
            <thead className="thead">
              <tr>
                <th>Игра</th>
                <th>Количество новых слов</th>
                <th>Правильных ответов(%)</th>
                <th>Самая длинная серия</th>
              </tr>
            </thead>
            <tbody className="tbody">
              <tr>
                <th>Аудиовызов</th>
                <StatisticsItems game={gameVoice} />
              </tr>
              <tr>
                <th>Спринт</th>
                <StatisticsItems game={gameSprint} />
              </tr>
              <tr>
                <th>Всего</th>
                <StatisticsItems game={totalStat} />
              </tr>
            </tbody>
          </table>
        </section>
      </div>
      <Footer />
    </>
  );
}
