import { createJSONResponse, serveClientPage } from './response';

export function doGet(e: GoogleAppsScript.Events.DoGet) {
  try {
    const page = e.parameter.page ?? 'example';
    return serveClientPage(page, 'Example');
  } catch {
    return createJSONResponse({ status: 'internal-error', ok: false, data: null });
  }
}

export function doPost(e: GoogleAppsScript.Events.DoPost) {
  const body = e.postData ? JSON.parse(e.postData.contents) : null;
  return createJSONResponse({ status: 'ok', ok: true, data: body });
}
