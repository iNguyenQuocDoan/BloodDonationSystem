import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import useApi from "../../hooks/useApi";

// nav item classes for staff: maintain border and font to prevent shift
const staffNavItemClass = ({ isActive }) =>
  [
    "px-3 py-2 rounded-md transition-colors duration-200 font-medium border-b-2 border-b-transparent",
    isActive
      ? "border-b-red-500 text-[#D32F2F] bg-[#FDE8E8]"
      : "text-black hover:text-red-500 hover:border-b-red-500 hover:bg-gray-100/40",
  ].join(" ");

const HeaderStaff = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [user, setUser] = useState(null);

  const isLoggedIn = !!localStorage.getItem("isLoggedIn");
  const dropdownRef = useRef(null);
  const { getCurrentUser, logout } = useApi();

  // fetch user data
  useEffect(() => {
    if (isLoggedIn) {
      getCurrentUser()
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [isLoggedIn, getCurrentUser]);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const role = user?.user_role;

  return (
    <>
      {/* top banner */}
      <div className="w-full bg-[#E57373]">
        <div className="container mx-auto h-[30px] flex justify-center items-center text-[12px] sm:text-[14px] md:text-[16px] text-white">
          Quản lý nhân viên Đại việt Blood
        </div>
      </div>

      <header className="w-full bg-white shadow">
        <div className="mx-auto">
          <div className="flex justify-between items-center px-[20px] py-[8px]">
            <NavLink
              to="/"
              className="font-[900] text-[#D32F2F] xl:text-[31px] lg:text-[27px] md:text-[23px] text-[22px]"
            >
              DaiVietBlood
            </NavLink>

            {/* Desktop nav for staff */}
            <nav className="hidden md:flex">
              <ul className="flex xl:gap-x-[24px] lg:gap-x-[15px] gap-x-[12px] xl:text-[20px] lg:text-[19px] md:text-[16px] sm:text-[13px] text-[12px]">
                <li>
                  <NavLink to="/dashboard" className={staffNavItemClass}>
                    Báo cáo thống kê
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/confirm-blood" className={staffNavItemClass}>
                    Xác nhận nhóm máu
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/manage-emergency" className={staffNavItemClass}>
                    Yêu cầu khẩn cấp
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/edit-blood" className={staffNavItemClass}>
                    Quản lý danh sách hiến máu
                  </NavLink>
                </li>
              </ul>
            </nav>

            {/* Desktop auth/avatar */}
            <div className="hidden md:flex items-center xl:text-[20px] lg:text-[19px] md:text-[15px] sm:text-[13px] text-[12px]">
              {isLoggedIn && role === "staff" ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdown(!dropdown)}
                    className="w-10 h-10 rounded-full bg-[#D32F2F] text-white flex items-center justify-center font-bold text-lg"
                  >
                    ST
                  </button>
                  {dropdown && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-50">
                      <ul className="py-2 text-[14px]">
                        <li>
                          <NavLink
                            to="/profile"
                            className="block px-4 py-2 hover:bg-gray-100"
                            onClick={() => setDropdown(false)}
                          >
                            Cập nhật trang cá nhân
                          </NavLink>
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
                <NavLink to="/login" className="hover:underline mr-[12px]">
                  Đăng nhập
                </NavLink>
              )}
            </div>

            {/* Mobile burger */}
            <button
              className="md:hidden text-[#D32F2F] text-2xl"
              onClick={() => setIsOpen(!isOpen)}
            >
              ☰
            </button>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <nav className="md:hidden bg-white border-t">
              <ul className="flex flex-col px-[26px] py-[12px] gap-y-2 text-[14px]">
                {[
                  { to: "/dashboard", label: "Báo cáo thống kê", exact: true },
                  { to: "/confirm-blood", label: "Xác nhận nhóm máu" },
                  { to: "/manage-emergency", label: "Yêu cầu khẩn cấp" },
                  { to: "/edit-blood", label: "Quản lý danh sách hiến máu" },
                ].map(({ to, label, exact }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={exact}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        [
                          "block rounded-md px-3 py-2 font-medium border-b-2 border-b-transparent",
                          isActive
                            ? "border-b-red-500 text-[#D32F2F] bg-[#FDE8E8]"
                            : "hover:bg-gray-100/40",
                        ].join(" ")
                      }
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
                {isLoggedIn ? (
                  <>
                    <li>
                      <NavLink
                        to="/profile"
                        className="block rounded-md px-3 py-2 hover:bg-gray-100/40"
                        onClick={() => setIsOpen(false)}
                      >
                        Cập nhật trang cá nhân
                      </NavLink>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          logout();
                        }}
                        className="block w-full text-left rounded-md px-3 py-2 text-[#D32F2F] hover:bg-gray-100/40"
                      >
                        Đăng xuất
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <NavLink
                      to="/login"
                      className="block rounded-md px-3 py-2 hover:bg-gray-100/40"
                      onClick={() => setIsOpen(false)}
                    >
                      Đăng nhập
                    </NavLink>
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
