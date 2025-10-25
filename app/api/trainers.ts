import { apiCall, BASE_URL, getIsMockMode, mockData } from './base';
import type { ApiResponse } from './base';
import { getXsrfToken, updateXsrfTokenFromResponse } from '../utils/xsrfToken';

// Types
export interface TrainerRequestData {
  name: string;
  phone: string;
  username: string;
  password: string;
  passwordCheck: string;
  onelineIntroduction?: string;
  grantRole: 'ROLE_ADMIN' | 'ROLE_TRAINER';
}

export interface TrainerListItem {
  trainerId: number;
  profileImageUrl?: string;
  name: string;
  phone: string;
  onelineIntroduction?: string;
  username: string;
  role: string;
}

export interface AssignedCustomer {
  customerId: number;
  name: string;
}

// 트레이너 목록 조회
export async function getTrainers(): Promise<ApiResponse<TrainerListItem[]>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true, data: mockData.mockTrainers || [] }), 300)
    );
  }

  return apiCall<TrainerListItem[]>('/api/v1/admin/trainers', { method: 'GET' });
}

// 트레이너 등록
export async function createTrainer(
  data: TrainerRequestData,
  profileImage?: File
): Promise<ApiResponse<{ trainerId: number }>> {
  try {
    const xsrfToken = getXsrfToken();
    const formData = new FormData();

    // JSON 데이터를 Blob으로 변환하여 추가
    const requestBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('request', requestBlob);

    // 프로필 이미지 추가 (선택사항)
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    console.groupCollapsed('[API CALL] /api/v1/admin/trainers (POST)');
    console.log('➡️ Request Data:', data);
    console.log('➡️ Profile Image:', profileImage?.name || 'None');
    console.groupEnd();

    const response = await fetch(`${BASE_URL}/api/v1/admin/trainers`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
        // Content-Type은 자동으로 multipart/form-data로 설정됨
      },
      body: formData,
    });

    updateXsrfTokenFromResponse(response);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ API Error:', errorData);
      return { success: false, error: errorData.message || `HTTP ${response.status}` };
    }

    const responseData = await response.json();
    console.log('✅ API Success Data:', responseData);

    return {
      success: true,
      data: responseData.result || responseData.data || responseData,
    };
  } catch (error) {
    console.error('🚨 API Exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// 트레이너 수정
export async function updateTrainer(
  trainerId: number,
  data: TrainerRequestData,
  profileImage?: File
): Promise<ApiResponse<{ trainerId: number }>> {
  try {
    const xsrfToken = getXsrfToken();
    const formData = new FormData();

    // JSON 데이터를 Blob으로 변환하여 추가
    const requestBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('request', requestBlob);

    // 프로필 이미지 추가 (선택사항)
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    console.groupCollapsed(`[API CALL] /api/v1/admin/trainers/${trainerId} (PUT)`);
    console.log('➡️ Trainer ID:', trainerId);
    console.log('➡️ Request Data:', data);
    console.log('➡️ Profile Image:', profileImage?.name || 'None');
    console.groupEnd();

    const response = await fetch(`${BASE_URL}/api/v1/admin/trainers/${trainerId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
      },
      body: formData,
    });

    updateXsrfTokenFromResponse(response);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ API Error:', errorData);
      return { success: false, error: errorData.message || `HTTP ${response.status}` };
    }

    const responseData = await response.json();
    console.log('✅ API Success Data:', responseData);

    return {
      success: true,
      data: responseData.result || responseData.data || responseData,
    };
  } catch (error) {
    console.error('🚨 API Exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// 트레이너 삭제
export async function deleteTrainer(trainerId: number): Promise<ApiResponse<void>> {
  return apiCall<void>(`/api/v1/admin/trainers/${trainerId}`, { method: 'DELETE' });
}

// 트레이너별 배정 고객 목록 조회
export async function getAssignedCustomers(
  trainerId: number
): Promise<ApiResponse<AssignedCustomer[]>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(
        () => resolve({ success: true, data: mockData.mockAssignedCustomers || [] }),
        300
      )
    );
  }

  return apiCall<AssignedCustomer[]>(`/api/v1/admin/trainers/${trainerId}/customers`, {
    method: 'GET',
  });
}

// 고객의 배정 트레이너 변경
export async function reassignCustomerToTrainer(
  trainerId: number,
  customerId: number
): Promise<ApiResponse<number>> {
  return apiCall<number>(`/api/v1/admin/trainers/${trainerId}/customers/${customerId}`, {
    method: 'PUT',
  });
}
