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
