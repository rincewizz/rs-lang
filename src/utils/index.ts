import { userStatisticApi } from '../services/api/Statistic';
import { IStatisticGame, Word } from '../types';

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

export function calcStatistic(res: Map<Word, boolean>, allRes: boolean[]) {
  const countCorrect = allRes.filter((el) => el === true).length;
  const countNewWords = res.size;
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

export async function updateStaticGame(token: string, userId: string, calcInfo: IStatisticGame) {
  let { countNewWords, lengthCorrect, countCorrect, totalWords } = calcInfo;
  const { date } = calcInfo;

  const oldStat = await userStatisticApi.getUserStatistic({
    token,
    userId,
  });

  const { optional, learnedWords } = oldStat;
  const gameSprint = optional?.gameSprint;
  let newOptional = {
    ...optional,
    gameSprint: calcInfo,
  };

  if (gameSprint?.date === date) {
    countNewWords = gameSprint.countNewWords + countNewWords;
    lengthCorrect =
      lengthCorrect > gameSprint.lengthCorrect ? lengthCorrect : gameSprint.lengthCorrect;
    countCorrect = gameSprint.countCorrect + countCorrect;
    totalWords = gameSprint.totalWords + totalWords;
    newOptional = {
      ...optional,
      gameSprint: { date, countNewWords, lengthCorrect, countCorrect, totalWords },
    };
  }
  const request = { learnedWords, optional: newOptional };
  await userStatisticApi.updateUserStatistic({
    token,
    userId,
    request,
  });
}
