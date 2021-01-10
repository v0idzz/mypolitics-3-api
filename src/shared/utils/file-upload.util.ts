import { FileUpload } from 'graphql-upload';
import { join } from 'lodash';

export const createUniqueFilename = (file: FileUpload): string => {
  const timestamp = new Date().getTime();
  const encodedFileName = encodeURI(file.filename);
  return join([timestamp, encodedFileName], '-');
};
