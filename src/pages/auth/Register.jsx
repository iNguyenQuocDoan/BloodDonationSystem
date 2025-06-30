import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";


export const RegisterPage = () => {
  const [form, setForm] = useState({
    user_name: "",
    email: "",
    password: "",
    confirm_password: "",
    telephone: "",
    address: "",
    dob: "",
  });
  const { loading, register } = useApi();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate dữ liệu ở đây nếu cần

    try {
      const data = await register({
        email: form.email,
        password: form.password,
        confirm_password: form.confirm_password,
        name: form.user_name, // Đúng tên trường BE yêu cầu
        date_of_birth: form.dob,
      });

      toast.success("Đăng ký thành công! Vui lòng đăng nhập.", {
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.message || "Đăng ký thất bại", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFFFFF] py-8">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-[#D32F2F] py-4">
          Đăng Ký
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[#555555] mb-1">Họ và tên:</label>
            <input
              type="text"
              name="user_name"
              value={form.user_name}
              onChange={handleChange}
              placeholder="Nhập họ và tên của bạn"
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-[#555555] mb-1">Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-[#555555] mb-1">Mật khẩu:</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu của bạn"
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#555555] mb-1">Xác nhận mật khẩu:</label>
            <div className="relative">
              <input
                type="password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu của bạn"
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
          </div>

          {/* <div>
            <label className="block text-[#555555] mb-1">Số điện thoại:</label>
            <input
              type="tel"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại của bạn"
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-[#555555] mb-1">Địa chỉ:</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ của bạn"
              className="w-full px-4 py-2 border rounded"
            />
          </div> */}

          <div>
            <label className="block text-[#555555] mb-1">Ngày sinh:</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#D32F2F] text-white font-semibold rounded transition duration-200"
              disabled={loading}
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </div>
        </form>
        <div className="flex justify-center mt-4">
          <span className="text-[#1F1F1F] mr-[5px]">Đã có tài khoản? </span>
          <Link to="/login" className="block text-[#D32F2F]">
            <span className="hover:underline">Đăng nhập</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
