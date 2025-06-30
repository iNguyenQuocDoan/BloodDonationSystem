import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import useApi from "../../hooks/useApi";

export const LoginPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, login } = useApi(); // Sử dụng custom hook
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Xử lý sau đăng nhập thành công
    try {
      const data = await login({
        email: form.email,
        password: form.password,
      });

      console.log("Login response data:", data);


      // Lưu thông tin người dùng
      localStorage.setItem("isLoggedIn", "true");


      toast.success("Đăng nhập thành công!", {
        position: "top-center",
        autoClose: 2000,
      });

      // Chuẩn hóa role và chờ một chút để đảm bảo localStorage được cập nhật
      const userRole = (data.data.user_role || "").trim().toLowerCase();
      console.log("Normalized role:", userRole);
      
      // Đợi localStorage được cập nhật hoàn toàn trước khi chuyển hướng
      setTimeout(() => {
        if (userRole === "admin") {
          navigate("/admin", { replace: true });
        } else if (userRole === "staff") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }, 300);
    } catch (error) {
      toast.error(error.message || "Đăng nhập thất bại", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFFFFF]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-[#D32F2F] py-6">
          Đăng Nhập
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-[#555555]">Email:</label>
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
          <div className="space-y-2">
            <label className="block text-[#555555]">Mật khẩu:</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu của bạn"
                className="w-full px-4 py-2 border rounded"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                tabIndex={-1}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="text-gray-500 hover:text-gray-700 w-5 h-5" />
                ) : (
                  <AiOutlineEye className="text-gray-500 hover:text-gray-700 w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#D32F2F] text-white font-semibold rounded transition duration-200"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
            <Link
              to="/forgot-password"
              className="block text-[#0000EE] hover:underline text-center font-semibold"
            >
              Quên mật khẩu
            </Link>
          </div>
        </form>
        <div className="flex justify-center mt-4">
          <span className="text-[#1F1F1F] mr-[5px]">Chưa có tài khoản? </span>
          <Link to="/register" className="block text-[#D32F2F]">
            <span className="hover:underline"> Đăng kí</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
