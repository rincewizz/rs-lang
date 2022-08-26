export type SidebarItemProps = {
  el: {
    img: string;
    alt: string;
    name: string;
    link: string;
  };
};

export type Advantages = {
  number: string;
  text: string;
};

export interface WordOptional {
  learned?: boolean;
}

export interface UserWordOptions {
  difficulty: string;
  optional?: WordOptional;
}

interface WordBase {
  id?: string;
  _id?: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
  userWord?: UserWordOptions;
}

interface IdWord extends WordBase {
  id: string;
}

interface DashIdWord extends WordBase {
  _id: string;
}

export type Word = IdWord | DashIdWord;

export interface IAggregatedWords {
  paginatedResults: DashIdWord[];
  totalCount: { count: number }[];
}

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
}
export interface IUser {
  id: string;
  name: string;
  email: string;
}
export interface ILoginUser {
  email: string;
  password: string;
}
export interface IAuth {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}
export interface IParamAuth {
  userId: string;
  token: string;
}
export interface IInputProps {
  setValue: (value: string) => void;
  value: string;
  type: string;
  placeholder: string;
}
export interface IpropsCardDev {
  [key: string]: { foto: string; name: string; text: string };
}

export interface IWordGroupProps {
  onClickWordGroup: (group: number) => void;
  onClickDifficultWordGroup: () => void;
  currentGroup: number;
}

export interface IWordCardProps {
  word: Word;
  playStatus: boolean;
  setPlayStatus: (status: boolean) => void;
}

export interface IHeaderProps {
  handleClick: () => void;
}

export interface IUserStore {
  user: Partial<IUser>;
  setUser: (user: Partial<IUser>) => void;
  getUser: () => Partial<IUser>;
}

export interface IAuthStore {
  auth: Partial<IAuth>;
  setAuth: (user: Partial<IAuth>) => void;
  getAuth: () => Partial<IAuth>;
}

export interface IUserWord {
  id: string;
  difficulty: string;
  wordId: string;
  optional?: WordOptional;
}
export type Answer = {
  name: Word;
  answer: boolean;
};
export type Numbers = {
  number: string;
};

export interface IAggregatedWordsParams {
  token: string;
  userId: string;
  group?: number;
  page?: number;
  perPage?: number;
  filter?: string;
}

export interface IAggregatedWordByIdParams {
  token: string;
  userId: string;
  wordId: string;
}
