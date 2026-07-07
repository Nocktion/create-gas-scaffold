import { createJSONResponse, serveClientPage } from './response';

export function doGet() {
  try {
    return serveClientPage('index', 'Example SPA');
  } catch {
    return createJSONResponse({ status: 'internal-error', ok: false, data: null });
  }
}

export function doPost(e: GoogleAppsScript.Events.DoPost) {
  const body = e.postData ? JSON.parse(e.postData.contents) : null;
  return createJSONResponse({ status: 'ok', ok: true, data: body });
}
