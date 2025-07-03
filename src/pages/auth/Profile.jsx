import { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";

const ProfilePage = () => {
  const { getCurrentUser } = useApi();
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, [getCurrentUser]);

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

        {/* <Field
          label="Cho hồng cầu được"
          value={user.rbc_compatible_to || "Chưa xác định"}
        /> */}

        {/*  */}
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
          <button className="bg-[#D32F2F] text-white px-6 py-2 rounded shadow hover:bg-red-700 transition">
            Chỉnh sửa hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
