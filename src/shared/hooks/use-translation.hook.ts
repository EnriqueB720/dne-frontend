import { useCallback } from 'react';

import _ from 'lodash';

import { useGlobalState }  from '.';

import LanguageDictionary from '../languages';

import { DictionaryService, StorageService } from '@services';

import { GlobalState } from '@constants';

import { Translator } from '@types';

import { Language } from '@generated';

const useTranslation = () => {
  const [language, setLanguage] = useGlobalState(GlobalState.LANGUAGE);

  const t: Translator = useCallback((path) => {
    return _.get(LanguageDictionary[DictionaryService.parseLanguageToDictionaryField(language)], path);
  }, [language]);

  const switchLanguage = useCallback(async (selectedLanguage: Language, isReloadRequired: boolean = false) => {
    await StorageService.setLanguage(selectedLanguage);
    setLanguage(selectedLanguage);

    if (isReloadRequired) window?.location?.reload();
  }, [language]);

  return { language, setLanguage, switchLanguage, t };
}

export default useTranslation;