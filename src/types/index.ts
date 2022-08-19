export type SidebarItemProps = {
  el: {
    img: string;
    alt: string;
    name: string;
    width?: string;
  };
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
  message: 'string';
  token: 'string';
  refreshToken: 'string';
  userId: 'string';
  name: 'string';
}
export interface IParamAuth {
  userId: 'string';
  token: 'string';
}
