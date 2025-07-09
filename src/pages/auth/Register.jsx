import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";
// import { getCoordinatesFromAddress } from "../../components/CoordinatesFromAddress";

export const RegisterPage = () => {
  const [form, setForm] = useState({
    user_name: "",
    email: "",
    password: "",
    confirm_password: "",
    telephone: "",
    address: "",
    dob: ""
  });
  const [errors, setErrors] = useState({});
  const [coords, setCoords] = useState({ latitude: "", longitude: "" });
  const [addressLoading, setAddressLoading] = useState(false);
  const { loading, register } = useApi();
  const navigate = useNavigate();
  // const [locationReady, setLocationReady] = useState(false)
  // Tính toán ngày tối thiểu và tối đa cho độ tuổi 18-60
  const calculateAgeLimit = () => {
    const today = new Date();
    const maxDate = new Date(); // 18 tuổi
    const minDate = new Date(); // 60 tuổi

    maxDate.setFullYear(today.getFullYear() - 18);
    minDate.setFullYear(today.getFullYear() - 60);

    return {
      min: minDate.toISOString().split("T")[0], // Năm sinh cũ nhất (60 tuổi)
      max: maxDate.toISOString().split("T")[0], // Năm sinh mới nhất (18 tuổi)
    };
  };

  const ageLimit = calculateAgeLimit();

  // Validate độ tuổi
  const validateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Điều chỉnh tuổi nếu chưa đến sinh nhật trong năm
    const actualAge =
      monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ? age - 1
        : age;

    if (actualAge < 18) {
      return "Bạn phải từ 18 tuổi trở lên để đăng ký hiến máu";
    }
    if (actualAge > 60) {
      return "Độ tuổi hiến máu tối đa là 60 tuổi";
    }
    return "";
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Xóa lỗi khi user thay đổi input
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Validate ngày sinh ngay khi thay đổi
    if (name === "dob") {
      const ageError = validateAge(value);
      setErrors({ ...errors, dob: ageError });
    }

    // // Nếu nhập địa chỉ, tự động lấy tọa độ
    // if (name === "address") {
    //   setAddressLoading(true);
    //   setCoords({ latitude: "", longitude: "" });
    //   try {
    //     if (value.length > 5) {
    //       const result = await getCoordinatesFromAddress(value);
    //       setCoords({ latitude: result.latitude, longitude: result.longitude });
    //     }
    //   } catch {
    //     setCoords({ latitude: "", longitude: "" });
    //   }
    //   setAddressLoading(false);
    // }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate dữ liệu
    const newErrors = {};

    // Validate độ tuổi
    const ageError = validateAge(form.dob);
    if (ageError) {
      newErrors.dob = ageError;
    }

    // Validate mật khẩu khớp
    if (form.password !== form.confirm_password) {
      newErrors.confirm_password = "Mật khẩu xác nhận không khớp";
    }

    // Validate các trường bắt buộc
    if (!form.user_name.trim()) {
      newErrors.user_name = "Họ và tên là bắt buộc";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    }
    if (!form.password.trim()) {
      newErrors.password = "Mật khẩu là bắt buộc";
    }
    if (!form.dob) {
      newErrors.dob = "Ngày sinh là bắt buộc";
    }
    // Validate địa chỉ và tọa độ
    if (!form.address.trim()) {
      newErrors.address = "Địa chỉ là bắt buộc";
    }
    if (!coords.latitude || !coords.longitude) {
      newErrors.address = "Không xác định được tọa độ từ địa chỉ";
    }

    // Nếu có lỗi, hiển thị và không submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const data = await register({
        email: form.email,
        password: form.password,
        confirm_password: form.confirm_password,
        name: form.user_name,
        name: form.user_name,
        date_of_birth: form.dob,
        phone: form.telephone,
        address: form.address,
        // // Gộp thành chuỗi "latitude,longitude"
        // location: `${coords.latitude},${coords.longitude}`
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

  // Sau khi lấy được tọa độ từ địa chỉ:
  // useEffect(() => {
  //   if (coords.latitude && coords.longitude) {
  //     setLocationReady(true);
  //   } else {
  //     setLocationReady(false);
  //   }
  // }, [coords]);

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
              className={`w-full px-4 py-2 border rounded ${errors.user_name ? "border-red-500" : ""
                }`}
              required
            />
            {errors.user_name && (
              <p className="text-red-500 text-sm mt-1">{errors.user_name}</p>
            )}
          </div>

          <div>
            <label className="block text-[#555555] mb-1">Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              className={`w-full px-4 py-2 border rounded ${errors.email ? "border-red-500" : ""
                }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
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
                className={`w-full px-4 py-2 border rounded ${errors.password ? "border-red-500" : ""
                  }`}
                required
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
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
                className={`w-full px-4 py-2 border rounded ${errors.confirm_password ? "border-red-500" : ""
                  }`}
                required
              />
            </div>
            {errors.confirm_password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirm_password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[#555555] mb-1">Ngày sinh:</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              min={ageLimit.min}
              max={ageLimit.max}
              className={`w-full px-4 py-2 border rounded ${errors.dob ? "border-red-500" : ""
                }`}
              required
            />
            <p className="text-gray-500 text-xs mt-1">
              Độ tuổi hiến máu: từ 18 đến 60 tuổi
            </p>
            {errors.dob && (
              <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
            )}
          </div>

          <div>
            <label className="block text-[#555555] mb-1">Địa chỉ:</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ của bạn"
              className={`w-full px-4 py-2 border rounded ${errors.address ? "border-red-500" : ""}`}
              required
            />
            {addressLoading && (
              <p className="text-blue-500 text-xs">Đang xác định tọa độ...</p>
            )}
            {!addressLoading && coords.latitude && coords.longitude && (
              <>
                <p className="text-green-600 text-xs">
                  Tọa độ: {coords.latitude}, {coords.longitude}
                </p>
                <div style={{ color: "green", marginTop: 4 }}>
                  Đã lấy được vị trí từ địa chỉ!
                </div>
              </>
            )}
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#D32F2F] text-white font-semibold rounded transition duration-200 disabled:bg-gray-400"
              // disabled={!locationReady || loading}
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
