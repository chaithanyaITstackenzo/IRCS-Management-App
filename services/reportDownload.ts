import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { AxiosResponse } from 'axios';
import { ReportRequestResult } from '@/types/report';

/**
 * Reusable, format-agnostic report handler (spec §35).
 * Inspects the real Content-Type header instead of assuming PDF/CSV/Excel/JSON,
 * so this stays correct however Thoufiq's report endpoints end up shaped.
 * Works on both Android and iOS via Expo's file + sharing APIs.
 */
export async function handleReportResponse(
  response: AxiosResponse<ArrayBuffer>,
  suggestedFileName: string
): Promise<ReportRequestResult> {
  const contentType = String(response.headers?.['content-type'] ?? 'application/octet-stream');

  const base64 = arrayBufferToBase64(response.data);

  if (contentType.includes('application/json')) {
    const text = decodeURIComponent(escape(atob(base64)));
    return { contentType, json: JSON.parse(text) };
  }

  const extension = extensionForContentType(contentType);
  const fileUri = `${FileSystem.cacheDirectory}${suggestedFileName}.${extension}`;

  await FileSystem.writeAsStringAsync(fileUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return { contentType, localFileUri: fileUri };
}

export async function shareDownloadedReport(fileUri: string) {
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(fileUri);
  }
}

// No node Buffer available in the RN runtime — encode manually so this module
// has no extra native dependency beyond expo-file-system / expo-sharing.
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  // eslint-disable-next-line no-undef
  return typeof btoa !== 'undefined' ? btoa(binary) : globalThis.btoa(binary);
}

function extensionForContentType(contentType: string): string {
  if (contentType.includes('pdf')) return 'pdf';
  if (contentType.includes('csv')) return 'csv';
  if (contentType.includes('spreadsheetml') || contentType.includes('excel')) return 'xlsx';
  return 'bin';
}
