import { useState } from "react";
import { toast } from "react-toastify";

const EmergencyRequest = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    bloodType: "",
    location: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  // Validate phone number (10-11 digits, only numbers)
  const isValidPhone = (phone) => /^0\d{9,10}$/.test(phone);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Họ tên là bắt buộc.";
    if (!form.phone.trim()) newErrors.phone = "Số điện thoại là bắt buộc.";
    else if (!isValidPhone(form.phone))
      newErrors.phone = "Định dạng số điện thoại không hợp lệ.";
    if (!form.bloodType) newErrors.bloodType = "Vui lòng chọn loại máu.";
    if (!form.location.trim()) newErrors.location = "Địa chỉ là bắt buộc.";
    if (!form.message.trim()) newErrors.message = "Tin nhắn là bắt buộc.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Gửi dữ liệu hợp lệ lên server tại đây
    toast.success("Yêu cầu hiến máu khẩn cấp đã được gửi thành công!", {
      position: "top-center",
      autoClose: 3000,
    });

    setForm({
      name: "",
      phone: "",
      bloodType: "",
      location: "",
      message: "",
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8 px-2 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-lg shadow p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#D32F2F] text-center mb-6">
          Yêu cầu hiến máu khẩn cấp
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Họ tên
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nhập họ tên của bạn"
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#D32F2F] ${
                errors.name ? "border-red-500" : ""
              }`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại của bạn"
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#D32F2F] ${
                errors.phone ? "border-red-500" : ""
              }`}
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Loại máu
            </label>
            <select
              name="bloodType"
              value={form.bloodType}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#D32F2F] ${
                errors.bloodType ? "border-red-500" : ""
              }`}
              required
            >
              <option value="">Chọn loại máu</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
            {errors.bloodType && (
              <p className="text-red-500 text-xs mt-1">{errors.bloodType}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Địa chỉ
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Nhập địa chỉ bệnh viện hoặc nơi cần máu"
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#D32F2F] ${
                errors.location ? "border-red-500" : ""
              }`}
              required
            />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Tin nhắn
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Mô tả tình huống khẩn cấp"
              className={`w-full px-3 py-2 border rounded min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] ${
                errors.message ? "border-red-500" : ""
              }`}
              required
            />
            {errors.message && (
              <p className="text-red-500 text-xs mt-1">{errors.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-[#D32F2F] text-white px-6 py-2 rounded font-semibold hover:bg-[#b71c1c] transition"
          >
            Gửi yêu cầu
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmergencyRequest;
