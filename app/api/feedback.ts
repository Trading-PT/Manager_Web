import { apiCall } from './index';
import type { ApiResponse } from './index';

// 피드백 요청 목록 조회
export async function getAdminFeedbackRequests(params?: { page?: number; size?: number }) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return apiCall(`/api/v1/admin/feedback-requests${query ? `?${query}` : ''}`, { method: 'GET' });
}

// 베스트 피드백 업데이트
export async function updateBestFeedbacks(feedbackIds: number[]): Promise<ApiResponse<any>> {
  return apiCall('/api/v1/admin/feedback-requests/best', {
    method: 'PATCH',
    body: JSON.stringify({ feedbackIds }),
  });
}
