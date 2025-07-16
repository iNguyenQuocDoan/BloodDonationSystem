import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import useApi from "../../hooks/useApi";

export const LoginPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
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
      if (data.data && data.data.token) {
        localStorage.setItem("token", data.data.token);
      }

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
    <div className="min-h-screen bg-[#FFFFFF] flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-50 to-red-100 items-center justify-center p-8 relative overflow-hidden">
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('/public/image/bloodActivity.png')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-red-100/80 to-red-50/90"></div>

        {/* Content */}
        <div className="max-w-lg text-center relative z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-red-100">
            <img
              src="/public/image/lr.png"
              alt="Blood Donation"
              className="w-full h-auto mb-6 rounded-lg shadow-lg"
            />
            <h3 className="text-2xl font-bold text-[#D32F2F] mb-4">
              Hiến máu cứu người
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Mỗi giọt máu hiến tặng là một cơ hội cứu sống. Hãy tham gia cùng
              chúng tôi trong hành trình ý nghĩa này.
            </p>

            {/* Additional decorative elements */}
            <div className="flex justify-center mt-6 space-x-4">
              <div className="w-3 h-3 bg-[#D32F2F] rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-3 h-3 bg-red-300 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white relative">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D32F2F' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#D32F2F] to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-[#D32F2F]">Đăng Nhập</h2>
              <p className="text-gray-600 mt-2">Chào mừng bạn trở lại!</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-[#555555] font-medium">
                  Email:
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Nhập email của bạn"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[#555555] font-medium">
                  Mật khẩu:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu của bạn"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-gray-100 rounded-r-xl transition-colors duration-200"
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
              <div className="space-y-4">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#D32F2F] to-red-600 text-white font-semibold rounded-xl transition-all duration-200 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang đăng nhập...
                    </div>
                  ) : (
                    "Đăng nhập"
                  )}
                </button>
                <Link
                  to="/forgot-password"
                  className="block text-[#D32F2F] hover:text-red-600 text-center font-medium hover:underline transition-colors duration-200"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </form>
            <div className="flex justify-center mt-6 pt-6 border-t border-gray-100">
              <span className="text-gray-600 mr-2">Chưa có tài khoản?</span>
              <Link
                to="/register"
                className="text-[#D32F2F] hover:text-red-600 font-medium hover:underline transition-colors duration-200"
              >
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
