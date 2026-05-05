import { Language } from '@generated';

export * from './global-state.constant';
export * from './solvo-theme';
export * from './solvo-mocks';

const DEFAULT_LANGUAGE: Language = Language.Spanish;
const PARAM: string = '';

const Constants = {
  DEFAULT_LANGUAGE,
  PARAM
}

export {
  Constants
};