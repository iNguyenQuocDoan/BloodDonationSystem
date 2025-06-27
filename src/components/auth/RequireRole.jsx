import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";

/**
 * Component bảo vệ và phân quyền route với nhiều chức năng
 * @param {Object} props
 * @param {Array} props.allowedRoles - Mảng các role được phép truy cập (nếu có)
 * @param {boolean} props.requireAuth - Yêu cầu xác thực hay không
 * @param {boolean} props.restricted - Chuyển hướng khi đã đăng nhập (cho login/register page)
 */
const ProtectedRoute = ({ 
  allowedRoles = null, 
  requireAuth = false, 
  restricted = false 
}) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { callApi, logout } = useApi();

  // Hàm đăng xuất và chuyển hướng
  const handleLogoutAndRedirect = async (message) => {
    try {
      // Kiểm tra trạng thái đăng nhập
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      
      if (isLoggedIn) {
        // Thực hiện đăng xuất
        await logout();
      }
      
      // Xóa thông tin người dùng trong localStorage
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      
      // Hiển thị thông báo
      toast.error(message, {
        position: "top-center",
        autoClose: 3000
      });
      
      // Chuyển hướng đến trang đăng nhập
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      
      // Xóa dữ liệu đăng nhập ngay cả khi API lỗi
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Kiểm tra trạng thái đăng nhập từ localStorage
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        
        // Xử lý cho route công khai (không giới hạn và không yêu cầu đăng nhập)
        if (!requireAuth && !restricted) {
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }
        
        // Xử lý cho route công khai có restricted (login, register)
        if (!requireAuth && restricted) {
          if (isLoggedIn) {
            setIsAuthorized(false); // Sẽ chuyển hướng dựa vào role
          } else {
            setIsAuthorized(true); // Cho phép truy cập trang login/register
          }
          setIsLoading(false);
          return;
        }
        
        // Xử lý cho route cần xác thực nhưng chưa đăng nhập
        if (requireAuth && !isLoggedIn) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        // Kiểm tra token và quyền
        try {
          if (allowedRoles) {
            const userStr = localStorage.getItem("user");
            if (!userStr) {
              setIsAuthorized(false);
              setIsLoading(false);
              return;
            }
            
            const user = JSON.parse(userStr);
            // Chuẩn hóa user_role để tránh vấn đề chữ hoa/thường
            const userRole = (user.user_role || "").trim().toLowerCase();
            console.log("Checking role:", userRole, "against allowed roles:", allowedRoles);
            
            // So sánh role theo lowercase
            const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());
            if (normalizedAllowedRoles.includes(userRole)) {
              console.log("Role authorized");
              setIsAuthorized(true);
            } else {
              console.log("Role not authorized");
              // Thay vì chỉ hiển thị toast thông báo, gọi hàm đăng xuất và chuyển hướng
              await handleLogoutAndRedirect("Bạn không có quyền truy cập trang này.\nVui lòng đăng nhập bằng tài khoản có quyền phù hợp.");
              setIsAuthorized(false);
            }
          } else {
            // Chỉ yêu cầu đăng nhập, không kiểm tra role
            setIsAuthorized(true);
          }
        } catch (error) {
          console.error("Auth error:", error);
          if (isLoggedIn) {
            await handleLogoutAndRedirect("Phiên đăng nhập đã hết hạn");
          }
          setIsAuthorized(false);
        } finally {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("General auth error:", error);
        if (localStorage.getItem("isLoggedIn") === "true") {
          await handleLogoutAndRedirect("Đã xảy ra lỗi xác thực");
        }
        setIsAuthorized(false);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [allowedRoles, requireAuth, restricted]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // Xử lý điều hướng dựa vào kết quả xác thực
  if (!isAuthorized) {
    // 1. Đối với các trang yêu cầu đăng nhập nhưng user chưa đăng nhập
    if (requireAuth && localStorage.getItem("isLoggedIn") !== "true") {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // 2. Đối với các trang yêu cầu role cụ thể nhưng user không có quyền
    // Đã được xử lý trong hàm checkAuth ở trên bằng handleLogoutAndRedirect
    
    // 3. Đối với các trang login/register khi user đã đăng nhập
    if (restricted) {
      // Chuyển hướng dựa vào vai trò
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          const userRole = user.user_role;
          
          switch (userRole) {
            case "admin":
              return <Navigate to="/admin" replace />;
            case "staff":
              return <Navigate to="/dashboard" replace />;
            default:
              return <Navigate to="/" replace />;
          }
        } catch (error) {
          console.error("Error parsing user data", error);
          return <Navigate to="/" replace />;
        }
      }
    }
  }

  return <Outlet />;
};

// Component xử lý lỗi 404 (đường dẫn không tồn tại)
export const NotFoundHandler = () => {
  const navigate = useNavigate();
  const { logout } = useApi();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Kiểm tra xem người dùng có đăng nhập không
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        
        if (isLoggedIn) {
          await logout();
          toast.info("Bạn đã được đăng xuất");
        }
        
        // Xóa thông tin người dùng trong localStorage
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        
        // Hiển thị thông báo
        toast.error("Đường dẫn không tồn tại", {
          position: "top-center",
          autoClose: 3000
        });
        
        // Chuyển hướng đến trang đăng nhập
        setTimeout(() => {
          navigate("/login");
        }, 500);
      } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
        
        // Xóa thông tin người dùng trong localStorage ngay cả khi API lỗi
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        
        navigate("/login");
      }
    };

    performLogout();
  }, [logout, navigate]);

  // Hiển thị màn hình loading trong khi đăng xuất
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 mb-4"></div>
      <p className="text-gray-600">Đang xử lý, vui lòng đợi...</p>
    </div>
  );
};

export default ProtectedRoute;