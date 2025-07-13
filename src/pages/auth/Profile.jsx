import { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { getCurrentUser, updateUser } = useApi();
  const [user, setUser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    User_Name: "",
    date_of_birth: "",
    Phone: "",
    Gender: "",
    Address: "", // thêm dòng này
  });

  useEffect(() => {
    getCurrentUser()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, [getCurrentUser]);

  const handleEditClick = () => {
    setEditForm({
      User_Name: user.user_name || "",
      date_of_birth: user.date_of_birth || "",
      Phone: user.phone || "",
      Gender: user.gender || "",
      Address: user.address || "", // thêm dòng này
    });
    setShowEdit(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Validate ngày sinh: 18 <= tuổi <= 60
    if (editForm.date_of_birth) {
      const today = new Date();
      const birthDate = new Date(editForm.date_of_birth);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const actualAge =
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ? age - 1
          : age;
      if (actualAge < 18) {
        toast.error("Bạn phải từ 18 tuổi trở lên để đăng ký hiến máu");
        return;
      }
      if (actualAge > 60) {
        toast.error("Độ tuổi hiến máu tối đa là 60 tuổi");
        return;
      }
    }

    // Regex: Số nhà, tên đường, Xã/Phường, Thành phố (ít nhất 4 phần, cách nhau bởi dấu phẩy)
    const addressPattern = /^([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+)$/;
    if (!addressPattern.test(editForm.Address)) {
      toast.error(
        "Địa chỉ phải theo định dạng: Số nhà, tên đường, Xã/Phường, Thành phố"
      );
      return;
    }

    try {
      await updateUser({
        ...editForm,
        YOB: editForm.date_of_birth, // Gửi YOB thay cho date_of_birth
      });
      toast.success("Cập nhật hồ sơ thành công!");
      setShowEdit(false);
      // Reload lại user info
      const res = await getCurrentUser();
      setUser(res.data);
    } catch (err) {
      toast.error(err.message || "Cập nhật thất bại!");
    }
  };

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

  if (!user)
    return <div className="text-center py-8">Đang tải thông tin...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 shadow-lg rounded-lg overflow-hidden bg-white">
      <div className="bg-[#D32F2F] p-8 flex flex-col items-center relative">
        <h2 className="text-3xl font-bold text-white mb-2">{user.user_name}</h2>
        <p className="text-white mb-4">
          Nhóm máu: {user.blood_group || "Chưa cập nhật"}
        </p>
        <p className="text-white mb-4">
          Tương thích truyền máu đến:{" "}
          {user.rbc_compatible_to || "Chưa cập nhật"}
        </p>
      </div>
      <div className="pt-20 pb-8 px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-[#D32F2F] font-semibold mb-1">Email</div>
            <div className="text-gray-700">{user.email}</div>
          </div>
          <div>
            <div className="text-[#D32F2F] font-semibold mb-1">
              Số điện thoại
            </div>
            <div className="text-gray-700">{user.phone || "Chưa cập nhật"}</div>
          </div>
          <div>
            <div className="text-[#D32F2F] font-semibold mb-1">Địa chỉ</div>

            <div className="text-gray-700">
              {user.address || "Chưa cập nhật"}
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <div className="text-[#D32F2F] font-semibold mb-1">Ngày sinh</div>
          <div className="text-gray-700">
            {user.date_of_birth || "Chưa cập nhật"}
          </div>
        </div>
        <div className="mt-8 flex justify-start">
          <button
            className="bg-[#D32F2F] text-white px-6 py-2 rounded shadow hover:bg-red-700 transition"
            onClick={handleEditClick}
          >
            Chỉnh sửa hồ sơ
          </button>
        </div>
      </div>

      {/* Popup chỉnh sửa */}
      {showEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <form
            className="bg-white p-6 rounded shadow-lg w-96"
            onSubmit={handleEditSubmit}
          >
            <h2 className="text-lg font-semibold mb-4 text-center text-[#D32F2F]">
              Chỉnh sửa hồ sơ
            </h2>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Họ tên</label>
              <input
                type="text"
                name="User_Name"
                value={editForm.User_Name}
                onChange={handleEditChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Ngày sinh</label>
              <input
                type="date"
                name="date_of_birth"
                value={editForm.date_of_birth}
                onChange={handleEditChange}
                min={ageLimit.min}
                max={ageLimit.max}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Số điện thoại</label>
              <input
                type="text"
                name="Phone"
                value={editForm.Phone}
                onChange={handleEditChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Giới tính</label>
              <select
                name="Gender"
                value={editForm.Gender}
                onChange={handleEditChange}
                className="w-full border rounded p-2"
              >
                <option value="">-- Chọn giới tính --</option>
                <option value="M">Nam</option>
                <option value="F">Nữ</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Địa chỉ</label>

              <input
                type="text"
                name="Address"
                value={editForm.Address}
                onChange={handleEditChange}
                className="w-full border rounded p-2"
              />
              <div className="text-xs text-gray-400 mb-1">
                Số nhà, tên đường, Xã/Phường, Thành phố
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowEdit(false)}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#D32F2F] text-white rounded"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
