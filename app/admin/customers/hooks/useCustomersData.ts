'use client';
import { useState, useEffect } from 'react';
import * as api from '../../../api/users';
import * as api2 from '../../../api/consultation';

export function useCustomersData() {
  const [newUsers, setNewUsers] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [statistics, setStatistics] = useState({
    consultationRequested: 0,
    levelTested: 0,
    nonSubscribed: 0,
    subscribed: 0,
    unsubscribed: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPendingUsers();
    loadConsultations();
  }, []);

  // 1. UID 승인 대기 고객 목록 조회 
const loadPendingUsers = async () => {
  setLoading(true);
  const res = await api.getPendingUsers();

  if (res.success && res.data) {
    // ✅ res.data 자체가 배열이므로 result 제거
    const users = res.data.map((user: any) => ({
      id: user.userId || user.id,
      name: user.name,
      phone: user.phone,
      registeredAt: user.requestedAt || user.createdAt,
      approvalStatus:
        user.status === 'PENDING'
          ? '승인 대기 중'
          : user.status === 'APPROVED'
          ? '승인'
          : '승인 불가',
      uid: user.uid || '-',
    }));

    setNewUsers(users);
  }

  setLoading(false);
};


  // 2. UID 승인/거절 처리 hook
  const updateUserApprovalStatus = async (userId: number, newStatus: string) => {
    try {
      // 한글 상태를 서버 enum 값으로 변환
      const apiStatus =
        newStatus === '승인' ? 'APPROVED' :
        newStatus === '승인 불가' ? 'REJECTED' :
        'PENDING';

      const res = await api.updateUserStatus(userId, apiStatus as 'APPROVED' | 'REJECTED');
      if (res.success) {
        setNewUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, approvalStatus: newStatus } : user
          )
        );
        alert(`사용자 상태가 '${newStatus}'(으)로 변경되었습니다.`);
      } else {
        alert('상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('UID 승인 처리 중 오류:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  }; 

  // 3. 신규 상담 신청 목록 조회 
  const loadConsultations = async () => {
  const res : any = await api2.getAdminConsultations();
  if (res.success && res.data) {
    const consultations = res.data.result?.content || [];

    setConsultations(
      consultations.map((c: any) => ({
        id: c.id,
        name: c.customerName,
        phone: c.customerPhoneNumber,
        // 신청일시(createdAt)
        requestedAt: new Date(c.createdAt).toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        // 상담 예정 일시 (date + time)
        consultationDate: `${c.date} ${c.time}`,
        isCompleted: c.isProcessed,
        memo: c.memo,
      }))
    );
  }
};


  return {
    newUsers,
    consultations,
    subscriptions,
    allCustomers,
    statistics,
    loading,
    setConsultations,
    setNewUsers,
    updateUserApprovalStatus,
  };
}
