import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex justify-center items-center w-full h-[40px] bg-[#E57373] md:text-[21px] sm:text-[14px] text-[12px] ">
        <span className="text-[#FFFFFF]">
          Become a blood donor today and share compassion with those in need.
        </span>
      </div>

      <header className="w-full bg-white shadow">
        <div className="mx-auto">
          <div className="flex justify-between items-center px-[26px] py-[18px]">
            <a
              href="/"
              className="font-[900] text-[#D32F2F] xl:text-[31px] lg:text-[27px] md:text-[23px] text-[22px]"
            >
              DaiVietBlood
            </a>

            <nav className="hidden md:flex ">
              <ul className="flex  xl:gap-x-[24px] lg:gap-x-[15px] gap-x-[7px] xl:text-[20px] lg:text-[19px] md:text-[14px] sm:text-[13px] text-[12px]">
                <li>
                  <Link to="/" className="hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/donate" className="hover:underline">
                    Donate blood
                  </Link>
                </li>
                <li>
                  <Link to="/emergency" className="hover:underline">
                    Emergency Request
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:underline">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/news" className="hover:underline">
                    News
                  </Link>
                </li>
                {/* <li>
                  <Link to="/login" className="hover:underline">
                    Login
                  </Link>
                </li>
                <li className="rounded-[3px] md:px-[12px] px-[8px] py-[1px] text-white bg-[#D32F2F]">
                  <Link to="/register">Register</Link>
                </li> */}
              </ul>
            </nav>
            <div className="md:flex hidden xl:text-[20px] lg:text-[19px] md:text-[15px] sm:text-[13px] text-[12px] ">
              <div>
                <Link to="/login" className="hover:underline mr-[12px] ">
                  Login
                </Link>
              </div>
              <div className="rounded-[3px] md:px-[12px] px-[8px] py-[1px] text-white bg-[#D32F2F]">
                <Link to="/register">Register</Link>
              </div>
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
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/donate"
                    className="block text-[14px] hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    Donate blood
                  </Link>
                </li>
                <li>
                  <Link
                    to="/emergency"
                    className="block text-[14px] hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    Emergency Request
                  </Link>
                </li>
                <li>
                  <Link
                    to="/news"
                    className="block text-[14px] hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    News
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
                    to="/contact"
                    className="block text-[14px] hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="block text-[14px] hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li className="  ">
                  <Link
                    to="/register"
                    className="block text-[14px] hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
