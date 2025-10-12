'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import CustomButton from '../../components/CustomButton';
import CustomModal from '../../components/CustomModal';
import * as api from '../../api/serverCall';

// 임시 데이터 타입
interface NewUser {
  id: number;
  name: string;
  phone: string;
  registeredAt: string;
  approvalStatus: '승인 대기 중' | '승인' | '승인 불가';
  uid?: string;
}

interface Consultation {
  id: number;
  name: string;
  phone: string;
  requestedAt: string;
  consultationDate: string;
  isCompleted: boolean;
  hasMemo: boolean;
}

interface Subscription {
  id: number;
  name: string;
  phone: string;
  levelTestStatus: string;
  hasConsultation: boolean;
  hasMemo: boolean;
  trainer: string;
}

interface AllCustomer {
  id: number;
  name: string;
  phone: string;
  investmentType: string;
  lastLTResult: string;
  trainer: string;
}

export default function CustomersPage() {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [showMyCustomersOnly, setShowMyCustomersOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentConsultationId, setCurrentConsultationId] = useState<number | null>(null);
  const [memoText, setMemoText] = useState('');

  // 데이터 상태
  const [newUsers, setNewUsers] = useState<NewUser[]>([]);

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [allCustomers, setAllCustomers] = useState<AllCustomer[]>([]);

  // 통계 데이터
  const [statistics, setStatistics] = useState({
    consultationRequested: 0,
    levelTested: 0,
    nonSubscribed: 0,
    subscribed: 0,
    unsubscribed: 0,
  });

  // 초기 데이터 로드
  useEffect(() => {
    loadPendingUsers();
    loadConsultations();
    loadManagedCustomers();
  }, []);

  // 신규 가입자 목록 로드
  const loadPendingUsers = async () => {
    setLoading(true);
    const response = await api.getPendingUsers();
    if (response.success && response.data) {
      // API 응답 데이터를 UI 형식으로 변환
      const users = response.data.map((user: any) => ({
        id: user.userId || user.id,
        name: user.name || user.username,
        phone: user.phone || user.phoneNumber,
        registeredAt: user.createdAt || user.registeredAt,
        approvalStatus: user.status === 'PENDING' ? '승인 대기 중' :
          user.status === 'APPROVED' ? '승인' : '승인 불가',
        uid: user.uid || user.userId || user.id?.toString() || '-',
      }));
      setNewUsers(users);
    }
    setLoading(false);
  };

  // 상담 목록 로드
  const loadConsultations = async () => {
    const response = await api.getAdminConsultations();
    if (response.success && response.data) {
      const consultationList = response.data?.map((consultation: any) => ({
        id: consultation.consultationId || consultation.id,
        name: consultation.customerName || consultation.name,
        phone: consultation.phone || consultation.phoneNumber,
        requestedAt: consultation.requestedAt || consultation.createdAt,
        consultationDate: consultation.consultationDate || consultation.scheduledDate,
        isCompleted: consultation.status === 'COMPLETED' || consultation.isCompleted,
        hasMemo: !!consultation.memo,
        memo: consultation.memo,
      }));
      setConsultations(consultationList);
    }
  };

  // 담당 고객 목록 로드
  const loadManagedCustomers = async () => {
    const response = await api.getManagedCustomers();
    if (response.success && response.data) {
      const customers = response.data.map((customer: any) => ({
        id: customer.customerId || customer.id,
        name: customer.name || customer.customerName,
        phone: customer.phone || customer.phoneNumber,
        investmentType: customer.investmentType || '스윙',
        lastLTResult: customer.lastLevelTest || '내역 없음',
        trainer: customer.trainerName || customer.trainer || '',
        levelTestStatus: customer.levelTestStatus || '미응시',
        hasConsultation: customer.hasConsultation || false,
        hasMemo: !!customer.memo,
      }));
      setAllCustomers(customers);

      // 신규 구독 고객도 같은 데이터로 필터링 (예: 최근 30일 이내)
      setSubscriptions(customers.slice(0, 10)); // 임시로 최근 10명
    }
  };

  const handleApprovalChange = async (id: number, newStatus: NewUser['approvalStatus']) => {
    const apiStatus = newStatus === '승인' ? 'APPROVED' :
      newStatus === '승인 불가' ? 'REJECTED' : 'PENDING';

    const response = await api.updateUserStatus(id, apiStatus as 'APPROVED' | 'REJECTED');

    if (response.success) {
      setNewUsers(prev => prev.map(user =>
        user.id === id ? { ...user, approvalStatus: newStatus } : user
      ));
      alert('승인 상태가 업데이트되었습니다.');
    } else {
      alert(`오류: ${response.error}`);
    }
  };

  const handleConsultationToggle = async (id: number) => {
    const consultation = consultations.find(c => c.id === id);
    if (!consultation) return;

    if (!consultation.isCompleted) {
      // 상담 수락
      const response = await api.acceptConsultation(id);
      if (response.success) {
        setConsultations(prev => prev.map(c =>
          c.id === id ? { ...c, isCompleted: true } : c
        ));
        alert('상담이 수락되었습니다.');
      } else {
        alert(`오류: ${response.error}`);
      }
    } else {
      // 체크 해제는 로컬에서만 처리
      setConsultations(prev => prev.map(c =>
        c.id === id ? { ...c, isCompleted: false } : c
      ));
    }
  };

  const handleShowMemo = (consultationId: number, memo: string) => {
    setCurrentConsultationId(consultationId);
    setMemoText(memo || '');
    setShowModal(true);
  };

  const handleSaveMemo = async () => {
    if (currentConsultationId === null) return;

    const response = await api.updateConsultationMemo(currentConsultationId, memoText);
    if (response.success) {
      alert('메모가 저장되었습니다.');
      setShowModal(false);
      loadConsultations(); // 새로고침
    } else {
      alert(`오류: ${response.error}`);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentConsultationId(null);
    setMemoText('');
  };

  const handleInvestmentTypeChange = (id: number, newType: string) => {
    setAllCustomers(prev => prev.map(customer =>
      customer.id === id ? { ...customer, investmentType: newType } : customer
    ));
  };

  const handleTrainerChange = (id: number, newTrainer: string) => {
    setAllCustomers(prev => prev.map(customer =>
      customer.id === id ? { ...customer, trainer: newTrainer } : customer
    ));
  };

  const handleSubscriptionTrainerChange = (id: number, newTrainer: string) => {
    setSubscriptions(prev => prev.map(sub =>
      sub.id === id ? { ...sub, trainer: newTrainer } : sub
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-[1920px] mx-auto px-6 py-8">
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6">
              <p className="text-lg font-medium">로딩 중...</p>
            </div>
          </div>
        )}
        {/* 1. 신규 가입자 UID 승인 처리 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">신규 가입자 UID 승인 처리</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">성함</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">전화번호</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">승인 신청 일시</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">승인 여부</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {newUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        신규 가입자가 없습니다.
                      </td>
                    </tr>
                  ) : newUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.registeredAt}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{user.uid}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.approvalStatus}
                          onChange={(e) => handleApprovalChange(user.id, e.target.value as NewUser['approvalStatus'])}
                          className={`text-sm font-medium border-none outline-none cursor-pointer ${user.approvalStatus === '승인 대기 중' ? 'text-gray-500' :
                              user.approvalStatus === '승인' ? 'text-blue-600' : 'text-red-600'
                            }`}
                        >
                          <option value="승인 대기 중">승인 대기 중</option>
                          <option value="승인">승인</option>
                          <option value="승인 불가">승인 불가</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 2. 신규 상담 신청 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">신규 상담 신청</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">성함</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">전화번호</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상담 신청 시각</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상담 신청 일시</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상담 수행 여부</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상담 메모</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {consultations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        신규 상담 신청이 없습니다.
                      </td>
                    </tr>
                  ) : consultations.map((consultation) => (
                    <tr key={consultation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{consultation.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{consultation.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{consultation.requestedAt}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{consultation.consultationDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={consultation.isCompleted}
                          onChange={() => handleConsultationToggle(consultation.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleShowMemo(consultation.id, (consultation as any).memo || '')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          메모 보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 3. 신규 구독 고객 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">신규 구독 고객</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">성함</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">레벨테스트</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">전화번호</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상담 여부</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상담 메모</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">트레이너 배정</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        신규 구독 고객이 없습니다.
                      </td>
                    </tr>
                  ) : subscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sub.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={sub.levelTestStatus === '미응시' ? 'text-red-600 font-medium' : 'text-blue-600 font-medium'}>
                          {sub.levelTestStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sub.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sub.hasConsultation ? 'O' : 'X'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleShowMemo('상담 메모 내용')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          메모 보기
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className="text-sm border-gray-300 rounded-md"
                          value={sub.trainer}
                          onChange={(e) => handleSubscriptionTrainerChange(sub.id, e.target.value)}
                        >
                          <option value="">트레이너 배정해주세요</option>
                          <option value="이코치">이코치</option>
                          <option value="박코치">박코치</option>
                          <option value="김코치">김코치</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 4. 누적 고객 현황 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">누적 고객 현황</h2>
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">상담 신청한 고객</p>
              <p className="text-3xl font-bold text-blue-600">{statistics.consultationRequested}명</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">레벨테스트한 고객</p>
              <p className="text-3xl font-bold text-blue-600">{statistics.levelTested}명</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">미구독 고객</p>
              <p className="text-3xl font-bold text-blue-600">{statistics.nonSubscribed}명</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">구독 고객</p>
              <p className="text-3xl font-bold text-blue-600">{statistics.subscribed}명</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">구독 해지 고객</p>
              <p className="text-3xl font-bold text-blue-600">{statistics.unsubscribed}명</p>
            </div>
          </div>
        </section>

        {/* 5. 모든 구독 고객 목록 */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">모든 구독 고객 목록</h2>
            <button
              onClick={() => setShowMyCustomersOnly(!showMyCustomersOnly)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${showMyCustomersOnly
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              내 담당 고객만
            </button>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">성함</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">전화번호</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">현재 투자 유형</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">마지막 LT 결과</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LT 성적 추이</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UID 관리</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조교</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        구독 고객이 없습니다.
                      </td>
                    </tr>
                  ) : allCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className="text-sm border-gray-300 rounded-md"
                          value={customer.investmentType}
                          onChange={(e) => handleInvestmentTypeChange(customer.id, e.target.value)}
                        >
                          <option value="스윙">스윙</option>
                          <option value="데이">데이</option>
                          <option value="스켈핑">스켈핑</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.lastLTResult}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          조회하기
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          조회하기
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className="text-sm border-gray-300 rounded-md"
                          value={customer.trainer}
                          onChange={(e) => handleTrainerChange(customer.id, e.target.value)}
                        >
                          <option value="">선택</option>
                          <option value="이코치">이코치</option>
                          <option value="박코치">박코치</option>
                          <option value="김코치">김코치</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* 모달 */}
      {showModal && (
        <CustomModal onClose={handleCloseModal}>
          <div className="p-6">
            <h3 className="text-lg font-bold mb-4">상담 메모</h3>
            <textarea
              className="w-full min-h-[200px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ex) 상담 시간 변경, 고객 노쇼"
              value={memoText}
              onChange={(e) => setMemoText(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <CustomButton
                variant="secondary"
                onClick={handleCloseModal}
              >
                취소
              </CustomButton>
              <CustomButton
                variant="primary"
                onClick={handleSaveMemo}
              >
                저장
              </CustomButton>
            </div>
          </div>
        </CustomModal>
      )}
    </div>
  );
}
