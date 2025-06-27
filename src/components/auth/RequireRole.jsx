import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";

const ProtectedRoute = ({ 
  allowedRoles = null, 
  requireAuth = false, 
  restricted = false 
}) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { getCurrentUser, logout } = useApi();

  // Hàm đăng xuất và chuyển hướng
  const handleLogoutAndRedirect = async (message) => {
    try {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (isLoggedIn) {
        await logout();
      }
      localStorage.removeItem("isLoggedIn");
      toast.error(message, {
        position: "top-center",
        autoClose: 3000
      });
      navigate("/login", { replace: true });
    } catch (error) {
      localStorage.removeItem("isLoggedIn");
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

        // Route công khai
        if (!requireAuth && !restricted) {
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }

        // Route công khai có restricted (login/register)
        if (!requireAuth && restricted) {
          if (isLoggedIn) {
            // Lấy user qua API để chuyển hướng đúng role
            try {
              const res = await getCurrentUser();
              setUser(res.data);
              setIsAuthorized(false); // Sẽ chuyển hướng phía dưới
            } catch {
              setIsAuthorized(true);
            }
          } else {
            setIsAuthorized(true);
          }
          setIsLoading(false);
          return;
        }

        // Route cần xác thực nhưng chưa đăng nhập
        if (requireAuth && !isLoggedIn) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        // Lấy user info từ API
        let userInfo = null;
        try {
          const res = await getCurrentUser();
          userInfo = res.data;
          setUser(userInfo);
        } catch (error) {
          await handleLogoutAndRedirect("Phiên đăng nhập đã hết hạn");
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        // Kiểm tra role nếu cần
        if (allowedRoles) {
          const userRole = (userInfo.user_role || "").trim().toLowerCase();
          const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());
          if (normalizedAllowedRoles.includes(userRole)) {
            setIsAuthorized(true);
          } else {
            await handleLogoutAndRedirect("Bạn không có quyền truy cập trang này.\nVui lòng đăng nhập bằng tài khoản có quyền phù hợp.");
            setIsAuthorized(false);
          }
        } else {
          setIsAuthorized(true);
        }
        setIsLoading(false);
      } catch (error) {
        await handleLogoutAndRedirect("Đã xảy ra lỗi xác thực");
        setIsAuthorized(false);
        setIsLoading(false);
      }
    };

    checkAuth();
    // eslint-disable-next-line
  }, [allowedRoles, requireAuth, restricted, getCurrentUser]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // Điều hướng nếu không được phép
  if (!isAuthorized) {
    // Trang login/register khi user đã đăng nhập
    if (restricted && user) {
      const userRole = user.user_role;
      switch (userRole) {
        case "admin":
          return <Navigate to="/admin" replace />;
        case "staff":
          return <Navigate to="/dashboard" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
    // Trang yêu cầu đăng nhập nhưng user chưa đăng nhập
    if (requireAuth && localStorage.getItem("isLoggedIn") !== "true") {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // Các trường hợp khác đã được handleLogoutAndRedirect xử lý
  }

  return <Outlet />;
};

export default ProtectedRoute;