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
      const res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        // Save token or flag to localStorage for login status
        if (data.token) {
          localStorage.setItem("token", data.token);
        } else {
          // If backend does not return token, set a dummy token for demo
          localStorage.setItem("token", "dummy_token");
        }
        navigate("/");
        window.location.reload();
      } else {
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
            <label className="block text-[#555555]">Password:</label>
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
              Forgot Password?
            </Link>
          </div>
        </form>
        <div className="flex justify-center">
          <span className="text-[#1F1F1F] mr-[5px]">
            Don't have an account?{" "}
          </span>
          <Link to="/register" className="block text-[#D32F2F]">
            <span className="hover:underline"> Register</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
