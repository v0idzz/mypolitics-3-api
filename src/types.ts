export const enum ErrorCode {
  NOT_FOUND,
  NOT_AUTHORIZED,
  RESPONDENT_HEADER_NOT_PROVIDED,
  SURVEY_FINISHED,
}

export interface ErrorMessage {
  text: string;
  code: ErrorCode;
}
