import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import axios from "axios";
import { RegisterPage } from "./Register";
export const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState({ email: "", password: "" });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };
  const validationForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      console.log("Need email");
      newErrors.email = "Need Email";
    }

    if (!password) {
      console.log("Need pass");
      newErrors.password = "Need Pass";
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validationForm()) {
      return;
    }
    try {
      const response = await axios.post(`http://localhost:3000/api/login`, {
        email,
        password,
      });

      console.log("form", email, password);
      const { data } = response;
      console.log("respone", data);
      if (data.statusCode == 200) {
        console.log("Login Success");
        navigate(RegisterPage);
      } else {
        console.log("Login fail");
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-[#FFFFFF]">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md ">
          <h2 className="text-3xl font-bold text-center text-[#D32F2F]">
            Login
          </h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-[#555555]">Email:</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded"
              />
              {error.email && (
                <div className="text-red-500 text-sm mt-1">{error.email}</div>
              )}
              <label className="block text-[#555555]">Password:</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border rounded"
                />
                {error.password && (
                  <div className="text-red-500 text-sm mt-1">
                    {error.password}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
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
              >
                Login
              </button>
              <Link
                to="/forgot-password"
                className="block text-[#0000EE] hover:underline text-center font-semibold"
              >
                Forgot Pasword?
              </Link>
            </div>
          </form>
          <div className="flex justify-center">
            <span className="text-[#1F1F1F]">Don't have an account? 1</span>{" "}
            <Link to="/register" className="block text-[#D32F2F]">
              <span className="hover:underline"> Register</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
