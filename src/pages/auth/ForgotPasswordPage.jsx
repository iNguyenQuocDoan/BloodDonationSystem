import { Link } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
const ForgotPasswordPage = () => {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-[#FFFFFF]">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center text-[#D32F2F] py-6">
            Quên mật khẩu
          </h2>
          <form className="space-y-5">
            <div className="space-y-2">
              <label className="block text-[#555555]">
                Nhập tài email đã đăng kí
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#D32F2F] text-white font-semibold rounded transition duration-200"
            >
              Gửi yêu cầu
            </button>
          </form>

          <Link
            to="/login"
            className="block text-[#555555] text-center pt-4 hover:underline"
          >
            <div className="flex items-center justify-center gap-2">
              <GoArrowLeft className="text-xl" />
              <span>Quay lại trang Login</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
