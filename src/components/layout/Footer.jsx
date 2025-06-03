import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="bg-[#333333] h-[164px]">
        <div className="container mx-auto">
          <ul className="flex gap-x-[12px] text-white font-[300]">
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/aboutus">About Us </Link>
            </li>
            <li>
              <Link to="/aboutus">FAQ </Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/news">News</Link>
            </li>
          </ul>
          <div className="flex justify-center items-center mt-[4%]">
            <strong>© 2025 DaiVietBlood. All rights reserved.</strong>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
