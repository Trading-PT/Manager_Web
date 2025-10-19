'use client';
interface Props {
  newUsers: any[];
  onStatusChange: (id: number, newStatus: string) => void;
}

export default function PendingUsersTable({ newUsers, onStatusChange }: Props) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">신규 가입자 UID 승인 처리</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['성함', '전화번호', '승인 신청 일시', 'UID', '승인 여부'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {newUsers.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-6 text-gray-500">신규 가입자가 없습니다.</td></tr>
              ) : newUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{u.name}</td>
                  <td className="px-6 py-4 text-sm">{u.phone}</td>
                  <td className="px-6 py-4 text-sm">{u.registeredAt}</td>
                  <td className="px-6 py-4 text-sm font-mono">{u.uid}</td>
                  <td className="px-6 py-4">
                    <select
                      value={u.approvalStatus}
                      onChange={(e) => onStatusChange(u.id, e.target.value)}
                      className="text-sm border-none outline-none"
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
  );
}
