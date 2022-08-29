/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import { userStatisticApi } from '../services/api/Statistic';
import { usersWordsApi } from '../services/api/UsersWords';
import {
  IAuth,
  IGameResults,
  IStatisticGame,
  IUserWordStaticstic,
  UserWordOptions,
  Word,
} from '../types';

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

export function calcStatistic(res: IGameResults, allRes: boolean[]) {
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

class UserWordRequest {
  request: UserWordOptions;

  constructor(word: Word) {
    this.request = word.userWord ?? { difficulty: 'none' };
    if (!this.request.optional) {
      this.request.optional = UserWordRequest.getNewOptional();
    }
    if (!this.request.optional.gamesStatistic) {
      this.request.optional.gamesStatistic = UserWordRequest.getNewGamesStatistic();
    }
  }

  static getNewOptional() {
    return {
      learned: false,
      gamesStatistic: UserWordRequest.getNewGamesStatistic(),
    };
  }

  static getNewGamesStatistic() {
    return {
      sprint: {
        correct: 0,
        incorrect: 0,
      },
      voice: {
        correct: 0,
        incorrect: 0,
      },
    };
  }

  set difficulty(val: string) {
    this.request.difficulty = val;
  }

  set learned(val: boolean) {
    if (this.request.optional) this.request.optional.learned = val;
  }

  set new(val: boolean) {
    if (this.request.optional) this.request.optional.new = val;
  }

  private setGamesStatistic(game: 'sprint' | 'voice', val: IUserWordStaticstic) {
    if (this.request?.optional?.gamesStatistic) {
      this.request.optional.gamesStatistic[game].correct += val.correct;
      this.request.optional.gamesStatistic[game].incorrect += val.incorrect;
    }
  }

  set sprintGameStatistic(val: IUserWordStaticstic) {
    this.setGamesStatistic('sprint', val);
  }

  set voiceGameStatistic(val: IUserWordStaticstic) {
    this.setGamesStatistic('voice', val);
  }
}
export async function recordWordsStatics(
  auth: Partial<IAuth>,
  game: 'sprint' | 'voice',
  gameResults: IGameResults
) {
  if (!auth.token || !auth.userId) return;
  for await (const [word, answer] of gameResults.entries()) {
    if (!word._id) return;
    const userWordRequest = new UserWordRequest(word);
    userWordRequest[`${game}GameStatistic`] = answer;
    const apiParam = {
      token: auth.token,
      userId: auth.userId,
      wordId: word._id,
      request: userWordRequest.request,
    };
    if (word.userWord) await usersWordsApi.updateUserWord(apiParam);
    else await usersWordsApi.createUserWord(apiParam);
  }
}
