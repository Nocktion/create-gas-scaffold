import { createJSONResponse } from './response';

export function doGet() {
  return createJSONResponse({ status: 'ok', ok: true, data: { message: 'Hello from doGet' } });
}

export function doPost(e: GoogleAppsScript.Events.DoPost) {
  const body = e.postData ? JSON.parse(e.postData.contents) : null;

  return createJSONResponse({ status: 'ok', ok: true, data: body });
}
