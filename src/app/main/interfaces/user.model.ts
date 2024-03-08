export interface IUser {
[x: string]: any;
  username: string;
  lastname: string;
  firstname: string;
  email: string;
  image?: string;
  about?: string;
  isDarkMode: boolean;
}

export interface IFetchUser extends IUser{
  id?: string;
  followers: Array<string>;
  following: Array<string>;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}


export interface LoginForm {
  email: string;
  password: string;
}

export interface SignUpForm extends LoginForm {
  confirmPassword: string;
}