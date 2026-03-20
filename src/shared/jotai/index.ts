import { atom } from 'jotai';
import { Constants } from '@constants';
import { LanguageState, UserState } from '@types';

export const languageState = atom<LanguageState>(Constants.DEFAULT_LANGUAGE);
export const userState = atom<UserState | undefined>(undefined);