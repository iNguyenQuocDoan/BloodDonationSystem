import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const DonateBlood = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  
  const fetchSlots = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/getSlotList');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      // Xử lý dữ liệu trả về từ API
      if (data && data.status) {
        // Chỉnh sửa để phù hợp với cấu trúc API response
        setSlots(data.data || []);
        setLastUpdated(new Date());
      } else {
        setError(data.message || 'Không thể lấy dữ liệu');
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      setError('Lỗi khi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (slotId) => {
    // Kiểm tra đăng nhập
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập để đăng ký hiến máu');
      navigate('/login');
      return;
    }
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('Registering slot with data:', {
        Slot_ID: slotId,
        User_ID: user.user_id || user.id
      });
      
      const response = await fetch('http://localhost:3000/api/registerSlot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Slot_ID: slotId,
          User_ID: user.user_id || user.id,
        })
      });
      
      const data = await response.json();
      console.log('Register response:', data);
      
      if (data.status) {
        alert('Đăng ký hiến máu thành công!');
        fetchSlots(); // Tải lại dữ liệu sau khi đăng ký
      } else {
        alert(data.message || 'Đăng ký không thành công');
      }
    } catch (error) {
      console.error('Error registering slot:', error);
      alert('Có lỗi xảy ra khi đăng ký: ' + error.message);
    }
  };

  useEffect(() => {
    // Fetch data immediately when component mounts
    fetchSlots();
    
    // Set up interval to fetch data every 30 seconds
    intervalRef.current = setInterval(() => {
      fetchSlots();
    }, 30000);
    
    // Clear interval when component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Kiểm tra nếu slots là undefined hoặc null
  const safeSlots = Array.isArray(slots) ? slots : [];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl text-center font-bold text-red-600 mb-8">Danh sách ca hiến máu</h2>
      <p className="text-center text-sm text-gray-500 mb-4">
        Cập nhật lần cuối: {lastUpdated.toLocaleTimeString()}
      </p>
      
      {loading && (
        <div className="text-center py-8">Đang tải dữ liệu...</div>
      )}
      
      {error && (
        <div className="text-center text-red-500 py-8">
          {error}
          <button 
            className="ml-4 px-4 py-1 bg-red-600 text-white rounded"
            onClick={fetchSlots}
          >
            Thử lại
          </button>
        </div>
      )}
      
      {!loading && !error && safeSlots.length === 0 && (
        <div className="text-center py-8">Hiện tại không có ca hiến máu nào</div>
      )}
      
      {!loading && !error && safeSlots.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {safeSlots.map((slot, index) => {
            // Sử dụng optional chaining và các phương pháp phòng trạng thái null
            const volume = parseInt(slot?.volume || 0);
            const maxVolume = parseInt(slot?.max_volume || 1);
            const percentage = Math.round((volume / maxVolume) * 100) || 0;
            const isFull = volume >= maxVolume;
            
            // Chuyển đổi ngày và thời gian
            let formattedDate = "N/A";
            try {
              if (slot?.slot_date) {
                formattedDate = new Date(slot.slot_date).toLocaleDateString('vi-VN');
              }
            } catch (e) {
              console.error("Error formatting date:", e);
            }
            
            const startTime = slot?.start_time?.substring(0, 5) || "N/A";
            const endTime = slot?.end_time?.substring(0, 5) || "N/A";
            
            return (
              <div key={slot?.slot_id || index} className="bg-white rounded-lg shadow-md p-5">
                <h3 className="text-lg font-medium text-red-600 mb-3">
                  {formattedDate}
                </h3>
                <p className="text-gray-600 mb-1">
                  {startTime} - {endTime}
                </p>
                <p className="text-gray-600 text-sm mb-3">
                  Đã đăng ký: {volume}/{maxVolume}
                </p>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className={`h-2 rounded-full ${
                      percentage >= 80 ? 'bg-red-500' : 'bg-green-500'
                    }`} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                
                <button 
                  className={`w-full py-2 rounded-md font-medium text-white ${
                    isFull 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700 transition duration-200'
                  }`}
                  onClick={() => !isFull && handleRegister(slot?.slot_id)}
                  disabled={isFull}
                >
                  {isFull ? "Đã đầy" : "Đăng ký"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DonateBlood;
