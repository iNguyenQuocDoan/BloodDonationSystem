import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
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

      
        // Lưu thông tin user nếu server trả về
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          // Lưu role nếu có
          if (data.user.role) {
            localStorage.setItem("userRole", data.user.role);
          }
        }


        navigate("/");
        window.location.reload();
      } else {
        console.log();
        alert(data.message || "Login failed!");
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
