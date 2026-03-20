import EnglishDictionary from './en.language';
import SpanishDictionary from './es.language';

import { Dictionary, LanguageDictionary as LanguageDictionaryObject } from '../types';

const LanguageDictionary: Record<keyof LanguageDictionaryObject, Dictionary> = {
  en: EnglishDictionary,
  es: SpanishDictionary
}

export default LanguageDictionary;