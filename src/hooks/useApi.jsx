import { useState, useCallback, useEffect } from 'react';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const BASE_URL = "/api";

  // Auth utilities
  const isLoggedIn = useCallback(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  }, []);

  const clearAuthData = useCallback(() => {
    localStorage.removeItem("isLoggedIn");


  }, []);

  // Main API caller
  const callApi = useCallback(async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        ...options
      });

      console.log('API response status:', response.status);

      // Xử lý 401 - Authentication error
      if (response.status === 401) {
        if (window.location.pathname !== '/login') {
          clearAuthData();
          setTimeout(() => {
            window.location.href = '/login';
          }, 100);
        }
        throw new Error('Session expired');
      }

      const data = await response.json();
      console.log('API response data:', data); // Debug log

      // Xử lý response không thành công (400, 500, etc.)
      if (!response.ok) {
        // Ưu tiên message từ server response
        const errorMessage = data.message || data.error || `HTTP Error: ${response.status}`;
        throw new Error(errorMessage);
      }

      // Xử lý trường hợp server trả về success: false
      if (data.status === false && data.message) {
        throw new Error(data.message);
      }

      return data;
    } catch (err) {
      const errorMessage = err.message || 'API call failed';
      setError(errorMessage);
      console.error(`API Error [${endpoint}]:`, errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearAuthData]);

  // Auth APIs
  const login = useCallback(async (credentials) => {
    const result = await callApi('/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    if (result.status) {


      localStorage.setItem("isLoggedIn", "true");

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

  const registerSlot = useCallback(async (slotId, user_id, extraData = {}) => {
    return callApi('/registerSlot', {
      method: 'POST',
      body: JSON.stringify({
        Slot_ID: slotId,
        User_ID: user_id,
        ...extraData
      })
    });
  }, [callApi]);

  const createSlot = useCallback(async (slotData) => {
    return callApi('/createSlot', {
      method: 'POST',
      body: JSON.stringify(slotData)
    });
  }, [callApi]);

  const updateUser = useCallback(async (userData) => {
    return callApi('//profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }, [callApi]);

  const getBloodTypes = useCallback(async () => {
    return callApi('/bloodtypes');
  }, [callApi]);

  const getAppointments = useCallback(async () => {
    return callApi('/getAppointmentList');
  }, [callApi]);

  const addAppointmentVolume = useCallback(async (appointmentId, volume) => {
    return callApi(`/appointment/${appointmentId}/addVolume`, {
      method: 'POST',
      body: JSON.stringify({ volume })
    });
  }, [callApi]);

  //Emergency Request API
  const addEmergencyRequest = useCallback(async (requestData) => {
    return callApi('/addEmergencyRequest', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  }, [callApi]);

  // Thêm API gọi addPatientDetail (BE: POST /appointment/:appointmentId/addPatient)
  const addPatientDetail = useCallback(async (appointmentId, description, status) => {
    return callApi(`/patientDetail/${appointmentId}/patient`, {
      method: 'POST',
      body: JSON.stringify({ description, status })
    });
  }, [callApi]);

  const confirmBloodTypeByStaff = useCallback(async (userId, bloodType) => {
    return callApi(`/users/${userId}/confirmBloodTypeByStaff`, {
      method: 'PUT',
      body: JSON.stringify({ bloodType })
    });
  }, [callApi]);

  const updateStatusAppointmentByStaff = useCallback(async (appointmentId, newStatus) => {
    return callApi(`/appointment/${appointmentId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ newStatus })
    })
  }, [callApi]);

  const rejectAppointment = useCallback(async (appointmentId, reasonReject) => {
    return callApi(`/appointment/${appointmentId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reasonReject })
    })
  }, [callApi]);

  const historyAppointmentsByUser = useCallback(async () => {
    return callApi(`/appointment/details`)
  }, [callApi])

  const historyPatientByUser = useCallback(async (appointmentId) => {
    return callApi(`/patientDetail/${appointmentId}`)
  }, [callApi])
  const updatePatientByStaff = useCallback(async (appointmentId, description, status) => {
    return callApi(`/patientDetail/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify({ description, status })
    })
  }, [callApi])

  const cancelAppointmentByUser = useCallback(async (appointmentId) => {
    return callApi(`/appointment/${appointmentId}/cancelByMember`, {
      method: 'PUT'
    })
  }, [callApi])
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
    updateUser,
    getBloodTypes,
    getAppointments,
    isLoggedIn: isLoggedIn(),
    addAppointmentVolume,
    addEmergencyRequest,
    addPatientDetail,
    confirmBloodTypeByStaff,
    updateStatusAppointmentByStaff,
    rejectAppointment,
    historyAppointmentsByUser,
    historyPatientByUser,
    updatePatientByStaff,
    cancelAppointmentByUser
  };
};

export default useApi;