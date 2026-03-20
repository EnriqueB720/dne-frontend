import { AuthError } from '../errors/index';
import { StorageService } from '@services';

export class AuthService {

  public async logout(): Promise<void> {
    try {
      await StorageService.removeJwtToken();
    } catch (error) {
      throw new AuthError();
    }
  }

}

const instance = new AuthService();

export default instance;