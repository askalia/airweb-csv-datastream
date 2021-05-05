import { FormatsAllowed } from '../formats-allowed.model';

export function validateFileFormat(formatType: string | string[]): boolean {
  const lookupFormats = Object.values(FormatsAllowed).map(String);
  const clientFormat = Array.isArray(formatType) ? formatType : [formatType];
  return clientFormat.some((cf) => lookupFormats.includes(cf));
}

export function isFileOutputExpected(httpAcceptHeader: string) {
  const fileFormat = getFileFormatFromHttpHeader(httpAcceptHeader);
  return validateFileFormat(fileFormat);
}

export function getFileFormatFromHttpHeader(
  httpAcceptHeader: string,
): FormatsAllowed {
  const lookupFormats = Object.values(FormatsAllowed).map(String);
  const clientAsksFormat = (httpAcceptHeader || '')
    .split(',')
    .map((cf) => cf.trim());
  for (const cf of clientAsksFormat) {
    if (lookupFormats.includes(cf)) {
      return cf as FormatsAllowed;
    }
  }
}

export default {
  validateFileFormat,
  getFileFormatFromHttpHeader,
  isFileOutputExpected
};
