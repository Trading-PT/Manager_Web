import { getXsrfToken, updateXsrfTokenFromResponse } from '../utils/xsrfToken';
import { getIsMockMode } from '../contexts/MockDataContext';
import * as mockData from './mockData';

// 공통 API 호출 함수 

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

    // 요청 시작 시점 로그
    console.groupCollapsed(`[API CALL] ${endpoint}`);
    console.log('➡️ Request URL:', `${BASE_URL}${endpoint}`);
    console.log('➡️ Request Method:', options.method || 'GET');
    console.log('➡️ XSRF Token (before request):', xsrfToken || '(none)');
    console.log('➡️ Request Headers (before merge):', options.headers);
    console.log('➡️ Request Body:', options.body);
    console.groupEnd();

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
        ...options.headers,
      },
    });

    // 응답 직후 토큰 갱신 확인
    updateXsrfTokenFromResponse(response);

    // 응답 상태 코드 및 헤더 확인
    console.groupCollapsed(`[API RESPONSE] ${endpoint}`);
    console.log('⬅️ Response Status:', response.status);
    console.log('⬅️ Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('⬅️ XSRF Token (after response):', getXsrfToken());
    console.groupEnd();

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ API Error:', errorData);
      return { success: false, error: errorData.message || `HTTP ${response.status}` };
    }

    const data = await response.json();

    console.log('✅ API Success Data:', data);

    return {
      success: true,
      data: data.result || data.data || data,
    };
  } catch (error) {
    console.error('🚨 API Exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export { getIsMockMode, mockData };
