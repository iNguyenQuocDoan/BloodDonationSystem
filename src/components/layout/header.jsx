import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import useApi from "../../hooks/useApi";

/* -----------------------------------------------------------
 * 1. Tiện ích dựng sẵn class cho <NavLink>
 * --------------------------------------------------------- */
const navItemClass = ({ isActive }) =>
  [
    "px-3 py-2 rounded-md transition-colors duration-200 font-medium border-b-2 border-b-transparent",
    isActive
      ? "border-b-red-500 text-[#D32F2F] bg-[#FDE8E8]"
      : "text-black hover:text-red-500 hover:border-b-red-500 hover:bg-gray-100/40",
  ].join(" ");

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("isLoggedIn");
  const { getCurrentUser, logout } = useApi();

  /* -----------------------------------------------------------
   * 2. Lấy thông tin người dùng khi đăng nhập
   * --------------------------------------------------------- */
  useEffect(() => {
    if (isLoggedIn) {
      getCurrentUser()
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [isLoggedIn, getCurrentUser]);

  /* -----------------------------------------------------------
   * 3. Đóng dropdown khi click ra ngoài
   * --------------------------------------------------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const role = user?.user_role;

  /* -----------------------------------------------------------
   * 4. JSX
   * --------------------------------------------------------- */
  return (
    <header className="w-full bg-white shadow">
      <div className="container mx-auto">
        <div className="flex justify-between items-center px-[20px] py-[8px]">
          {/* Logo */}
          <NavLink
            to="/"
            className="font-[900] text-[#D32F2F] xl:text-[31px] lg:text-[27px] md:text-[23px] text-[22px]"
          >
            DaiVietBlood
          </NavLink>

            <nav className="hidden md:flex ">
              <ul className="flex flex-1 xl:gap-x-[24px] lg:gap-x-[15px] gap-x-[12px] xl:text-[20px] lg:text-[19px] md:text-[16px] sm:text-[13px] text-[12px]">
                <li>
                  <Link to="/" className="hover:underline">
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:underline">
                    Câu hỏi thường gặp
                  </Link>
                </li>
                <li>
                  <Link to="/news" className="hover:underline">
                    Tin tức
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:underline">
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="md:flex hidden xl:text-[20px] lg:text-[19px] md:text-[15px] sm:text-[13px] text-[12px] items-center">
              {(isLoggedIn && role === "member") ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdown((prev) => !prev)}
                    className="w-10 h-10 rounded-full bg-[#D32F2F] text-white flex items-center justify-center font-bold text-lg focus:outline-none"
                  >
                    {user?.name?.[0]?.toUpperCase() || "U"}
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
                <>
                  <div>
                    <Link to="/login" className="hover:underline mr-[12px] ">
                      Đăng nhập
                    </Link>
                  </div>
                  <div className="rounded-[3px] md:px-[12px] px-[8px] py-[1px] text-white bg-[#D32F2F]">
                    <Link to="/register">Đăng kí</Link>
                  </div>
                </>
              )}
            </div>

          {/* ----- BURGER ICON (MOBILE) ----- */}
          <button
            className="md:hidden text-[#D32F2F] text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>

        {/* ----- MENU MOBILE ----- */}
        {isOpen && (
          <nav className="md:hidden bg-white border-t">
            <ul className="flex flex-col px-[26px] py-[12px] gap-y-2 text-[14px]">
              {[
                { to: "/", label: "Trang chủ", exact: true },
                { to: "/faq", label: "FAQ" },
                { to: "/news", label: "Tin tức" },
                { to: "/contact", label: "Liên hệ" },
              ].map(({ to, label, exact }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={exact}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      [
                        "block rounded-md px-3 py-2 font-medium",
                        isActive
                          ? "bg-[#D32F2F]/10 text-[#D32F2F] border-b-2 border-b-red-500"
                          : "hover:bg-gray-100/40",
                      ].join(" ")
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}

              {/* Auth mobile */}
              {isLoggedIn ? (
                <>
                  <li>
                    <NavLink
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="block rounded-md px-3 py-2 font-medium hover:bg-gray-100/40"
                    >
                      Cập nhật trang cá nhân
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full text-left rounded-md px-3 py-2 font-medium text-[#D32F2F] hover:bg-gray-100/40"
                    >
                      Đăng xuất
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block rounded-md px-3 py-2 font-medium hover:bg-gray-100/40"
                    >
                      Đăng nhập
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="block rounded-md px-3 py-2 font-medium hover:bg-gray-100/40"
                    >
                      Đăng kí
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
