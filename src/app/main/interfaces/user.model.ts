export interface IUser {
  username: string;
  email: string;
  image?: string;
  about?: string;
  isDarkMode: boolean;
}


export interface LoginForm {
  email: string;
  password: string;
}

export interface SignUpForm extends LoginForm {
  confirmPassword: string;
}