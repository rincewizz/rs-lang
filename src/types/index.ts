export type SidebarItemProps = {
  el: {
    img: string;
    alt: string;
    name: string;
  };
};

export type Advantages = {
  number: string;
  text: string;
};

export type Word = {
  id: string;
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
};

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
  currentGroup: number;
}

export interface IWordCardProps {
  word: Word;
  playStatus: boolean;
  setPlayStatus: (status: boolean) => void;
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
