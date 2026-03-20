class AuthError extends Error {
  constructor(name: string = 'AuthError', message: string = 'Auth Error') {
    super();

    this.name = name;
    this.message = message;
  }
}

export default AuthError;