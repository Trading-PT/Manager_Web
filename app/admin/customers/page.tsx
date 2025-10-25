'use client';
import AdminHeader from '../../components/AdminHeader';
import CustomModal from '../../components/CustomModal';
import CustomButton from '../../components/CustomButton';
import { useState, useEffect } from 'react';
import { useCustomersData } from './hooks/useCustomersData';
import PendingUsersTable from './PendingUsersTable';
import ConsultationsTable from './ConsultationsTable';
import InvestmentTypeChangeTable from './InvestmentTypeChangeTable';
// import CustomerStats from './CustomerStats';
import ConsultationMemoModal from './ConsultationMemoModal';
import {
  getPendingChangeRequests,
  processChangeRequest,
  type ChangeRequest,
} from '../../api/investmentTypeChange';
// import * as api from '../../api/serverCall';


export default function CustomersPage() {
  const { newUsers, consultations, loading, setConsultations, setNewUsers, updateUserApprovalStatus } = useCustomersData();
  const [showModal, setShowModal] = useState(false);
  const [memoText, setMemoText] = useState('');
  const [currentId, setCurrentId] = useState<number | null>(null);

  // 투자 유형 변경 신청
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [loadingChangeRequests, setLoadingChangeRequests] = useState(false);

  const handleConsultationToggle = async (id: number) => {
    // const res = await api.acceptConsultation(id);
    // if (res.success) {
    //   setConsultations((prev) => prev.map((c) => (c.id === id ? { ...c, isCompleted: true } : c)));
    //   alert('상담 수락 완료');
    // }
  };

  const handleShowMemo = (id: number, memo: string) => {
    setCurrentId(id);
    setMemoText(memo);
    setShowModal(true);
  };

  const handleSaveMemo = async () => {
    // if (currentId == null) return;
    // const res = await api.updateConsultationMemo(currentId, memoText);
    // if (res.success) {
    //   alert('메모 저장 완료');
    //   setShowModal(false);
    // }
  };

  // 투자 유형 변경 신청 로드
  useEffect(() => {
    loadChangeRequests();
  }, []);

  const loadChangeRequests = async () => {
    setLoadingChangeRequests(true);
    const response = await getPendingChangeRequests();
    console.log('[InvestmentTypeChange] API Response:', response);
    if (response.success && response.data) {
      console.log('[InvestmentTypeChange] Loaded requests:', response.data);
      setChangeRequests(response.data);
    } else {
      console.error('[InvestmentTypeChange] Failed to load:', response.error);
    }
    setLoadingChangeRequests(false);
  };

  // 투자 유형 변경 신청 처리
  const handleProcessChangeRequest = async (
    requestId: number,
    approved: boolean,
    rejectionReason?: string
  ) => {
    setLoadingChangeRequests(true);
    const response = await processChangeRequest(requestId, {
      approved,
      rejectionReason,
    });

    if (response.success) {
      alert(approved ? '신청이 승인되었습니다.' : '신청이 거부되었습니다.');
      loadChangeRequests(); // 목록 새로고침
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoadingChangeRequests(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="max-w-[1920px] mx-auto px-6 py-8">
        {/* {loading && <p>로딩 중...</p>} */}
        <PendingUsersTable newUsers={newUsers} onStatusChange={updateUserApprovalStatus} />
        <InvestmentTypeChangeTable
          changeRequests={changeRequests}
          onProcess={handleProcessChangeRequest}
        />
        <ConsultationsTable
          consultations={consultations}
          onToggle={handleConsultationToggle}
          onShowMemo={handleShowMemo}
        />
        {/* <CustomerStats /> */}
      </main>

      {showModal && (
        <ConsultationMemoModal
          memoText={memoText}
          onChange={setMemoText}
          onClose={() => setShowModal(false)}
          onSave={handleSaveMemo}
        />
      )}
    </div>
  );
}
