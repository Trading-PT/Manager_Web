'use client';

import { useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import CustomButton from '../../components/CustomButton';
import { grantUserToken } from '../../api/users';

export default function EventsPage() {
  const [userId, setUserId] = useState<string>('');
  const [tokenCount, setTokenCount] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGrantToken = async () => {
    // 입력 값 검증
    const userIdNum = parseInt(userId);
    const tokenCountNum = parseInt(tokenCount);

    if (!userId || isNaN(userIdNum) || userIdNum <= 0) {
      alert('올바른 고객 ID를 입력해주세요.');
      return;
    }

    if (!tokenCount || isNaN(tokenCountNum) || tokenCountNum <= 0) {
      alert('올바른 토큰 개수를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await grantUserToken(userIdNum, tokenCountNum);

      if (response.success) {
        alert(`고객 ID ${userIdNum}에게 토큰 ${tokenCountNum}개를 성공적으로 부여했습니다.`);
        // 입력 필드 초기화
        setUserId('');
        setTokenCount('');
      } else {
        alert(`토큰 부여 실패: ${response.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      alert(`오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="max-w-[1920px] mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">이벤트 관리</h1>

          <div className="space-y-6">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                고객 ID
              </label>
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="고객 ID를 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                토큰을 부여할 고객의 ID를 입력하세요.
              </p>
            </div>

            <div>
              <label htmlFor="tokenCount" className="block text-sm font-medium text-gray-700 mb-2">
                토큰 개수
              </label>
              <input
                id="tokenCount"
                type="number"
                value={tokenCount}
                onChange={(e) => setTokenCount(e.target.value)}
                placeholder="토큰 개수를 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                부여할 토큰의 개수를 입력하세요.
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <CustomButton
                variant="primary"
                onClick={handleGrantToken}
                disabled={loading}
              >
                {loading ? '토큰 부여 중...' : '토큰 부여'}
              </CustomButton>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-sm font-semibold text-blue-800 mb-2">사용 안내</h2>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• 고객 ID는 양수로 입력해주세요.</li>
              <li>• 토큰 개수는 1개 이상으로 입력해주세요.</li>
              <li>• 토큰 부여는 즉시 반영되며, 취소할 수 없습니다.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
