'use client';
import { useState, useEffect } from 'react';
import * as api from '../../../api/serverCall';

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

  const loadPendingUsers = async () => {
    setLoading(true);
    const res = await api.getPendingUsers();
    if (res.success && res.data) {
      const users = res.data.map((user: any) => ({
        id: user.userId || user.id,
        name: user.name,
        phone: user.phone,
        registeredAt: user.createdAt,
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

  const loadConsultations = async () => {
    const res = await api.getAdminConsultations();
    if (res.success && res.data) {
      setConsultations(
        res.data.map((c: any) => ({
          id: c.id,
          name: c.customerName,
          phone: c.phone,
          requestedAt: c.requestedAt,
          consultationDate: c.consultationDate,
          isCompleted: c.status === 'COMPLETED',
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
  };
}
