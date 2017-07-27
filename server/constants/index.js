module.exports = {
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'User not found in the database'
  },
  PASSWORD_NOT_MATCHED: {
    code: 'PASSWORD_NOT_MATCHED',
    message: 'Password didn\'t match with the given username'
  },
  ACCESS_TOKEN_NOT_FOUND: {
    code: 'ACCESS_TOKEN_NOT_FOUND',
    message: 'Access token not found'
  },
  ACCESS_TOKEN_INVALID: {
    code: 'ACCESS_TOKEN_INVALID',
    message: 'Invalid access token sent'
  },
  CONTACT_NUMBER_VERIFICATION: 'contactNumberVerification',
  ACCOUNT_AUTHENTICATION: 'accountAuthentication',
  CONTACT_ALREADY_REGISTERED: {
    code: 'CONTACT_ALREADY_REGISTERED',
    message: 'Already registered! Please try with a different number'
  },
  OTP_MISMATCH: {
    code: 'OTP_MISMATCH',
    message: 'OTP sent did not match with the server copy!'
  },
  INVALID_OTP: {
    code: 'INVALID_OTP',
    message: 'OTP is either expired or  invalid one. Please request for a new OTP before proceeding further'
  }
};

