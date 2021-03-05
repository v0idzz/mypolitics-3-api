export const enum ErrorCode {
  NOT_FOUND,
  NOT_AUTHORIZED,
  RESPONDENT_HEADER_NOT_PROVIDED,
  SURVEY_FINISHED,
  SURVEY_NOT_FINISHED,
  QUIZ_VERSION_PUBLISHED,
  WRONG_CREDENTIALS,
  USER_EXISTS,
  EMAIL_NOT_VERIFIED,
  USER_NOT_EXISTS,
}

export interface ErrorMessage {
  text: string;
  code: ErrorCode;
}
