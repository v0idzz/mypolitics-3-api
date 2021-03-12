import { ErrorCode, ErrorMessage } from './types';

export const ErrorsMessages: Record<ErrorCode, ErrorMessage> = {
  [ErrorCode.NOT_FOUND]: {
    code: ErrorCode.NOT_FOUND,
    text: 'Resource not found',
  },
  [ErrorCode.RESPONDENT_HEADER_NOT_PROVIDED]: {
    code: ErrorCode.RESPONDENT_HEADER_NOT_PROVIDED,
    text: 'Respondent header not provided',
  },
  [ErrorCode.NOT_AUTHORIZED]: {
    code: ErrorCode.NOT_AUTHORIZED,
    text: 'Not authorized',
  },
  [ErrorCode.SURVEY_FINISHED]: {
    code: ErrorCode.SURVEY_FINISHED,
    text: 'User has been finished',
  },
  [ErrorCode.SURVEY_NOT_FINISHED]: {
    code: ErrorCode.SURVEY_NOT_FINISHED,
    text: 'Survey has not been finished yet',
  },
  [ErrorCode.QUIZ_VERSION_PUBLISHED]: {
    code: ErrorCode.QUIZ_VERSION_PUBLISHED,
    text: 'Quiz version has been published',
  },
  [ErrorCode.WRONG_CREDENTIALS]: {
    code: ErrorCode.WRONG_CREDENTIALS,
    text: 'Wrong credentials',
  },
  [ErrorCode.USER_EXISTS]: {
    code: ErrorCode.USER_EXISTS,
    text: 'User exists',
  },
  [ErrorCode.EMAIL_NOT_VERIFIED_SENT_IN_15_MIN]: {
    code: ErrorCode.EMAIL_NOT_VERIFIED_SENT_IN_15_MIN,
    text: 'Email not verified. Mail sent in last 15 minutes',
  },
  [ErrorCode.USER_NOT_EXISTS]: {
    code: ErrorCode.USER_NOT_EXISTS,
    text: 'User not exists',
  },
  [ErrorCode.USER_ALREADY_VOTED]: {
    code: ErrorCode.USER_ALREADY_VOTED,
    text: 'User already voted',
  },
  [ErrorCode.EMAIL_NOT_VERIFIED_SENT_NOW]: {
    code: ErrorCode.EMAIL_NOT_VERIFIED_SENT_NOW,
    text: 'Email not verified. Mail sent now',
  },
};

export const Cookies = {
  RESPONDENT: 'mypolitics-respondent',
  JWT: 'mypolitics-jwt',
};

export const Headers = {
  RESPONDENT: 'mypolitics-respondent',
  ADMIN: 'mypolitics-admin'
};

export const PubSubIterators = {};

export const Providers = {
  PUB_SUB: 'PUB_SUB',
};
