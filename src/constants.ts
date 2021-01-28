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
    text: 'Survey has been finished',
  },
  [ErrorCode.SURVEY_NOT_FINISHED]: {
    code: ErrorCode.SURVEY_NOT_FINISHED,
    text: 'Survey has not been finished yet',
  }
};

export const Cookies = {};

export const Headers = {
  RESPONDENT: 'mypolitics-respondent',
  ADMIN: 'mypolitics-admin'
};

export const PubSubIterators = {};

export const Providers = {
  PUB_SUB: 'PUB_SUB',
};
