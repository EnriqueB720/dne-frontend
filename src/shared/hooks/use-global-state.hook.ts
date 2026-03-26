import { useAtom } from 'jotai';
import { languageState, userState } from '../jotai/index';
import { GlobalState } from '@constants';

const AtomDictionary = {
  [GlobalState.LANGUAGE]: languageState,
  [GlobalState.USER]: userState,
};

export const useGlobalState = (key: GlobalState) => {
  return useAtom(AtomDictionary[key]) as any;
};