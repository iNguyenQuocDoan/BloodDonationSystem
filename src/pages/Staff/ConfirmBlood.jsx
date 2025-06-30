import { useState } from "react";
import { Link } from "react-router-dom";

const ConfirmBloodPage = () => {
  const [confirmList, setconfirmList] = useState([
    {
      id: "U001",
      name: "Nguyễn Văn A",
      bloodType: "O",
    },
    {
      id: "U002",
      name: "Trần Thị B",
      bloodType: "A",
    },
  ]);
  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-center text-[#D32F2F] mb-6">
          Xác nhận nhóm máu người dùng
        </h1>
        <div className="bg-white shadow-md rounded overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-[#F1F1F1]">
              <th className="px-4 py-3 text-left text-[#D32F2F]">ID</th>
              <th className="px-4 py-3 text-left text-[#D32F2F]">Người dùng</th>
              <th className="px-4 py-3 text-left text-[#D32F2F]">Khai báo</th>
              <th className="px-4 py-3 text-left text-[#D32F2F]">Xác thực</th>
              <th className="px-4 py-3 text-left text-[#D32F2F]">Hành Động</th>
            </thead>
            <tbody className="border-t">
              {confirmList.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.bloodType}</td>
                  <td className="px-4 py-3">
                    <select
                      defaultValue={item.bloodType}
                      className="appearance-none pr-6 py-[0.02rem] rounded border border-gray-300 bg-white"
                    >
                      <option>A</option>
                      <option>O</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 gap-x-2">
                    <button className="bg-[#D32F2F] text-white px-4 py-1 rounded ">
                      Xác nhận
                    </button>
                    <button className="bg-[#D32F2F] text-white px-4 py-1 rounded">
                      Từ chối
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default ConfirmBloodPage;
