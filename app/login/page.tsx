'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: API 연동 시 실제 인증 로직 추가
    if (username && password) {
      // 임시로 관리자 페이지로 이동
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            TPT 운영 관리자
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            관리자 계정으로 로그인하세요
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <CustomInput
              type="text"
              label="아이디"
              placeholder="아이디를 입력하세요"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <CustomInput
              type="password"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <CustomButton
              type="submit"
              variant="primary"
              className="w-full"
            >
              로그인
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
}
