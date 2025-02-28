import { ToolsNameList } from 'move-agent-kit-fullstack';

export interface IAuth {
  message: string;
  address: string;
  publicKey: string;
  signature: unknown;
}

export interface IJwt {
  authToken: string;
}

export interface IUserAuth {
  auth: string;
  address: string;
}

export interface IJWTUser {
  account: string;
  token: string;
}

export interface IActionFunction {
  name: ToolsNameList;
  arguments: string;
}
