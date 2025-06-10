import { useState } from "react";

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
    if (!form.name.trim()) newErrors.name = "Full name is required.";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!isValidPhone(form.phone))
      newErrors.phone = "Invalid phone number format.";
    if (!form.bloodType) newErrors.bloodType = "Please select a blood type.";
    if (!form.location.trim()) newErrors.location = "Location is required.";
    if (!form.message.trim()) newErrors.message = "Message is required.";
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
    alert("Your emergency request has been sent!");
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
              placeholder="Enter your full name"
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
              placeholder="Enter your phone number"
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
              placeholder="Enter hospital or address"
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
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Describe the emergency situation"
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
            Send Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmergencyRequest;
