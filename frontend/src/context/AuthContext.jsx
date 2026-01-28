import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 자동 로그인 체크
    checkAutoLogin();
  }, []);

  const checkAutoLogin = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');

      console.log('[AuthContext] 자동 로그인 체크 시작');
      console.log('[AuthContext] accessToken:', accessToken ? '존재' : '없음');
      console.log('[AuthContext] storedUser:', storedUser ? '존재' : '없음');

      if (accessToken && storedUser) {
        // 먼저 저장된 사용자 정보를 로드하여 빠른 렌더링
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        console.log('[AuthContext] 사용자 정보 복원:', parsedUser.userid);

        // 토큰 유효성 검증
        const response = await fetch('http://localhost:8090/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('[AuthContext] 토큰 검증 응답 상태:', response.status);

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            console.log('[AuthContext] 토큰 유효 - 사용자 정보 업데이트');
            setUser(data.user);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(data.user));
          } else {
            console.log('[AuthContext] 토큰 유효하지 않음 - 리프레시 시도');
            await tryRefreshToken();
          }
        } else if (response.status === 401) {
          console.log('[AuthContext] 토큰 만료 (401) - 리프레시 시도');
          await tryRefreshToken();
        } else {
          console.error('[AuthContext] 토큰 검증 실패:', response.status);
          // 사용자 정보는 유지하지만 로그아웃하지는 않음
        }
      } else {
        console.log('[AuthContext] 로그인 정보 없음');
      }
    } catch (error) {
      console.error('[AuthContext] 자동 로그인 확인 오류:', error);
      // 에러 발생 시에도 저장된 사용자 정보는 유지
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        console.log('[AuthContext] 에러 발생했지만 저장된 정보 유지');
      }
    } finally {
      setLoading(false);
      console.log('[AuthContext] 로딩 완료');
    }
  };

  const tryRefreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      console.log('[AuthContext] 리프레시 토큰 재발급 시도');
      console.log('[AuthContext] refreshToken:', refreshToken ? '존재' : '없음');

      if (refreshToken) {
        const response = await fetch('http://localhost:8090/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        console.log('[AuthContext] 리프레시 응답 상태:', response.status);

        const data = await response.json();

        if (data.success && data.accessToken) {
          console.log('[AuthContext] 액세스 토큰 재발급 성공');
          localStorage.setItem('accessToken', data.accessToken);
          
          // 사용자 정보 다시 가져오기
          const userResponse = await fetch('http://localhost:8090/api/auth/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${data.accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            if (userData.success) {
              console.log('[AuthContext] 사용자 정보 갱신 성공');
              setUser(userData.user);
              setIsAuthenticated(true);
              localStorage.setItem('user', JSON.stringify(userData.user));
            }
          }
        } else {
          console.log('[AuthContext] 리프레시 토큰 만료 - 로그아웃');
          logout();
        }
      } else {
        console.log('[AuthContext] 리프레시 토큰 없음 - 로그아웃');
        logout();
      }
    } catch (error) {
      console.error('[AuthContext] 토큰 재발급 오류:', error);
      logout();
    }
  };

  const login = (userData, tokens) => {
    console.log('[AuthContext] 로그인 함수 호출');
    console.log('[AuthContext] userData:', userData);
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    console.log('[AuthContext] 로그인 완료');
  };

  const logout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken) {
      try {
        await fetch('http://localhost:8090/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('로그아웃 API 오류:', error);
      }
    }
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshToken: tryRefreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
