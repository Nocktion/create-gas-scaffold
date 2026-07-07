import { Response } from './types';

export function createJSONResponse(input: Response<unknown>) {
  return ContentService.createTextOutput(JSON.stringify(input)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

export function createTextResponse(input: string) {
  return ContentService.createTextOutput(input).setMimeType(ContentService.MimeType.TEXT);
}

export function serveClientPage(page: string, title: string) {
  return HtmlService.createHtmlOutputFromFile(page)
    .setTitle(title)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
