export interface ICredentials {
  email: string;
  password: string;
}

interface IAuthCredentials {
  credentials: ICredentials;
}

export class AuthCredentials implements IAuthCredentials {
  private email: string;
  private password: string;

  constructor({ email, password }: ICredentials) {
    this.email = email;
    this.password = password;
  }

  get credentials(): ICredentials {
    return { email: this.email, password: this.password };
  }
}