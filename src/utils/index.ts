import { userStatisticApi } from '../services/api/Statistic';
import { IStatisticGame } from '../types';

export function getLengthCorrect(answers: boolean[]) {
  const chain = [];
  let count = 0;
  answers.forEach((el) => {
    if (el === true) {
      count += 1;
    } else {
      chain.push(count);
      count = 0;
    }
  });
  chain.push(count);
  return Math.max(...chain);
}

export function calcStatistic(res: number, allRes: boolean[]) {
  const countCorrect = allRes.filter((el) => el === true).length;
  const countNewWords = res;
  const totalWords = allRes.length;
  const lengthCorrect = getLengthCorrect(allRes);
  const today = new Date();
  const date = today.toLocaleDateString('en-US');
  const gameSprintStat: IStatisticGame = {
    date,
    countNewWords,
    countCorrect,
    totalWords,
    lengthCorrect,
  };
  return gameSprintStat;
}

export async function updateStaticGame(
  token: string,
  userId: string,
  calcInfo: IStatisticGame,
  nameGame: 'Sprint' | 'Voice'
) {
  let { countNewWords, lengthCorrect, countCorrect, totalWords } = calcInfo;
  const { date } = calcInfo;

  const oldStat = await userStatisticApi.getUserStatistic({
    token,
    userId,
  });

  const { optional, learnedWords } = oldStat;
  const game = nameGame === 'Sprint' ? optional?.gameSprint : optional?.gameVoice;
  let newOptional = {
    ...optional,
    [`game${nameGame}`]: calcInfo,
  };

  if (game?.date === date) {
    countNewWords = game.countNewWords + countNewWords;
    lengthCorrect = lengthCorrect > game.lengthCorrect ? lengthCorrect : game.lengthCorrect;
    countCorrect = game.countCorrect + countCorrect;
    totalWords = game.totalWords + totalWords;

    newOptional = {
      ...optional,
      [`game${nameGame}`]: { date, countNewWords, lengthCorrect, countCorrect, totalWords },
    };
  }
  const request = { learnedWords, optional: newOptional };
  await userStatisticApi.updateUserStatistic({
    token,
    userId,
    request,
  });
}
