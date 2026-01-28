import { useState, useEffect } from 'react';

// 자동 로그인 및 토큰 관리를 위한 커스텀 훅
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        // 토큰 유효성 검증
        const isValid = await validateToken(token);
        
        if (isValid) {
          setAccessToken(token);
          setUser(JSON.parse(storedUser));
        } else {
          // 토큰이 만료된 경우 리프레시 토큰으로 재발급 시도
          await refreshAccessToken();
        }
      }
    } catch (error) {
      console.error('인증 확인 오류:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const validateToken = async (token) => {
    try {
      const response = await fetch('http://localhost:8090/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // 사용자 정보 업데이트
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('토큰 검증 오류:', error);
      return false;
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        logout();
        return false;
      }

      const response = await fetch('http://localhost:8090/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.success && data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        setAccessToken(data.accessToken);
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error('토큰 재발급 오류:', error);
      logout();
      return false;
    }
  };

  const login = (userData, tokens) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setAccessToken(tokens.accessToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setAccessToken(null);
    setUser(null);
  };

  return {
    user,
    accessToken,
    loading,
    login,
    logout,
    refreshAccessToken,
    isAuthenticated: !!user && !!accessToken,
  };
};

// API 요청 시 자동으로 토큰을 포함하는 fetch 래퍼
export const authFetch = async (url, options = {}) => {
  const accessToken = localStorage.getItem('accessToken');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // 토큰이 만료된 경우 (401 Unauthorized)
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        // 리프레시 토큰으로 새 액세스 토큰 발급 시도
        const refreshResponse = await fetch('http://localhost:8090/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        const refreshData = await refreshResponse.json();

        if (refreshData.success && refreshData.accessToken) {
          // 새 토큰 저장
          localStorage.setItem('accessToken', refreshData.accessToken);
          
          // 원래 요청 재시도
          headers['Authorization'] = `Bearer ${refreshData.accessToken}`;
          return fetch(url, {
            ...options,
            headers,
          });
        }
      }

      // 리프레시 토큰도 만료된 경우 로그아웃
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return response;
  } catch (error) {
    console.error('API 요청 오류:', error);
    throw error;
  }
};
