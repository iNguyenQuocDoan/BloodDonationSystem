import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex justify-center items-center w-full h-[40px] bg-[#E57373] text-[11px]">
        <span className="text-[#FFFFFF]">
          Become a blood donor today and share compassion with those in need.
        </span>
      </div>

      <header className="w-full">
        <div className="container mx-auto">
          <div className="flex justify-between bg-[#E57373] items-center px-[26px] py-[18px]  ">
            <a
              href="/"
              className="font-[900] text-[#D32F2F] xl:text-[31px] lg:text-[24px] md:text-[20px] text-[16px]"
            >
              DaiVietBlood
            </a>

            <nav>
              <ul className="flex xl:gap-x-[24px] gap-x-[17px] xl:text-[17px] lg:text-[14px] md:text-[10px] text-[8px]">
                <li className=" ">
                  <Link>Home</Link>
                </li>
                <li className=" hover:underline">
                  <Link>Register to donate blood</Link>
                </li>
                <li className=" hover:underline">
                  <Link>Urgent Blood Request</Link>
                </li>
                <li className=" hover:underline">
                  <Link>News</Link>
                </li>
                <li className=" hover:underline">
                  <Link>FAQ</Link>
                </li>
                <li className=" hover:underline">
                  <Link>Contact</Link>
                </li>
                <li className=" hover:underline">
                  <Link to="/login">Login</Link>
                </li>
                <li className=" solid rounded-[3px] md:px-[12px] px-[8px] py-[1px] text-white bg-[#D32F2F] ">
                  <Link to="/register">Register</Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};
export default Header;
