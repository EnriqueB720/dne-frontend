import { Leaves } from './paths.type';

import { Language } from '@generated';
//TODO define the correct types for the different titles or text the app mya or may not contain
interface AppCreatorProfile {
  link: string;
  referAs: string;
}

interface Form {
  submit: string
}
interface ProfileForm extends Form {
  email: string;
  username: string;
  password: string;
  walletAddress: string;
}

interface RegisterForm extends ProfileForm {
  repeatPassword: string;
}

export type Translator = (path: DictionaryLeaves) => string;

export interface LanguageOption {
  label: DictionaryLeaves;
  value: Language;
}

export interface Dictionary {
  global: {
    language: {
      en: string;
      es: string;
    },
    languagePrefix: {
      en: string;
      es: string;
    };
    error: {
      required: string;
      tooShort: string;
      tooLong: string;
      invalidString: string;
      invalidNumber: string;
      invalidEmail: string;
      invalidPassword: string;
      invalidConfirmPassword: string;
      specialCharacterRequired: string;
      numericDigitRequired: string;
      lowerCaseRequired: string;
      upperCaseRequired: string;
      notSpacesAndSpecialCharacters: string;
      defaultError: {
        title: string;
        message: string;
        button: string;
      };
      emailExistsException: {
        title: string;
        message: string;
        button: string;
      };
      usernameExistsException: {
        title: string;
        message: string;
        button: string;
      };
      notAuthorizedException: {
        title: string;
        message: string;
        button: string;
      };
    }
  };
  register: {
    title: string;
    form: RegisterForm;
    alreadyAnAccount: string;
  };
  forgotPassword: {
    title: string;
    form: {
      email: string;
      submit: string;
      verificationCode: string;
      newPassword: string;
      repeatNewPassword: string;
    };
  };
  login: {
    title: string;
    form: {
      submit: string;
      email: string;
      password: string;
    };
    forgotPassword: string;
    verifyAccount: {
      title: string;
      description: string;
      form: {
        verificationCode: string;
        submit: string;
        sendNewCode: string;
      };
    };
    noAccount: string;
  };
  watchRegistry:{
    title: string;
    serialNumber: string;
    username: string;
    form:{
      register: string;
      cancel: string;
    }
  };
  transferWatch:{
    selectAWatch: string;
    serialNumber: string;
    newOwnerAccount: string;
    form:{
      transfer: string;
      cancel: string;
    }
    confirmTransferAction:{
      title: string;
      description: string;
      accept: string;
      cancel: string;
    }
  };
  ownershipHistory: {
    title: string;
    walletAddress: string;
  };
  seeAWatch:{
    serialNumber: string;
    currentOwner: string;
    checkInfoOnBlockchain: string;
    ownershipOfAWatch: string;
  };
  frontPage:{
    title: string;
    description: string;
  };
  checkAWatchOwnership:{
    title: string;
    description: string;
    serialNumber: string;
    check: string;
    result:{
      walletOwner: string;
      username: string;
      ownerSince: string;
    }
  };
  email:{
  };
  registerAWatchButton: string;
  transferAWatchButton: string;
  AppCreatorProfile: AppCreatorProfile;
  logoutMessage: string;
  connectWallet: string;
};


export type LanguageDictionary = {
  en: string,
  es: string;
}

export type DictionaryLeaves = Leaves<Dictionary, 4>;