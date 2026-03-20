import { Dictionary } from '@types';


export const SpanishDictionary: Dictionary = {
  global: {
    language: {
      en: 'Inglés',
      es: 'Español',
    },
    languagePrefix: {
      en: 'EN',
      es: 'ES',
    },
    error: {
      required: 'Requerido',
      tooShort: 'Se necesitan más caracteres',
      tooLong: 'Se necesitan menos caracteres',
      invalidString: 'Se requiere un valor de texto',
      invalidNumber: 'Se requiere un valor numérico',
      invalidEmail: 'El correo electrónico no es válido',
      invalidPassword: 'La contraseña no es válida',
      invalidConfirmPassword: 'Las contraseñas no coinciden',
      specialCharacterRequired:
        'Se requiere un carácter especial, por ejemplo: (!, #, $, %, &, *)',
      numericDigitRequired:
        'Se requiere un número, por ejemplo: (0, 1, 2, 3, 4, 5, 7, 8, 9)',
      lowerCaseRequired: 'Se requiere una letra minúscula',
      upperCaseRequired: 'Se requiere una letra mayúscula',
      notSpacesAndSpecialCharacters:
        'No se permiten espacios en blanco ni caracteres especiales',
      defaultError: {
        title: 'Error',
        message: 'Ha ocurrido un error',
        button: 'Intentar de nuevo',
      },
      emailExistsException: {
        title: 'Ese correo electrónico ya está en uso',
        message: 'Correo electrónico ya registrado',
        button: 'Intentar de nuevo',
      },
      usernameExistsException: {
        title: 'Ese nombre de usuario ya está en uso',
        message: 'Nombre de usuario ya registrado',
        button: 'Intentar de nuevo',
      },
      notAuthorizedException: {
        title: 'Credenciales inválidas',
        message: 'El correo electrónico o la contraseña no son correctos',
        button: 'Intentar de nuevo',
      },
    },
  },
  register: {
    title: 'Crear cuenta',
    form: {
      submit: 'Comenzar',
      email: 'Correo electrónico',
      username: 'Nombre de usuario',
      password: 'Contraseña',
      walletAddress: 'Dirección de la billetera',
      repeatPassword: 'Repetir contraseña',
    },
    alreadyAnAccount: '¿Ya tienes una cuenta? ¡Inicia sesión!',
  },
  forgotPassword: {
    title: 'Restablecer contraseña',
    form: {
      email: 'Correo electrónico',
      submit: 'Restablecer contraseña',
      verificationCode: 'Código de verificación',
      newPassword: 'Nueva contraseña',
      repeatNewPassword: 'Repetir nueva contraseña',
    },
  },
  login: {
    title: 'Iniciar sesión',
    form: {
      submit: 'Entrar',
      email: 'Correo electrónico',
      password: 'Contraseña',
    },
    forgotPassword: '¿Olvidaste tu contraseña?',
    verifyAccount: {
      title: 'Verificar cuenta',
      description: 'Revisa tu correo electrónico y valida tu cuenta',
      form: {
        verificationCode: 'Código de verificación',
        submit: 'Verificar cuenta',
        sendNewCode: '¡Envíame un nuevo código!',
      },
    },
    noAccount: 'Regístrate',
  },
  watchRegistry: {
    title: 'Registrar un reloj',
    serialNumber: 'Número de serie',
    username: 'Nombre de usuario',
    form: {
      register: 'Registrar reloj',
      cancel: 'Cancelar',
    },
  },
  transferWatch: {
    selectAWatch: 'Selecciona un reloj',
    serialNumber: 'Número de serie',
    newOwnerAccount: 'Cuenta del nuevo propietario',
    form: {
      transfer: 'Transferir reloj',
      cancel: 'Cancelar',
    },
    confirmTransferAction: {
      title: 'Confirmar transferencia',
      description:
        '¿Estás seguro de que deseas transferir este reloj al nuevo propietario?',
      accept: 'Sí, transferir',
      cancel: 'Cancelar',
    },
  },
  ownershipHistory: {
    title: 'Historial de propiedad',
    walletAddress: 'Dirección de la billetera',
  },
  seeAWatch: {
    serialNumber: 'Número de serie',
    currentOwner: 'Propietario actual',
    checkInfoOnBlockchain: 'Ver información en blockchain',
    ownershipOfAWatch: 'Propiedad de un reloj',
  },
  frontPage: {
    title: 'Bienvenido al Registro de Relojes',
    description:
      'Registra, transfiere y verifica la propiedad de relojes en la blockchain.',
  },
  checkAWatchOwnership: {
    title: 'Verificar propiedad de un reloj',
    description:
      'Ingresa el número de serie para comprobar los detalles de propiedad',
    serialNumber: 'Número de serie',
    check: 'Verificar propiedad',
    result: {
      walletOwner: 'Propietario de la billetera',
      username: 'Nombre de usuario',
      ownerSince: 'Propietario desde',
    },
  },
  email: {
  },
  registerAWatchButton: 'Registrar un reloj',
  transferAWatchButton: 'Transferir un reloj',
  AppCreatorProfile: {
    link: 'Enlace al perfil del creador',
    referAs: 'Creador de la aplicación',
  },
  logoutMessage: 'Cerrar sesión',
  connectWallet: 'Conectar billetera',
};

export default SpanishDictionary