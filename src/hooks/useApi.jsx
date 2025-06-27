import { useState, useCallback, useEffect } from 'react';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const BASE_URL = "/api";

  // Auth utilities
  const isLoggedIn = useCallback(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  }, []);

  // const isTokenExpired = useCallback(() => {
  //   const expireTime = localStorage.getItem("tokenExpireTime");
  //   if (!expireTime) return true;
  //   return Date.now() >= parseInt(expireTime);
  // }, []);

  const clearAuthData = useCallback(() => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    // localStorage.removeItem("tokenExpireTime");
    // localStorage.removeItem("loginTime");
  }, []);

  // // Auto logout when token expires
  // useEffect(() => {
  //   const checkTokenStatus = () => {
  //     if (isLoggedIn() && isTokenExpired()) {
  //       clearAuthData();
  //       console.log('Token expired - auto logout');
  //       window.location.href = '/login';
  //     }
  //   };

  //   checkTokenStatus();
  //   const interval = setInterval(checkTokenStatus, 1000);
  //   return () => clearInterval(interval);
  // }, [isLoggedIn, isTokenExpired, clearAuthData]);

  // Main API caller
  const callApi = useCallback(async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    setLoading(true);
    setError(null);

    try {
      // Check token before API call
      // if (isLoggedIn() && isTokenExpired()) {
      //   clearAuthData();
      //   window.location.href = '/login';
      //   throw new Error('Session expired');
      // }

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        ...options
      });
      console.log('API response status:', response.status); // Thêm dòng này
      // Handle 401 from server
      if (response.status === 401) {
        clearAuthData();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        throw new Error('Session expired');
      }

      const data = await response.json();
      if (!data.status && data.message) {
        throw new Error(data.message);
      }

      return data;
    } catch (err) {
      setError(err.message || 'API call failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, clearAuthData]);

  // Auth APIs
  const login = useCallback(async (credentials) => {
    const result = await callApi('/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    if (result.status) {
      // const loginTime = Date.now();
      // const expireTime = loginTime + 900000; // 30 minutes

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(result.data));
      // localStorage.setItem("loginTime", loginTime.toString());
      // localStorage.setItem("tokenExpireTime", expireTime.toString());
    }

    return result;
  }, [callApi]);

  const logout = useCallback(async () => {
    try {
      await callApi('/logout', { method: 'POST' });
    } catch (error) {
      console.log('Logout failed, clearing local data');
    } finally {
      clearAuthData();
      window.location.href = '/login';
    }
  }, [callApi, clearAuthData]);

  const register = useCallback(async (userData) => {
    return callApi('/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }, [callApi]);

  // Data APIs
  const getCurrentUser = useCallback(async () => {
    return callApi('/getMe');
  }, [callApi]);

  const getSlotList = useCallback(async () => {
    return callApi('/getSlotList');
  }, [callApi]);

  const registerSlot = useCallback(async (slotId, user_id) => {
    return callApi('/registerSlot', {
      method: 'POST',
      body: JSON.stringify({
        Slot_ID: slotId,
        User_ID: user_id
      })
    });
  }, [callApi]);

  const createSlot = useCallback(async (slotData) => {
    return callApi('/createSlot', {
      method: 'POST',
      body: JSON.stringify(slotData)
    });
  }, [callApi]);

  return {
    loading,
    error,
    callApi,
    login,
    register,
    logout,
    getCurrentUser,
    getSlotList,
    registerSlot,
    createSlot,
    isLoggedIn: isLoggedIn(),
    getToken: () => null
  };
};

export default useApi;