import { Navigate, Outlet } from "react-router-dom";

const RequireRole = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.user_role;

  if (allowedRoles.includes(role)) {
    return <Outlet />;
  }
  // Nếu không đúng quyền, chuyển hướng về trang chủ
  return <Navigate to="/" replace />;
};

export default RequireRole; 