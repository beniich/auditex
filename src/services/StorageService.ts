import { apiRequest } from '../lib/api';

export interface StorageUploadResponse {
  url: string;
  key: string;
  filename: string;
  mimeType: string;
  size: number;
}

export class StorageService {
  static async uploadEvidence(file: File, auditId: string): Promise<StorageUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('auditId', auditId);

    // Use apiRequest directly as it handles the BASE_URL and Token
    // We don't use api.post here because it stringifies the body, but for FormData we need raw body
    return apiRequest<StorageUploadResponse>('/storage/upload', {
      method: 'POST',
      body: formData,
      // No headers: let fetch set the correct multipart/form-data with boundary
    });
  }

  static async getEvidenceUrl(key: string): Promise<string> {
    const data = await apiRequest<{ url: string }>(`/storage/url/${key}`);
    return data.url;
  }
}
