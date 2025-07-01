import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { FaMapMarkerAlt } from "react-icons/fa";

const Header = () => {
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
                  <Link to="/" className="hover:underline">
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:underline">
                    FAQ
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
                    to="/"
                    className="block text-[14px] hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="block text-[14px] hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/news"
                    className="block text-[14px] hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    Tin tức
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="block text-[14px] hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    Liên hệ
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
                  <>
                    <li>
                      <Link
                        to="/login"
                        className="block text-[14px] hover:underline"
                        onClick={() => setIsOpen(false)}
                      >
                        Đăng nhập
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        className="block text-[14px] hover:underline"
                        onClick={() => setIsOpen(false)}
                      >
                        Đăng kí
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
