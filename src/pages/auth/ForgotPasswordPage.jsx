import { Link } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
const ForgotPasswordPage = () => {
  return (
    <>
      <div className="min-h-screen bg-[#FFFFFF] flex">
        {/* Left side - Image */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-50 to-red-100 items-center justify-center p-8 relative overflow-hidden">
          {/* Background image with overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{
              backgroundImage: "url('/public/image/bloodActivity.png')",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-red-100/80 to-red-50/90"></div>

          {/* Content */}
          <div className="max-w-lg text-center relative z-10">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-red-100">
              <img
                src="/public/image/bloodActivity.png"
                alt="Blood Donation"
                className="w-full h-auto mb-6 rounded-lg shadow-lg"
              />
              <h3 className="text-2xl font-bold text-[#D32F2F] mb-4">
                Hiến máu cứu người
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Mỗi giọt máu hiến tặng là một cơ hội cứu sống. Hãy tham gia cùng
                chúng tôi trong hành trình ý nghĩa này.
              </p>

              {/* Additional decorative elements */}
              <div className="flex justify-center mt-6 space-x-4">
                <div className="w-3 h-3 bg-[#D32F2F] rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-3 h-3 bg-red-300 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white relative">
          {/* Subtle background pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D32F2F' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          <div className="w-full max-w-md relative z-10">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D32F2F] to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-[#D32F2F]">
                  Quên mật khẩu
                </h2>
                <p className="text-gray-600 mt-2">
                  Đừng lo, chúng tôi sẽ giúp bạn khôi phục!
                </p>
              </div>
              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[#555555] font-medium">
                    Nhập email đã đăng ký
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="Nhập email của bạn"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Chúng tôi sẽ gửi link khôi phục mật khẩu đến email này
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#D32F2F] to-red-600 text-white font-semibold rounded-xl transition-all duration-200 hover:from-red-600 hover:to-red-700 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Gửi yêu cầu khôi phục
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 text-[#D32F2F] hover:text-red-600 font-medium hover:underline transition-all duration-200 group"
                >
                  <GoArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform duration-200" />
                  <span>Quay lại trang đăng nhập</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
