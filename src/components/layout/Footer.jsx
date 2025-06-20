import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="bg-[#333333]">
        <div className="container mx-auto h-full ">
          <div className="flex flex-wrap md:justify-between justify-center gap-x-[11px]  ">
            <ul className="flex md:gap-x-[12px] gap-x-[10px] mx-auto text-white font-[500] md:mt-[20px] mt-[10px] lg:text-[19px] md:text-[15px] text-[13px] ">
              <li className="hover:underline">
                <Link to="/home">Trang chủ</Link>
              </li>
              <li className="hover:underline">
                <Link to="/aboutus">Về chúng tôi</Link>
              </li>
              <li className="hover:underline">
                <Link to="/faq">FAQ</Link>
              </li>
              <li className="hover:underline">
                <Link to="/contact">Liên hệ</Link>
              </li>
              <li className="hover:underline">
                <Link to="/news">Tin tức</Link>
              </li>
            </ul>
            <div className="font-[500] text-white mt-[20px]  lg:text-[19px] md:text-[15px] text-[13px]">
              <p className="font-sans text-lg">
                "Mỗi giọt máu trao đi – kết nối triệu trái tim, cứu sống nhiều
                cuộc đời."
              </p>
            </div>
          </div>
          <div className="w-max mx-auto mt-[40px] text-white font-[600] text-[20px]">
            © 2025 DaiVietBlood. Mọi quyền được bảo lưu.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
