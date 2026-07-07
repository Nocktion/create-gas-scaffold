import { Response } from './types';

export function createJSONResponse(input: Response<unknown>) {
  return ContentService.createTextOutput(JSON.stringify(input)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

export function createTextResponse(input: string) {
  return ContentService.createTextOutput(input).setMimeType(ContentService.MimeType.TEXT);
}
