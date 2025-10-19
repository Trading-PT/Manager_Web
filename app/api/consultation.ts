import { apiCall, getIsMockMode, mockData } from './index';
import type { ApiResponse } from './index';

// 상담 목록 조회
export async function getAdminConsultations(params?: { page?: number; size?: number }) {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true, data: mockData.mockConsultations }), 300)
    );
  }

  const query = new URLSearchParams(params as Record<string, string>).toString();
  return apiCall(`/api/v1/admin/consultations${query ? `?${query}` : ''}`, { method: 'GET' });
}

// 상담 수락
export async function acceptConsultation(id: number) {
  return apiCall(`/api/v1/admin/consultations/${id}/accept`, { method: 'PUT' });
}

// 상담 메모 수정
export async function updateConsultationMemo(id: number, memo: string) {
  return apiCall(`/api/v1/admin/consultations/${id}/memo`, {
    method: 'PUT',
    body: JSON.stringify({ memo }),
  });
}

// 차단 생성/삭제
export async function createConsultationBlock(data: { date: string; time: string }) {
  return apiCall('/api/v1/admin/consultations/blocks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteConsultationBlock(blockId: number) {
  return apiCall(`/api/v1/admin/consultations/blocks?blockId=${blockId}`, { method: 'DELETE' });
}
