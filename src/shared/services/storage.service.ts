enum StorageName {
  JWT_TOKEN = '@token'
}

class StorageService {
  async clear() {
    return localStorage.clear();
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