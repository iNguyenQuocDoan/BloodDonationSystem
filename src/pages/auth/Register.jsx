import { useState } from "react";
import { Link } from "react-router-dom";

export const RegisterPage = () => {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    phone: "",
  });
  const [phoneError, setPhoneError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "phone") {
      setPhoneError("");
    }
  };

  const validatePhone = (phone) => {
    return /^0\d{9}$/.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePhone(form.phone)) {
      setPhoneError("Phone number must start with 0 and be exactly 10 digits.");
      return;
    }
    if (form.fullname && form.email && form.password && form.phone) {
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFFFFF]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-[#D32F2F] mb-6">
          Register
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[#555555] mb-1">Full Name:</label>
            <input
              type="text"
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-3 py-2 border rounded"
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
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-[#555555] mb-1">Password:</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-[#555555] mb-1">Phone Number:</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className={`w-full px-3 py-2 border rounded ${
                phoneError ? "border-red-500" : ""
              }`}
              required
            />
            {phoneError && (
              <p className="text-red-500 text-sm mt-1">{phoneError}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#D32F2F] text-white font-semibold rounded mt-2 transition duration-200"
          >
            Register
          </button>
        </form>
        <Link to="/login" className="block text-center text-black mt-4 text-sm">
          Already have an account?{" "}
          <span className="hover:underline text-[#D32F2F]">Login</span>
        </Link>
      </div>
    </div>
  );
};
