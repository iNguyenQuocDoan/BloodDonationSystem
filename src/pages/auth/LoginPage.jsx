import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { toast } from 'react-toastify';

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ user_id: "", email: "", password: "", role: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        // if(data.token){
        //   localStorage.getItem("token", data.token)
        // }else{
        //   localStorage.getItem("token", "dummy_token")
        // }
        // Lưu thông tin đăng nhậ

        localStorage.setItem("isLoggedIn", "true");

        const userData = {
          // Sử dụng email như ID
          user_id: data.data.user_id || form.user_id,
          user_email: data.user_email || form.email,
          user_name: data.data.user_name || "",
          user_role: data.data.user_role || form.role
        };

        // Lưu thông tin user nếu server trả về
        if (data) {
          localStorage.setItem("user", JSON.stringify(userData));

          // Lưu role nếu có
        }

        // Thông báo popup login thành công với delay 1s
        setTimeout(() => {
          toast.success("Đăng nhập thành công!", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });

          setTimeout(() => {
            if (userData.user_role === "AR002") {
              navigate("/dashboard");
            } else if (userData.user_role === "AR001") {
              navigate("/admin");
            } else {
              navigate("/");
            }
            window.location.reload();
          }, 2000); // Chờ popup biến mất rồi mới chuyển trang
        }, 1000); // Delay 1s trước khi hiện popup
      } else {
        toast.error(data.message || "Sai tài khoản hoặc mật khẩu!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      }
    } catch (err) {
      alert("Cannot connect to server!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFFFFF]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md ">
        <h2 className="text-3xl font-bold text-center text-[#D32F2F]">Login</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-[#555555]">Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <label className="block text-[#555555]">Mật khẩu:</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
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
              {loading ? "Logging in..." : "Login"}
            </button>
            <Link
              to="/forgot-password"
              className="block text-[#0000EE] hover:underline text-center font-semibold"
            >
              Quên mật khẩu
            </Link>
          </div>
        </form>
        <div className="flex justify-center">
          <span className="text-[#1F1F1F] mr-[5px]">Chưa có tài khoản? </span>
          <Link to="/register" className="block text-[#D32F2F]">
            <span className="hover:underline"> Đăng kí</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
