import { apiCall, getIsMockMode, mockData } from './base';
import type { ApiResponse } from './base';
import type { InvestmentType } from './investmentTypeChange';
import type { SliceInfo } from './reviews';

// Types
export type CourseStatus = 'BEFORE_COMPLETION' | 'PENDING_COMPLETION' | 'AFTER_COMPLETION';

export interface AdminFeedbackCard {
  id: number;
  isBestFeedback: boolean;
  username: string;
  trainerName: string;
  investmentType: InvestmentType;
  courseStatus: CourseStatus;
  createdAt: string; // ISO date-time
  submittedAt: string; // ISO date-time
}

export interface SelectedBestFeedbackListResponse {
  adminFeedbackCardResponseDTOS: AdminFeedbackCard[];
}

export interface TotalFeedbackListResponse {
  adminFeedbackCardResponseDTOS: AdminFeedbackCard[];
  sliceInfo: SliceInfo;
}

export interface AdminFeedbackResponse {
  selectedBestFeedbackListResponseDTO: SelectedBestFeedbackListResponse;
  totalFeedbackListResponseDTO: TotalFeedbackListResponse;
}

export interface UpdateBestFeedbacksRequest {
  feedbackIds: number[]; // 최대 3개
}

// 전체 피드백 목록 조회 (어드민)
export async function getAdminFeedbackRequests(params?: {
  page?: number;
  size?: number;
}): Promise<ApiResponse<AdminFeedbackResponse>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            success: true,
            data: {
              selectedBestFeedbackListResponseDTO: {
                adminFeedbackCardResponseDTOS:
                  mockData.mockFeedbackRequests
                    ?.filter((f) => f.isBest)
                    .map((f) => ({
                      id: f.feedbackId,
                      isBestFeedback: f.isBest,
                      username: f.customerName,
                      trainerName: f.trainerName,
                      investmentType: f.tradingType as InvestmentType,
                      courseStatus: 'AFTER_COMPLETION' as CourseStatus,
                      createdAt: f.requestDate,
                      submittedAt: f.requestDate,
                    })) || [],
              },
              totalFeedbackListResponseDTO: {
                adminFeedbackCardResponseDTOS:
                  mockData.mockFeedbackRequests?.map((f) => ({
                    id: f.feedbackId,
                    isBestFeedback: f.isBest,
                    username: f.customerName,
                    trainerName: f.trainerName,
                    investmentType: f.tradingType as InvestmentType,
                    courseStatus: 'AFTER_COMPLETION' as CourseStatus,
                    createdAt: f.requestDate,
                    submittedAt: f.requestDate,
                  })) || [],
                sliceInfo: {
                  currentPage: params?.page || 0,
                  pageSize: params?.size || 20,
                  hasNext: false,
                  isFirst: true,
                  isLast: true,
                },
              },
            },
          }),
        300
      )
    );
  }

  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append('page', String(params.page));
  if (params?.size !== undefined) queryParams.append('size', String(params.size));

  const query = queryParams.toString();
  return apiCall<AdminFeedbackResponse>(
    `/api/v1/admin/feedback-requests${query ? `?${query}` : ''}`,
    {
      method: 'GET',
    }
  );
}

// 베스트 피드백 일괄 업데이트 (어드민)
export async function updateBestFeedbacks(
  feedbackIds: number[]
): Promise<ApiResponse<void>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            success: true,
            data: undefined,
          }),
        300
      )
    );
  }

  const requestBody: UpdateBestFeedbacksRequest = {
    feedbackIds: feedbackIds.slice(0, 3), // 최대 3개만
  };

  return apiCall<void>('/api/v1/admin/feedback-requests/best', {
    method: 'PATCH',
    body: JSON.stringify(requestBody),
  });
}

// 투자 유형 라벨
export function getInvestmentTypeLabel(type: InvestmentType): string {
  const labels: Record<InvestmentType, string> = {
    SWING: '스윙',
    DAY: '데이',
    SCALPING: '스켈핑',
  };
  return labels[type] || type;
}

// 완강 여부 라벨
export function getCourseStatusLabel(status: CourseStatus): string {
  const labels: Record<CourseStatus, string> = {
    BEFORE_COMPLETION: '완강 전',
    PENDING_COMPLETION: '완강 보류',
    AFTER_COMPLETION: '완강 후',
  };
  return labels[status] || status;
}

// 토큰 사용 피드백 관련 Types
export type FeedbackStatus = 'FR' | 'FN' | 'N';

export interface TokenUsedFeedbackListItem {
  id: number;
  customerId: number;
  customerName: string;
  investmentType: InvestmentType;
  courseStatus: CourseStatus;
  status: FeedbackStatus;
  createdAt: string; // ISO date-time
  tokenAmount: number;
  respondedTrainerId?: number;
  respondedTrainerName?: string;
  feedbackYear: number;
  feedbackMonth: number;
  feedbackDay: number;
}

export interface TokenUsedFeedbackListResponse {
  feedbacks: TokenUsedFeedbackListItem[];
  sliceInfo: SliceInfo;
}

// 토큰 사용 피드백 요청 목록 조회 (무한 스크롤)
export async function getTokenUsedFeedbackRequests(params?: {
  page?: number;
  size?: number;
}): Promise<ApiResponse<TokenUsedFeedbackListResponse>> {
  if (getIsMockMode()) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            success: true,
            data: {
              feedbacks:
                mockData.mockFeedbackRequests?.map((f, index) => ({
                  id: f.feedbackId,
                  customerId: index + 1,
                  customerName: f.customerName,
                  investmentType: f.tradingType as InvestmentType,
                  courseStatus: 'AFTER_COMPLETION' as CourseStatus,
                  status: f.status === 'COMPLETED' ? ('FR' as FeedbackStatus) : ('N' as FeedbackStatus),
                  createdAt: f.requestDate,
                  tokenAmount: 1,
                  respondedTrainerId: f.status === 'COMPLETED' ? 1 : undefined,
                  respondedTrainerName: f.status === 'COMPLETED' ? f.trainerName : undefined,
                  feedbackYear: new Date(f.requestDate).getFullYear(),
                  feedbackMonth: new Date(f.requestDate).getMonth() + 1,
                  feedbackDay: new Date(f.requestDate).getDate(),
                })) || [],
              sliceInfo: {
                currentPage: params?.page || 0,
                pageSize: params?.size || 20,
                hasNext: false,
                isFirst: true,
                isLast: true,
              },
            },
          }),
        300
      )
    );
  }

  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append('page', String(params.page));
  if (params?.size !== undefined) queryParams.append('size', String(params.size));

  const query = queryParams.toString();
  return apiCall<TokenUsedFeedbackListResponse>(
    `/api/v1/admin/feedback-requests/token-used${query ? `?${query}` : ''}`,
    {
      method: 'GET',
    }
  );
}

// 피드백 상태 라벨
export function getFeedbackStatusLabel(status: FeedbackStatus): string {
  const labels: Record<FeedbackStatus, string> = {
    FR: '답변 완료',
    FN: '답변 대기',
    N: '미제출',
  };
  return labels[status] || status;
}

// 피드백 상태 색상
export function getFeedbackStatusColor(status: FeedbackStatus): string {
  const colors: Record<FeedbackStatus, string> = {
    FR: 'bg-green-100 text-green-800',
    FN: 'bg-yellow-100 text-yellow-800',
    N: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
