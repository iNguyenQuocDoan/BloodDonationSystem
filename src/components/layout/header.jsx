import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import useApi from "../../hooks/useApi";

// Build nav item classes: keep border-bottom and font-weight constant to prevent layout shift
const navItemClass = ({ isActive }) =>
  [
    "px-3 py-2 rounded-md transition-colors duration-200 font-medium border-b-2 border-b-transparent",
    isActive
      ? "border-b-red-500 text-[#D32F2F] bg-[#FDE8E8]"
      : "text-black hover:text-red-500 hover:border-b-red-500 hover:bg-gray-100/40",
  ].join(" ");

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [user, setUser] = useState(null);

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
    <header className="w-full bg-white shadow">
      <div className="mx-auto">
        <div className="flex justify-between items-center px-[20px] py-[8px]">
          <NavLink
            to="/"
            className="font-[900] text-[#D32F2F] xl:text-[31px] lg:text-[27px] md:text-[23px] text-[22px]"
          >
            DaiVietBlood
          </NavLink>

          {/* Desktop navigation */}
          <nav className="hidden md:flex">
            <ul className="flex xl:gap-x-[24px] lg:gap-x-[15px] gap-x-[12px] xl:text-[20px] lg:text-[19px] md:text-[16px] sm:text-[13px] text-[12px]">
              <li>
                <NavLink to="/" end className={navItemClass}>
                  Trang chủ
                </NavLink>
              </li>
              <li>
                <NavLink to="/donate" className={navItemClass}>
                  Đăng kí hiến máu
                </NavLink>
              </li>
              <li>
                <NavLink to="/emergency" className={navItemClass}>
                  Yêu cầu máu khẩn cấp
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={navItemClass}>
                  Liên hệ
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Desktop auth/avatar */}
          <div className="hidden md:flex items-center xl:text-[20px] lg:text-[19px] md:text-[15px] sm:text-[13px] text-[12px]">
            {isLoggedIn && role === "member" ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="w-10 h-10 rounded-full bg-[#D32F2F] text-white flex items-center justify-center font-bold text-lg"
                >
                  {user?.name?.[0]?.toUpperCase() || "U"}
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

          {/* Mobile burger icon */}
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
                { to: "/", label: "Trang chủ", exact: true },
                { to: "/donate", label: "Đăng kí hiến máu" },
                { to: "/emergency", label: "Yêu cầu máu khẩn cấp" },
                { to: "/news", label: "Tin tức" },
                { to: "/faq", label: "FAQ" },
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
              {isLoggedIn ? <>...</> : <>...</>}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
