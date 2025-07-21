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
      <div className="max-w-screen-xl mx-auto w-full px-1 sm:px-2 md:px-4">
        <div className="flex justify-between items-center py-2 md:py-3">
          {/* Logo */}
          <NavLink
            to="/"
            className="font-[900] flex items-center text-[#D32F2F] xl:text-[31px] lg:text-[27px] md:text-[22px] sm:text-[18px] text-[15px] min-w-[80px]"
          >
            <img
              src="/image.png"
              alt="DaiVietBlood"
              className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 object-contain mr-1 sm:mr-2"
            />
            <span className="ml-1 xl:text-[31px] lg:text-[27px] md:text-[22px] sm:text-[18px] text-[15px]">
              DaiVietBlood
            </span>
          </NavLink>

          {/* ----- NAVBAR DESKTOP (căn giữa) ----- */}
          <nav className="hidden md:flex flex-1 justify-center">
            <ul className="flex xl:gap-x-[24px] lg:gap-x-[15px] md:gap-x-[10px] sm:gap-x-[8px] gap-x-[6px] xl:text-[20px] lg:text-[19px] md:text-[15px] sm:text-[12px] text-[11px]">
              <li>
                <NavLink to="/" end className={navItemClass}>
                  Trang chủ
                </NavLink>
              </li>
              <li>
                <NavLink to="/faq" className={navItemClass}>
                  FAQ
                </NavLink>
              </li>
              <li>
                <NavLink to="/news" className={navItemClass}>
                  Bài viết
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={navItemClass}>
                  Liên hệ
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* ----- AVATAR / AUTH DESKTOP ----- */}
          <div className="hidden md:flex items-center gap-1 xl:text-[20px] lg:text-[19px] md:text-[14px] sm:text-[12px] text-[11px]">
            {isLoggedIn && role === "member" ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="w-10 h-10 rounded-full bg-[#D32F2F] text-white flex items-center justify-center hover:bg-[#B71C1C] transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
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
              <>
                <NavLink to="/login" className={navItemClass}>
                  Đăng nhập
                </NavLink>
                <div className="ml-2 bg-[#D32F2F] text-white rounded-[3px] md:px-[12px] px-[8px] py-[1px]">
                  <NavLink to="/register">Đăng kí</NavLink>
                </div>
              </>
            )}
          </div>

          {/* ----- BURGER ICON (MOBILE) ----- */}
          <button
            className="md:hidden text-[#D32F2F] text-2xl p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Mở menu"
          >
            <span className="sr-only">Mở menu</span>☰
          </button>
        </div>

        {/* ----- MENU MOBILE ----- */}
        {isOpen && (
          <nav className="md:hidden bg-white border-t animate-fade-in-down">
            <ul className="flex flex-col px-4 py-3 gap-y-2 text-[15px]">
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
                        "block rounded-md px-3 py-2 font-medium transition-colors duration-150",
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
