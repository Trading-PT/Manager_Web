import { getXsrfToken, updateXsrfTokenFromResponse } from '../utils/xsrfToken';
import { getIsMockMode } from '../contexts/MockDataContext';
import * as mockData from './mockData';

export const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URI;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const xsrfToken = getXsrfToken();

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
        ...options.headers,
      },
    });

    updateXsrfTokenFromResponse(response);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || `HTTP ${response.status}` };
    }

    const data = await response.json();
    return { success: true, data: data.data || data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export { getIsMockMode, mockData };
