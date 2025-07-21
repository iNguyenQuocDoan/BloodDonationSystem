import { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const bloodTypeMapping = {
  "A+": "BT001", "A-": "BT002", "B+": "BT003", "B-": "BT004",
  "AB+": "BT005", "AB-": "BT006", "O+": "BT007", "O-": "BT008"
};
const bloodTypes = Object.keys(bloodTypeMapping);

const RoleManagement = () => {
  const { getAllUsers, banUser, unbanUser, createStaffAccount } = useApi();
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState(""); // "ban" hoặc "unban"
  const [selectedId, setSelectedId] = useState(null);

  // Modal tạo staff
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm_password: "",
    name: "",
    bloodType: "",
    date_of_birth: "",
  });
  const [errors, setErrors] = useState({});
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchStaffs = async () => {
    setLoading(true);
    const res = await getAllUsers();
    const staffList = (res.data || res).filter(
      u => u.User_Role === "staff" || u.User_Role === "member"
    );
    setStaffs(staffList);
    setLoading(false);
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  const handleBan = (userId) => {
    setSelectedId(userId);
    setActionType("ban");
    setShowConfirm(true);
  };

  const handleUnban = (userId) => {
    setSelectedId(userId);
    setActionType("unban");
    setShowConfirm(true);
  };

  const confirmAction = async () => {
    if (actionType === "ban") {
      await banUser(selectedId);
      toast.success("Khóa tài khoản thành công!");
    } else {
      await unbanUser(selectedId);
      toast.success("Mở khóa tài khoản thành công!");
    }
    setShowConfirm(false);
    setSelectedId(null);
    setActionType("");
    fetchStaffs();
  };

  // Tính toán ngày tối thiểu và tối đa cho độ tuổi 18-60
  const calculateAgeLimit = () => {
    const today = new Date();
    const maxDate = new Date();
    const minDate = new Date();
    maxDate.setFullYear(today.getFullYear() - 18);
    minDate.setFullYear(today.getFullYear() - 60);
    return {
      min: minDate.toISOString().split("T")[0],
      max: maxDate.toISOString().split("T")[0],
    };
  };
  const ageLimit = calculateAgeLimit();

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const validateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const actualAge =
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ? age - 1
        : age;
    if (actualAge < 18 || actualAge > 60) {
    return "Phải nhập trên 18 tuổi"; 
  }
    return "";
  };

  // Validate giống trang Register
  const validateForm = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email là bắt buộc";
    if (!form.password.trim()) newErrors.password = "Mật khẩu là bắt buộc";
    else if (!passwordRegex.test(form.password))
      newErrors.password =
        "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
    if (form.password !== form.confirm_password)
      newErrors.confirm_password = "Mật khẩu xác nhận không khớp";
    if (!form.name.trim()) newErrors.name = "Họ và tên là bắt buộc";
    if (!form.bloodType) newErrors.bloodType = "Vui lòng chọn nhóm máu";
    if (!form.date_of_birth) newErrors.date_of_birth = "Ngày sinh là bắt buộc";
    const ageError = validateAge(form.date_of_birth);
    if (ageError) newErrors.date_of_birth = ageError;
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (name === "date_of_birth") {
      const ageError = validateAge(value);
      setErrors({ ...errors, date_of_birth: ageError });
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setCreating(true);
    try {
      await createStaffAccount({
        email: form.email,
        password: form.password,
        confirm_password: form.confirm_password,
        name: form.name,
        date_of_birth: form.date_of_birth,
        bloodType_id: bloodTypeMapping[form.bloodType]
      });
      toast.success("Tạo tài khoản staff thành công!");
      setShowCreateModal(false);
      setForm({
        email: "",
        password: "",
        confirm_password: "",
        name: "",
        bloodType: "",
        date_of_birth: "",
      });
      fetchStaffs();
    } catch (error) {
      toast.error(error.message || "Tạo tài khoản thất bại!");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h2 className="text-xl font-bold text-blue-600 mb-6">Quản lý tài khoản Staff</h2>
      <button
        className="mb-4 px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        onClick={() => setShowCreateModal(true)}
      >
        + Tạo tài khoản staff
      </button>
      <div className="bg-white shadow-md rounded overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Tên</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">SĐT</th>
              <th className="px-4 py-2">Giới tính</th>
              <th className="px-4 py-2">Năm sinh</th>
              <th className="px-4 py-2">Vai trò</th>
              <th className="px-4 py-2">Loại máu</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-500">Đang tải...</td>
              </tr>
            ) : staffs.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-500">Không có staff nào.</td>
              </tr>
            ) : (
              staffs.map((user) => (
                <tr key={user.User_ID} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{user.User_Name}</td>
                  <td className="px-4 py-2">{user.Email}</td>
                  <td className="px-4 py-2">{user.Phone}</td>
                  <td className="px-4 py-2">{user.Gender === "M" ? "Nam" : user.Gender === "F" ? "Nữ" : "—"}</td>
                  <td className="px-4 py-2">
                    {user.YOB
                      ? (() => {
                          const date = new Date(user.YOB);
                          const day = String(date.getDate()).padStart(2, "0");
                          const month = String(date.getMonth() + 1).padStart(2, "0");
                          const year = date.getFullYear();
                          return `${day}/${month}/${year}`;
                        })()
                      : "—"}
                  </td>
                  <td className="px-4 py-2">{user.User_Role === "staff" ? "Nhân viên" : "Thành viên"}</td>
                  <td className="px-4 py-2">
                    {user.BloodGroup || "—"}
                  </td>
                  <td className="px-4 py-2">
                    {user.isDelete === "1" || user.isDelete === true
                      ? <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">Đang mở khóa</span>
                      : <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs">Đã khóa</span>
                    }
                  </td>
                  <td className="px-4 py-2 text-center">
                    {user.isDelete === "1" || user.isDelete === true ? (
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                        onClick={() => handleBan(user.User_ID)}
                      >
                        Khóa tài khoản
                      </button>
                    ) : (
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                        onClick={() => handleUnban(user.User_ID)}
                      >
                        Mở khóa
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal tạo staff */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 min-w-[340px] max-w-sm w-full relative border-2 border-blue-300">
            <h2 className="text-lg font-bold text-blue-600 mb-4 text-center">Tạo tài khoản staff</h2>
            <form className="space-y-4" onSubmit={handleCreateStaff}>
              <div>
                <label className="block font-medium mb-1">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block font-medium mb-1">Mật khẩu:</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded ${errors.password ? "border-red-500" : "border-gray-300"}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
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
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block font-medium mb-1">Xác nhận mật khẩu:</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    value={form.confirm_password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded ${errors.confirm_password ? "border-red-500" : "border-gray-300"}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <AiOutlineEyeInvisible className="text-gray-500 hover:text-gray-700 w-5 h-5" />
                    ) : (
                      <AiOutlineEye className="text-gray-500 hover:text-gray-700 w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>}
              </div>
              <div>
                <label className="block font-medium mb-1">Họ và tên:</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  required
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block font-medium mb-1">Nhóm máu:</label>
                <select
                  name="bloodType"
                  value={form.bloodType}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded ${errors.bloodType ? "border-red-500" : "border-gray-300"}`}
                  required
                >
                  <option value="">-- Chọn nhóm máu --</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.bloodType && <p className="text-red-500 text-xs mt-1">{errors.bloodType}</p>}
              </div>
              <div>
                <label className="block font-medium mb-1">Ngày sinh:</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={form.date_of_birth || ""}
                  onChange={handleChange}
                  min={ageLimit.min}
                  max={ageLimit.max}
                  className={`w-full px-3 py-2 border rounded ${errors.date_of_birth ? "border-red-500" : "border-gray-300"}`}
                  required
                />
                <p className="text-gray-500 text-xs mt-1">Độ tuổi: từ 18 đến 60</p>
                {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  disabled={creating}
                >
                  {creating ? "Đang tạo..." : "Tạo tài khoản"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal xác nhận khóa/mở khóa */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 min-w-[340px] max-w-sm w-full relative border-2 border-blue-300">
            <h2 className="text-lg font-bold text-blue-600 mb-4 text-center">
              {actionType === "ban" ? "Xác nhận khóa tài khoản" : "Xác nhận mở khóa tài khoản"}
            </h2>
            <p className="mb-6 text-center text-gray-700">
              {actionType === "ban"
                ? "Bạn có chắc chắn muốn khóa tài khoản này không?"
                : "Bạn có chắc chắn muốn mở khóa tài khoản này không?"}
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowConfirm(false)}
              >
                Đóng
              </button>
              <button
                className={`px-4 py-2 rounded text-white font-semibold ${
                  actionType === "ban"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                onClick={confirmAction}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
