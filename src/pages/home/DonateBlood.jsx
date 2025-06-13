import { useState, useEffect } from 'react';

const DonateBlood = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/slots');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.status && data.data?.slots) {
          setSlots(data.data.slots);
        } else {
          setError('Định dạng dữ liệu không đúng');
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
        setError('Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const handleRegister = (slotId) => {
    console.log('Đăng ký slot:', slotId);
    // Xử lý đăng ký hiến máu
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-600 border-t-transparent"></div>
          <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl text-center font-bold text-red-600 mb-8">Danh sách ca hiến máu</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {slots.map((slot, index) => {
          const percentage = Math.round((slot.volume / slot.max_volume) * 100);
          const isFull = slot.is_full || percentage >= 100;
          
          return (
            <div key={slot.slot_id || index} className="bg-white rounded-lg shadow-md p-5">
              <h3 className="text-lg font-medium text-red-600 mb-3">
                Ca {index + 1}: {slot.start_time} - {slot.end_time}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Đã đăng ký: {slot.volume}/{slot.max_volume}
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
                onClick={() => !isFull && handleRegister(slot.slot_id)}
                disabled={isFull}
              >
                {isFull ? "Đã đầy" : "Đăng ký"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DonateBlood;
