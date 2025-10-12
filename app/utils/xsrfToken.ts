// XSRF-TOKEN 관리 유틸리티

const XSRF_TOKEN_KEY = 'XSRF-TOKEN';

/**
 * 쿠키에서 XSRF-TOKEN 값을 읽어옵니다.
 */
export function getXsrfTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === XSRF_TOKEN_KEY) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

/**
 * localStorage에서 XSRF-TOKEN 값을 읽어옵니다.
 */
export function getXsrfToken(): string | null {
  if (typeof window === 'undefined') return null;

  // localStorage에서 토큰 가져오기
  return localStorage.getItem(XSRF_TOKEN_KEY);
}

/**
 * XSRF-TOKEN을 localStorage에 저장합니다.
 */
export function setXsrfToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(XSRF_TOKEN_KEY, token);
}

/**
 * XSRF-TOKEN을 제거합니다.
 */
export function removeXsrfToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(XSRF_TOKEN_KEY);
}

/**
 * 응답 헤더에서 새로운 XSRF-TOKEN을 추출하고 업데이트합니다.
 * @param response Fetch Response 객체
 * @returns 토큰이 업데이트되었는지 여부
 */
export function updateXsrfTokenFromResponse(response: Response): boolean {
  // 서버가 커스텀 헤더로 XSRF-TOKEN을 전달하는 경우
  const xsrfHeader = response.headers.get('X-XSRF-TOKEN');

  if (xsrfHeader) {
    const currentToken = getXsrfToken();
    if (xsrfHeader !== currentToken) {
      setXsrfToken(xsrfHeader);
      return true;
    }
  }

  // 쿠키에서 확인 (브라우저가 자동으로 설정한 경우)
  // 로그인 직후에는 쿠키에서 토큰을 가져옴
  const cookieToken = getXsrfTokenFromCookie();
  if (cookieToken) {
    const currentToken = localStorage.getItem(XSRF_TOKEN_KEY);
    if (cookieToken !== currentToken) {
      setXsrfToken(cookieToken);
      return true;
    }
  }

  return false;
}
