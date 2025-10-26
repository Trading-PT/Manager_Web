import { apiCall, getIsMockMode, mockData } from './index';
import type { ApiResponse } from './index';

interface PendingUser {
  userId: number;
  name: string;
  phone: string;
  createdAt: string;
  status: string;
  uid: string;
}

interface UserStatusResponse {
  success: boolean;
  message?: string;
}

interface GrantTokenResponse {
  success: boolean;
  message?: string;
}

// 신규 가입자 목록 조회
export async function getPendingUsers(): Promise<ApiResponse<PendingUser[]>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true, data: mockData.mockPendingUsers }), 300)
    );
  }
  return apiCall('/api/v1/admin/users/pending', { method: 'GET' });
}

// UID 승인/거절 처리
export async function updateUserStatus(
  userId: number,
  status: 'UID_APPROVED' | 'UID_REJECTED'
): Promise<ApiResponse<UserStatusResponse>> {
  return apiCall(`/api/v1/admin/users/${userId}/status?status=${status}`, {
    method: 'PATCH',
  });
}

// 고객에게 토큰 부여
export async function grantUserToken(
  userId: number,
  tokenCount: number
): Promise<ApiResponse<GrantTokenResponse>> {
  return apiCall(`/api/v1/admin/users/${userId}/token`, {
    method: 'PATCH',
    body: JSON.stringify({ tokenCount }),
  });
}
