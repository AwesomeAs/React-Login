export type CommonResponse = {
  status: string;
}

export type SignupRequest = {
  username: string;
  password: string;
  email: string;
}

export type LoginRequest = {
  username: string;
  password: string;
}

export type UserInfo = {
  user_id: number;
  username: string;
  email: string;
  roles: string[];
}

export type LoginResponse = {
  token: string;
  user: UserInfo;
}

export type UserActiveRequest = {
  user_id: number;
  active: boolean;
}

export type UserActiveResponse = {
  updated: boolean;
}