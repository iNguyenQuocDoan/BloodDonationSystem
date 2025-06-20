import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminNavbar />
      <main className="p-8 flex-1">
        <h1 className="text-xl font-semibold mb-2">Admin Navbar Mockup</h1>
        <p className="text-sm text-gray-600">
          Đây là nội dung demo để kiểm tra Navbar.
        </p>
      </main>
    </div>
  );
};

export default AdminLayout;
