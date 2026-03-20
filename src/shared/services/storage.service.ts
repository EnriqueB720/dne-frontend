import { Constants } from '@constants';

import { Language } from '@generated';

enum StorageName {
  LANGUAGE = '@language',
  JWT_TOKEN = '@token'
}

class StorageService {
  async clear() {
    return localStorage.clear();
  }

  async getLanguage(): Promise<Language> {
    try {
      const value = await localStorage.getItem(StorageName.LANGUAGE) as Language;

      return value;

    } catch(error) {
      return Constants.DEFAULT_LANGUAGE;
    }
  }

  async setLanguage(value: Language) {
    return localStorage.setItem(StorageName.LANGUAGE, value);
  }
  
  async setJwtToken(token: string){
    return localStorage.setItem(StorageName.JWT_TOKEN, token);
  }

  async getJwtToken(){
    try {
      const token = await localStorage.getItem(StorageName.JWT_TOKEN) as string;

      return token;

    } catch(error) {
      return "Not JWT token created";
    }
  }

  async removeJwtToken(){
    return localStorage.removeItem(StorageName.JWT_TOKEN);
  }
    
}

const instance = new StorageService();

export default instance;