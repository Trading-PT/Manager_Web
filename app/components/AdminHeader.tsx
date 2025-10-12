'use client';

import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

interface MenuItem {
  name: string;
  path: string;
}

export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { name: '고객관리', path: '/admin/customers' },
    { name: '조교관리', path: '/admin/assistants' },
    { name: '칼럼관리', path: '/admin/columns' },
    { name: '후기관리', path: '/admin/reviews' },
    { name: '민원관리', path: '/admin/complaints' },
    { name: '강의관리', path: '/admin/lectures' },
    { name: '알림관리', path: '/admin/notifications' },
    { name: 'LT관리', path: '/admin/lt' },
    { name: '상담일시관리', path: '/admin/consultations' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-[1920px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 좌측 로고 */}
          <div className="flex items-center">
            <div className="cursor-pointer" onClick={() => router.push('/admin')}>
              <Image
                src="/images/logo_small.png"
                alt="TPT Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </div>

          {/* 중앙 메뉴 */}
          <nav className="flex items-center gap-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive(item.path)
                    ? 'border-2 border-red-500 text-red-600 font-bold'
                    : 'border-2 border-transparent text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* 우측 마이페이지 버튼 */}
          <button
            onClick={() => router.push('/admin/mypage')}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            마이페이지
          </button>
        </div>
      </div>
    </header>
  );
}
