
import { Dictionary } from '@types';

export const EnglishDictionary: Dictionary = {
  global: {
    language: {
      en: 'English',
      es: 'Spanish',
    },
    languagePrefix: {
      en: 'EN',
      es: 'ES',
    },
    error: {
      required: 'Required',
      tooShort: 'More characters needed',
      tooLong: 'Less characters needed',
      invalidString: 'A text value is required',
      invalidNumber: 'A numeric value is required',
      invalidEmail: 'Email provided is not valid',
      invalidPassword: 'Password provided is not valid',
      invalidConfirmPassword: 'The passwords are not the same',
      specialCharacterRequired:
        'Special character required, like: (!, #, $, %, &, *)',
      numericDigitRequired:
        'Digit character required, like: (0, 1, 2, 3, 4, 5, 7, 8, 9)',
      lowerCaseRequired: 'Lower case needed',
      upperCaseRequired: 'Upper case needed',
      notSpacesAndSpecialCharacters:
        'Not white spaces and special character supported',
      defaultError: {
        title: 'Error',
        message: 'An error has occurred',
        button: 'Try again',
      },
      emailExistsException: {
        title: 'That email is already taken',
        message: 'Email already taken',
        button: 'Try again',
      },
      usernameExistsException: {
        title: 'That username is already taken',
        message: 'Username already taken',
        button: 'Try again',
      },
      notAuthorizedException: {
        title: 'Invalid Credentials',
        message: 'The email or password you provided is incorrect',
        button: 'Try again',
      },
    },
  },
  register: {
    title: 'Create account',
    form: {
      submit: 'Get started',
      email: 'Email',
      username: 'Username',
      password: 'Password',
      walletAddress: 'Wallet address',
      repeatPassword: 'Repeat password',
    },
    alreadyAnAccount: 'Already an account? Sign in!',
  },
  forgotPassword: {
    title: 'Reset password',
    form: {
      email: 'Email',
      submit: 'Reset password',
      verificationCode: 'Verification code',
      newPassword: 'New password',
      repeatNewPassword: 'Repeat new password',
    },
  },
  login: {
    title: 'Log in',
    form: {
      submit: 'Log in',
      email: 'Email',
      password: 'Password',
    },
    forgotPassword: 'Forgot password?',
    verifyAccount: {
      title: 'Verify Account',
      description: 'Please check your email and validate your account',
      form: {
        verificationCode: 'Verification code',
        submit: 'Verify Account',
        sendNewCode: 'Send me a new code!',
      },
    },
    noAccount: 'Sign Up',
  },
  watchRegistry: {
    title: 'Register a Watch',
    serialNumber: 'Serial Number',
    username: 'Username',
    form: {
      register: 'Register Watch',
      cancel: 'Cancel',
    },
  },
  transferWatch: {
    selectAWatch: 'Select a Watch',
    serialNumber: 'Serial Number',
    newOwnerAccount: 'New Owner Account',
    form: {
      transfer: 'Transfer Watch',
      cancel: 'Cancel',
    },
    confirmTransferAction: {
      title: 'Confirm Transfer',
      description:
        'Are you sure you want to transfer this watch to the new owner?',
      accept: 'Yes, transfer',
      cancel: 'Cancel',
    },
  },
  ownershipHistory: {
    title: 'Ownership History',
    walletAddress: 'Wallet Address',
  },
  seeAWatch: {
    serialNumber: 'Serial Number',
    currentOwner: 'Current Owner',
    checkInfoOnBlockchain: 'Check Info on Blockchain',
    ownershipOfAWatch: 'Ownership of a Watch',
  },
  frontPage: {
    title: 'Welcome to the Watch Registry',
    description:
      'Register, transfer, and verify the ownership of watches on the blockchain.',
  },
  checkAWatchOwnership: {
    title: 'Check Watch Ownership',
    description: 'Enter the serial number to check ownership details',
    serialNumber: 'Serial Number',
    check: 'Check Ownership',
    result: {
      walletOwner: 'Wallet Owner',
      username: 'Username',
      ownerSince: 'Owner Since',
    },
  },
  email: {
  },
  registerAWatchButton: 'Register a Watch',
  transferAWatchButton: 'Transfer a Watch',
  AppCreatorProfile: {
    link: "Link to creator's profile",
    referAs: 'Creator of the app',
  },
  logoutMessage: 'Log out',
  connectWallet: 'Connect Wallet',
};

export default EnglishDictionary