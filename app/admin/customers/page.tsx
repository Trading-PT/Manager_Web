'use client';

import { useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import CustomButton from '../../components/CustomButton';
import CustomModal from '../../components/CustomModal';

// 임시 데이터 타입
interface NewUser {
  id: number;
  name: string;
  phone: string;
  registeredAt: string;
  approvalStatus: '승인 대기 중' | '승인' | '승인 불가';
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

  // 임시 데이터
  const [newUsers, setNewUsers] = useState<NewUser[]>([
    { id: 1, name: '홍길동', phone: '010-1234-5678', registeredAt: '2025.8.12.23:37:12', approvalStatus: '승인 대기 중' },
    { id: 2, name: '김철수', phone: '010-2345-6789', registeredAt: '2025.8.13.10:20:30', approvalStatus: '승인' },
  ]);

  const [consultations, setConsultations] = useState<Consultation[]>([
    { id: 1, name: '김개똥', phone: '010-1234-5678', requestedAt: '2025.6.15.1:50', consultationDate: '2025년 8월 3일 13시 50분', isCompleted: false, hasMemo: true },
    { id: 2, name: '이영희', phone: '010-3456-7890', requestedAt: '2025.6.16.14:30', consultationDate: '2025년 8월 4일 15시 00분', isCompleted: true, hasMemo: true },
  ]);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { id: 1, name: '김개똥', phone: '010-1234-5678', levelTestStatus: '미응시', hasConsultation: true, hasMemo: true, trainer: '' },
    { id: 2, name: '박민수', phone: '010-4567-8901', levelTestStatus: 'C (트레이너: 이코치)', hasConsultation: false, hasMemo: true, trainer: '이코치' },
  ]);

  const [allCustomers, setAllCustomers] = useState<AllCustomer[]>([
    { id: 1, name: '김개똥', phone: '010-1234-5678', investmentType: '스윙', lastLTResult: 'C / 답안지 보기', trainer: '이코치' },
    { id: 2, name: '이영희', phone: '010-2345-6789', investmentType: '데이', lastLTResult: 'A / 답안지 보기', trainer: '박코치' },
    { id: 3, name: '박민수', phone: '010-3456-7890', investmentType: '스켈핑', lastLTResult: '내역 없음', trainer: '김코치' },
  ]);

  // 통계 데이터
  const statistics = {
    consultationRequested: 99,
    levelTested: 99,
    nonSubscribed: 99,
    subscribed: 30,
    unsubscribed: 30,
  };

  const handleApprovalChange = (id: number, newStatus: NewUser['approvalStatus']) => {
    setNewUsers(prev => prev.map(user =>
      user.id === id ? { ...user, approvalStatus: newStatus } : user
    ));
  };

  const handleConsultationToggle = (id: number) => {
    setConsultations(prev => prev.map(consultation =>
      consultation.id === id ? { ...consultation, isCompleted: !consultation.isCompleted } : consultation
    ));
  };

  const handleShowMemo = (memo: string) => {
    setModalContent(memo);
    setShowModal(true);
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
                  {newUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.registeredAt}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          조회하기
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.approvalStatus}
                          onChange={(e) => handleApprovalChange(user.id, e.target.value as NewUser['approvalStatus'])}
                          className={`text-sm font-medium border-none outline-none cursor-pointer ${
                            user.approvalStatus === '승인 대기 중' ? 'text-gray-500' :
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
                  {consultations.map((consultation) => (
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
                          onClick={() => handleShowMemo('상담 메모 내용')}
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
                  {subscriptions.map((sub) => (
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
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showMyCustomersOnly
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
                  {allCustomers.map((customer) => (
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
        <CustomModal onClose={() => setShowModal(false)}>
          <div className="p-6">
            <h3 className="text-lg font-bold mb-4">상담 메모</h3>
            <p className="text-gray-700">{modalContent}</p>
          </div>
        </CustomModal>
      )}
    </div>
  );
}
