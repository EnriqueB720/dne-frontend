import { Language } from '@generated';

import { LanguageDictionary } from '@types';

class DictionaryService {

  parseLanguageToDictionaryField(language: Language): keyof LanguageDictionary {
    return ({
      [Language.English]: 'en',
      [Language.Spanish]: 'es',
    })[language] as keyof LanguageDictionary;
  }

}

const instance = new DictionaryService();

export default instance;