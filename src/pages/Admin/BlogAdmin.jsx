import React, { useState, useEffect, useRef } from "react";
import useApi from "../../hooks/useApi";
import { toast } from "react-toastify";

const BlogAdmin = () => {
  const {
    fetchBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    paginate,
    loading,
    error
  } = useApi();

  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;
  const [form, setForm] = useState({ title: "", content: "", imageUrl: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchBlogs().then(setBlogs).catch(() => setBlogs([]));
  }, [fetchBlogs]);

  // Validate và submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    // Validate tiêu đề không trùng
    const normalizedTitle = form.title.trim().toLowerCase();
    const isDuplicateTitle = blogs.some((b, idx) => {
      if (editingId && (b.Blog_ID || b.blogId || b.id || idx) === editingId) return false;
      return (b.Title || b.title || b.blog_title || "").trim().toLowerCase() === normalizedTitle;
    });
    if (!form.title.trim()) {
      setFormError("Vui lòng nhập tiêu đề!");
      return;
    }
    if (isDuplicateTitle) {
      setFormError("Tiêu đề đã tồn tại, vui lòng nhập tiêu đề khác!");
      return;
    }
    if (!form.content.trim()) {
      setFormError("Vui lòng nhập nội dung!");
      return;
    }
    if (form.content.trim().length < 10) {
      setFormError("Nội dung quá ngắn, vui lòng nhập chi tiết hơn!");
      return;
    }
    // Validate link ảnh
    if (!form.imageUrl) {
      setFormError("Vui lòng chọn ảnh hợp lệ!");
      toast.error("Vui lòng chọn ảnh hợp lệ!");
      return;
    }
    const url = form.imageUrl.trim();
    const isValidImg =
      /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    if (!isValidImg) {
      setFormError("Ảnh không hợp lệ! (phải là link http(s), .jpg, .png, ... từ máy tính)");
      toast.error("Ảnh không hợp lệ! (phải là link http(s), .jpg, .png, ... từ máy tính)");
      return;
    }
    try {
      if (editingId) {
        await updateBlog(editingId, {
          title: form.title,
          content: form.content,
          imageUrl: form.imageUrl
        });
        toast.success("Cập nhật tin tức thành công!");
      } else {
        await createBlog({
          title: form.title,
          content: form.content,
          imageUrl: form.imageUrl
        });
        toast.success("Tạo tin tức mới thành công!");
      }
      fetchBlogs().then(setBlogs);
      setShowForm(false);
      setEditingId(null);
      setForm({ title: "", content: "", imageUrl: "" });
      setFormError("");
    } catch (err) {
      setFormError(err.message || "Có lỗi xảy ra, vui lòng thử lại!");
      toast.error("Không thể lưu ảnh này! Vui lòng chọn ảnh khác hoặc thử lại.");
      // KHÔNG reset form, KHÔNG reset fileInputRef, giữ nguyên các giá trị đã nhập
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tin này?")) return;
    try {
      await deleteBlog(id);
      fetchBlogs().then(setBlogs);
    } catch {
      alert("Lỗi khi xóa tin tức!");
    }
  };

  const handleEdit = (blog) => {
    const imgKey = Object.keys(blog).find(
      k => k.toLowerCase().includes('image') && k.toLowerCase().includes('url')
    );
    const imgSrc = imgKey ? blog[imgKey] : "";
    setForm({
      title: blog.Title || blog.title || blog.blog_title || "",
      content: blog.Content || blog.content || blog.blog_content || "",
      imageUrl: imgSrc || ""
    });
    setEditingId(blog.Blog_ID || blog.blogId || blog.id);
    setShowForm(true);
  };

  const handleAdd = () => {
    setForm({ title: "", content: "", imageUrl: "" });
    setEditingId(null);
    setShowForm(true);
  };

  // Pagination
  const { paged, totalPages } = paginate(blogs, currentPage, cardsPerPage);

  // Cloudinary config demo, thay bằng của bạn nếu cần
  const CLOUDINARY_CLOUD_NAME = 'dehtgp5iq';
  const CLOUDINARY_UPLOAD_PRESET = 'demo_preset'; // Đảm bảo đúng tuyệt đối, không dấu cách, không ký tự lạ

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-[#D32F2F]">Quản lý tin tức</h2>
      <button onClick={handleAdd} className="mb-4 px-4 py-2 bg-[#D32F2F] text-white rounded">+ Thêm tin mới</button>
      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          {/* Card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {paged.map((blog, idx) => {
              const imgKey = Object.keys(blog).find(
                k => k.toLowerCase().includes('image') && k.toLowerCase().includes('url')
              );
              const imgSrc = imgKey ? blog[imgKey] : "";
              const fallbackImg = "https://via.placeholder.com/96x64?text=No+Image";
              return (
                <div key={blog.Blog_ID || blog.blogId || blog.id || idx} className="bg-white rounded shadow p-4 flex flex-col">
                  <div className="mb-2 w-full h-32 flex items-center justify-center relative">
                    <img
                      src={imgSrc || fallbackImg}
                      alt=""
                      className="w-full h-32 object-cover rounded"
                      style={{ opacity: imgSrc ? 1 : 0.5 }}
                    />
                    {!imgSrc && (
                      <span
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          color: "#D32F2F",
                          fontSize: "10px",
                          background: "rgba(255,255,255,0.7)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold"
                        }}
                      >
                        Chưa có ảnh
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-lg mb-1 truncate">{blog.Title || blog.title || blog.blog_title}</div>
                  <div className="text-gray-700 text-sm mb-2 max-h-16 overflow-hidden">{blog.Content || blog.content || blog.blog_content}</div>
                  <div className="mt-auto flex gap-2">
                    <button onClick={() => handleEdit(blog)} className="px-2 py-1 bg-blue-500 text-white rounded">Sửa</button>
                    <button onClick={() => handleDelete(blog.Blog_ID || blog.blogId || blog.id || idx)} className="px-2 py-1 bg-red-500 text-white rounded">Xóa</button>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-[#D32F2F] text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">{editingId ? "Sửa tin tức" : "Thêm tin tức mới"}</h3>
            {formError && <div className="text-red-500 mb-2">{formError}</div>}
            <div className="mb-2">
              <label className="block mb-1">Tiêu đề</label>
              <input type="text" className="w-full border p-2 rounded" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Ảnh</label>
              <div className="flex items-center gap-2">
                <input
                  id="customFileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (!file.type.startsWith('image/')) {
                      toast.error('Chỉ chọn file ảnh!');
                      return;
                    }
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
                    try {
                      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                        method: 'POST',
                        body: formData,
                      });
                      const data = await res.json();
                      if (data.secure_url) {
                        setForm(f => ({ ...f, imageUrl: data.secure_url, fileName: file.name }));
                        toast.success('Tải ảnh lên Cloudinary thành công!');
                      } else {
                        console.error('Cloudinary upload error:', data);
                        toast.error(
                          (data.error && data.error.message)
                            ? `Lỗi Cloudinary: ${data.error.message}`
                            : 'Tải ảnh lên Cloudinary thất bại! Vui lòng kiểm tra preset, cloud_name hoặc chọn ảnh khác.'
                        );
                      }
                    } catch (err) {
                      toast.error('Tải ảnh lên Cloudinary thất bại! Lỗi mạng hoặc file quá lớn.');
                    }
                  }}
                />
                <label htmlFor="customFileInput" className="px-4 py-2 bg-gray-200 rounded cursor-pointer font-semibold text-gray-700 hover:bg-gray-300">Chọn tệp</label>
                <span className="ml-2 text-sm text-gray-600">
                  {form.fileName ? form.fileName : 'Chưa chọn tệp'}
                </span>
              </div>
              {form.imageUrl && (
                <div className="mt-2 flex justify-center">
                  <img src={form.imageUrl} alt="preview" className="max-h-32 rounded shadow" />
                </div>
              )}
            </div>
            <div className="mb-2">
              <label className="block mb-1">Nội dung</label>
              <textarea className="w-full border p-2 rounded" rows={5} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormError(""); }} className="px-4 py-2 bg-gray-300 rounded">Hủy</button>
              <button type="submit" className="px-4 py-2 bg-[#D32F2F] text-white rounded">Lưu</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BlogAdmin;
