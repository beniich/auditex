import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiKeyService } from './ApiService';
import { api } from '../lib/api';

vi.mock('../lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn()
  }
}));

describe('ApiKeyService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch api keys', async () => {
    const mockKeys = [{ id: '1', name: 'Test' }];
    (api.get as any).mockResolvedValue(mockKeys);

    const result = await ApiKeyService.getApiKeys();
    
    expect(api.get).toHaveBeenCalledWith('/api-keys');
    expect(result).toEqual(mockKeys);
  });

  it('should create an api key', async () => {
    const mockKey = { id: '2', name: 'New Key' };
    (api.post as any).mockResolvedValue(mockKey);

    const result = await ApiKeyService.createApiKey('New Key', 'READ_ONLY');
    
    expect(api.post).toHaveBeenCalledWith('/api-keys', { name: 'New Key', scope: 'READ_ONLY' });
    expect(result).toEqual(mockKey);
  });
});
