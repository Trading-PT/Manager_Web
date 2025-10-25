// Mock 데이터 정의

export const mockPendingUsers = [
  {
    userId: 1,
    name: '김철수',
    phone: '010-1234-5678',
    createdAt: '2025-01-10T09:30:00',
    status: 'PENDING',
    uid: 'UID-2025-001',
  },
  {
    userId: 2,
    name: '이영희',
    phone: '010-2345-6789',
    createdAt: '2025-01-11T14:20:00',
    status: 'PENDING',
    uid: 'UID-2025-002',
  },
  {
    userId: 3,
    name: '박민준',
    phone: '010-3456-7890',
    createdAt: '2025-01-12T11:15:00',
    status: 'APPROVED',
    uid: 'UID-2025-003',
  },
];

export const mockConsultations = [
  {
    consultationId: 1,
    customerName: '최지훈',
    phone: '010-4567-8901',
    requestedAt: '2025-01-10T10:00:00',
    consultationDate: '2025-01-15T15:00:00',
    status: 'PENDING',
    memo: '상담 시간 변경 요청',
  },
  {
    consultationId: 2,
    customerName: '강서연',
    phone: '010-5678-9012',
    requestedAt: '2025-01-11T09:30:00',
    consultationDate: '2025-01-16T14:00:00',
    status: 'COMPLETED',
    memo: '레벨테스트 관련 상담 완료',
  },
  {
    consultationId: 3,
    customerName: '윤도현',
    phone: '010-6789-0123',
    requestedAt: '2025-01-12T16:20:00',
    consultationDate: '2025-01-17T10:00:00',
    status: 'PENDING',
    memo: '',
  },
];

export const mockManagedCustomers = [
  {
    customerId: 1,
    customerName: '정수민',
    phone: '010-7890-1234',
    investmentType: '스윙',
    lastLevelTest: 'A등급',
    trainerName: '이코치',
    levelTestStatus: '응시완료',
    hasConsultation: true,
  },
  {
    customerId: 2,
    customerName: '임하늘',
    phone: '010-8901-2345',
    investmentType: '데이',
    lastLevelTest: 'B등급',
    trainerName: '박코치',
    levelTestStatus: '미응시',
    hasConsultation: false,
  },
  {
    customerId: 3,
    customerName: '송지우',
    phone: '010-9012-3456',
    investmentType: '스윙',
    lastLevelTest: 'A+등급',
    trainerName: '김코치',
    levelTestStatus: '응시완료',
    hasConsultation: true,
  },
];

export const mockFeedbackRequests = [
  {
    feedbackId: 1,
    customerName: '한지수',
    trainerName: '이코치',
    tradingType: '스윙',
    requestDate: '2025-01-10T09:00:00',
    status: 'PENDING',
    isBest: false,
  },
  {
    feedbackId: 2,
    customerName: '오세훈',
    trainerName: '박코치',
    tradingType: '데이',
    requestDate: '2025-01-11T10:30:00',
    status: 'COMPLETED',
    isBest: true,
  },
  {
    feedbackId: 3,
    customerName: '신예은',
    trainerName: '김코치',
    tradingType: '스윙',
    requestDate: '2025-01-12T14:00:00',
    status: 'PENDING',
    isBest: false,
  },
];

export const mockComplaints = [
  {
    complaintId: 1,
    customerName: '박서준',
    phone: '010-1111-2222',
    trainerName: '이코치',
    content: '피드백 응답 시간이 너무 오래 걸립니다. 24시간 이내 답변을 받기로 했는데 2일이 지났습니다.',
    images: [],
    reply: '불편을 드려 죄송합니다. 담당 트레이너에게 빠른 응답을 요청했으며, 앞으로는 24시간 이내 응답을 보장하겠습니다.',
    replyAuthor: '관리자',
    replyCreatedAt: '2025-01-11T10:00:00',
    createdAt: '2025-01-10T15:30:00',
  },
  {
    complaintId: 2,
    customerName: '이채영',
    phone: '010-3333-4444',
    trainerName: '박코치',
    content: '레벨테스트 결과에 대한 피드백이 부족합니다. 좀 더 상세한 설명이 필요합니다.',
    images: [],
    reply: '',
    replyAuthor: '',
    replyCreatedAt: '',
    createdAt: '2025-01-12T11:20:00',
  },
  {
    complaintId: 3,
    customerName: '최민석',
    phone: '010-5555-6666',
    trainerName: '김코치',
    content: '상담 일정이 갑자기 변경되어 불편했습니다. 사전에 알려주셨으면 좋겠습니다.',
    images: [],
    reply: '상담 일정 변경으로 불편을 드려 죄송합니다. 앞으로는 최소 1일 전에 알려드리도록 하겠습니다.',
    replyAuthor: '관리자',
    replyCreatedAt: '2025-01-12T16:00:00',
    createdAt: '2025-01-12T09:45:00',
  },
  {
    complaintId: 4,
    customerName: '김나연',
    phone: '010-7777-8888',
    trainerName: '이코치',
    content: '강의 자료가 잘 보이지 않습니다. PDF 파일을 다시 확인해주세요.',
    images: [],
    reply: '',
    replyAuthor: '',
    replyCreatedAt: '',
    createdAt: '2025-01-13T14:10:00',
  },
];

export const mockComplaintDetail = (id: number) => {
  const complaint = mockComplaints.find((c) => c.complaintId === id);
  if (!complaint) return null;

  return {
    ...complaint,
    images: id === 1 ? [] : [],
  };
};

export const mockMonthlyTradingSummary = {
  customerId: 1,
  year: 2025,
  month: 1,
  dayTrading: {
    totalCount: 15,
    profitCount: 10,
    lossCount: 5,
    profitRate: 66.7,
  },
  swingTrading: {
    totalCount: 8,
    profitCount: 6,
    lossCount: 2,
    profitRate: 75.0,
  },
};

export const mockTrainers = [
  {
    trainerId: 1,
    profileImageUrl: '',
    name: '이코치',
    phone: '01012345678',
    onelineIntroduction: '스윙 트레이딩 전문 트레이너',
    username: 'trainer_lee',
    role: 'ROLE_TRAINER',
  },
  {
    trainerId: 2,
    profileImageUrl: '',
    name: '박코치',
    phone: '01023456789',
    onelineIntroduction: '데이 트레이딩 전문가',
    username: 'trainer_park',
    role: 'ROLE_TRAINER',
  },
  {
    trainerId: 3,
    profileImageUrl: '',
    name: '김관리자',
    phone: '01034567890',
    onelineIntroduction: '시스템 관리자',
    username: 'admin_kim',
    role: 'ROLE_ADMIN',
  },
];

export const mockAssignedCustomers = [
  {
    customerId: 1,
    name: '정수민',
  },
  {
    customerId: 2,
    name: '임하늘',
  },
  {
    customerId: 3,
    name: '송지우',
  },
];
