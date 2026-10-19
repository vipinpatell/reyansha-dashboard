import { apiRequest, unwrapData } from './client';

export async function getHealth(): Promise<unknown> {
  return unwrapData(await apiRequest('/health'));
}
