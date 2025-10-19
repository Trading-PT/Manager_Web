'use client';
import AdminHeader from '../../components/AdminHeader';
import CustomModal from '../../components/CustomModal';
import CustomButton from '../../components/CustomButton';
import { useState } from 'react';
import { useCustomersData } from './hooks/useCustomersData';
import PendingUsersTable from './PendingUsersTable';
import ConsultationsTable from './ConsultationsTable';
// import CustomerStats from './CustomerStats';
import ConsultationMemoModal from './ConsultationMemoModal';
import * as api from '../../api/serverCall';

export default function CustomersPage() {
  const { newUsers, consultations, loading, setConsultations, setNewUsers } = useCustomersData();
  const [showModal, setShowModal] = useState(false);
  const [memoText, setMemoText] = useState('');
  const [currentId, setCurrentId] = useState<number | null>(null);

  const handleApprovalChange = async (id: number, newStatus: string) => {
    const apiStatus = newStatus === '승인' ? 'APPROVED' : 'REJECTED';
    const res = await api.updateUserStatus(id, apiStatus as any);
    if (res.success) {
      setNewUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, approvalStatus: newStatus } : u))
      );
      alert('승인 상태가 업데이트되었습니다.');
    }
  };

  const handleConsultationToggle = async (id: number) => {
    const res = await api.acceptConsultation(id);
    if (res.success) {
      setConsultations((prev) => prev.map((c) => (c.id === id ? { ...c, isCompleted: true } : c)));
      alert('상담 수락 완료');
    }
  };

  const handleShowMemo = (id: number, memo: string) => {
    setCurrentId(id);
    setMemoText(memo);
    setShowModal(true);
  };

  const handleSaveMemo = async () => {
    if (currentId == null) return;
    const res = await api.updateConsultationMemo(currentId, memoText);
    if (res.success) {
      alert('메모 저장 완료');
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="max-w-[1920px] mx-auto px-6 py-8">
        {/* {loading && <p>로딩 중...</p>} */}
        <PendingUsersTable newUsers={newUsers} onStatusChange={handleApprovalChange} />
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
