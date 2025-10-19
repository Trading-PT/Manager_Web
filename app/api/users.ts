import { apiCall, getIsMockMode, mockData } from './index';
import type { ApiResponse } from './index';

// 신규 가입자 목록 조회
export async function getPendingUsers(): Promise<ApiResponse<any>> {
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
  status: 'APPROVED' | 'REJECTED'
): Promise<ApiResponse<any>> {
  return apiCall(`/api/v1/admin/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
