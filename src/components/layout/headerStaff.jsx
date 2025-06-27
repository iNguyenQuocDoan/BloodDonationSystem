import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";

const HeaderStaff = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("isLoggedIn");
  const dropdownRef = useRef(null);
  const { getCurrentUser, logout } = useApi();

  useEffect(() => {
    if (isLoggedIn) {
      getCurrentUser()
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [isLoggedIn, getCurrentUser]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const role = user?.user_role;

  return (
    <>
      <div className="w-full bg-[#E57373]">
        <div
          className="container mx-auto h-[30px] flex justify-center items-center
                  text-[12px] sm:text-[14px] md:text-[16px] text-white"
        >
          Quản lý nhân viên Đại việt Blood
        </div>
      </div>

      <header className="w-full bg-white shadow">
        <div className="mx-auto">
          <div className="flex justify-between items-center px-[20px] py-[8px]">
            <a
              href="/"
              className="font-[900] text-[#D32F2F] xl:text-[31px] lg:text-[27px] md:text-[23px] text-[22px]"
            >
              DaiVietBlood
            </a>

            <nav className="hidden md:flex ">
              <ul className="flex flex-1 xl:gap-x-[24px] lg:gap-x-[15px] gap-x-[12px] xl:text-[20px] lg:text-[19px] md:text-[16px] sm:text-[13px] text-[12px]">
                <li>
                  <Link to="/dashboard" className="hover:underline">
                    Báo cáo thống kê
                  </Link>
                </li>
                <li>
                  <Link to="/confirm-blood" className="hover:underline">
                    Xác nhận nhóm máu
                  </Link>
                </li>
                <li>
                  <Link to="/manage-emergency" className="hover:underline">
                    Yêu cầu khẩn cấp
                  </Link>
                </li>
                <li>
                  <Link to="/edit-blood" className="hover:underline">
                    Quản lý danh sách hiến máu
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="md:flex hidden xl:text-[20px] lg:text-[19px] md:text-[15px] sm:text-[13px] text-[12px] items-center">
              {(isLoggedIn && role === "staff") ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdown((prev) => !prev)}
                    className="w-10 h-10 rounded-full bg-[#D32F2F] text-white flex items-center justify-center font-bold text-lg focus:outline-none"
                  >
                    ST
                  </button>
                  {dropdown && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-50">
                      <ul className="py-2">
                        <li>
                          <Link
                            to="/update-profile"
                            className="block px-4 py-2 hover:bg-gray-100"
                            onClick={() => setDropdown(false)}
                          >
                            Cập nhật trang cá nhân
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={logout}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-[#D32F2F]"
                          >
                            Đăng xuất
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <Link to="/login" className="hover:underline mr-[12px] ">
                    Đăng nhập
                  </Link>
                </div>
              )}
            </div>

            <button
              className="md:hidden text-[#D32F2F] text-2xl"
              onClick={() => setIsOpen(!isOpen)}
            >
              ☰
            </button>
          </div>

          {/* Menu mobile */}
          {isOpen && (
            <nav className="md:hidden bg-white border-t">
              <ul className="flex flex-col px-[26px] py-[12px] gap-y-2 ">
                <li>
                  <Link
                    to="/report"
                    className="block text-[14px] hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    Báo cáo thống kê
                  </Link>
                </li>
                <li>
                  <Link
                    to="/confirm-blood"
                    className="block text-[14px] hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    Xác nhận nhóm máu
                  </Link>
                </li>
                <li>
                  <Link
                    to="/manage-emergency"
                    className="block text-[14px] hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    Yêu cầu khẩn cấp
                  </Link>
                </li>
                <li>
                  <Link
                    to="/edit-blood"
                    className="block text-[14px] hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    Non-feat
                  </Link>
                </li>
                {isLoggedIn ? (
                  <>
                    <li>
                      <Link
                        to="/update-profile"
                        className="block text-[14px] hover:underline"
                        onClick={() => setIsOpen(false)}
                      >
                        Cập nhật trang cá nhân
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          logout();
                        }}
                        className="block text-[14px] text-[#D32F2F] hover:underline w-full text-left"
                      >
                        Đăng xuất
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      to="/login"
                      className="block text-[14px] hover:underline"
                      onClick={() => setIsOpen(false)}
                    >
                      Đăng nhập
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default HeaderStaff;