import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";

const BlogAdmin = () => {
  const { callApi } = useApi();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Sửa lại form để dùng imageUrl thay vì image_url
  const [form, setForm] = useState({ title: "", content: "", imageUrl: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchBlogs = () => {
    setLoading(true);
    callApi("/blogs")
      .then((res) => {
        // Nếu res.data là mảng blog, dùng luôn; nếu là object có blogs thì lấy blogs
        const blogArr = Array.isArray(res.data) ? res.data : (res.data.blogs || res.data.data || []);
        setBlogs(blogArr);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải tin tức!");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    // Validate tiêu đề không trùng
    const normalizedTitle = form.title.trim().toLowerCase();
    const isDuplicateTitle = blogs.some((b, idx) => {
      // Loại trừ chính blog đang sửa
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
    // Validate nội dung
    if (!form.content.trim()) {
      setFormError("Vui lòng nhập nội dung!");
      return;
    }
    if (form.content.trim().length < 10) {
      setFormError("Nội dung quá ngắn, vui lòng nhập chi tiết hơn!");
      return;
    }
    // Validate link ảnh
    if (form.imageUrl) {
      const url = form.imageUrl.trim();
      const isValidImg = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
      if (!isValidImg) {
        setFormError("Link ảnh không hợp lệ! (phải là http(s)://... và kết thúc bằng .jpg, .jpeg, .png, .gif, .webp)");
        return;
      }
    }
    try {
      if (editingId) {
        await callApi(`/blogs/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({
            title: form.title,
            content: form.content,
            imageUrl: form.imageUrl // camelCase
          }),
        });
      } else {
        await callApi("/blogs/create", {
          method: "POST",
          body: JSON.stringify({
            title: form.title,
            content: form.content,
            imageUrl: form.imageUrl // camelCase
          }),
        });
      }
      setShowForm(false);
      setEditingId(null);
      setForm({ title: "", content: "", imageUrl: "" });
      setFormError("");
      fetchBlogs();
    } catch (err) {
      setFormError(err.message || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tin này?")) return;
    callApi(`/blogs/${id}`, { method: "DELETE" })
      .then(() => fetchBlogs())
      .catch(() => alert("Lỗi khi xóa tin tức!"));
  };

  const handleEdit = (blog) => {
    // Tìm key chứa 'image' và 'url' (không phân biệt hoa thường)
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

  console.log("Blogs data:", blogs);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-[#D32F2F]">Quản lý tin tức</h2>
      <button onClick={handleAdd} className="mb-4 px-4 py-2 bg-[#D32F2F] text-white rounded">+ Thêm tin mới</button>
      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Tiêu đề</th>
              <th className="p-2 border">Ảnh</th>
              <th className="p-2 border">Nội dung</th>
              <th className="p-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, idx) => {
              // Debug: log toàn bộ object blog và các key liên quan đến ảnh
              console.log('Blog object:', blog);
              const imgKeys = Object.keys(blog).filter(k => k.toLowerCase().includes('image'));
              imgKeys.forEach(k => console.log('Image key:', k, 'Value:', blog[k]));
              return (
                <tr key={blog.Blog_ID || blog.blogId || blog.id || idx}>
                  <td className="border p-2">{blog.Title || blog.title || blog.blog_title}</td>
                  <td className="border p-2">{
                    (() => {
                      const imgKey = Object.keys(blog).find(
                        k => k.toLowerCase().includes('image') && k.toLowerCase().includes('url')
                      );
                      const imgSrc = imgKey ? blog[imgKey] : "";
                      const fallbackImg = "https://via.placeholder.com/96x64?text=No+Image";
                      return (
                        <div style={{ position: "relative" }}>
                          <img
                            src={imgSrc || fallbackImg}
                            alt=""
                            className="w-24 h-16 object-cover"
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
                      );
                    })()
                  }</td>
                  <td className="border p-2 max-w-xs truncate">{blog.Content || blog.content || blog.blog_content}</td>
                  <td className="border p-2">
                    <button onClick={() => handleEdit(blog)} className="mr-2 px-2 py-1 bg-blue-500 text-white rounded">Sửa</button>
                    <button onClick={() => handleDelete(blog.Blog_ID || blog.blogId || blog.id || idx)} className="px-2 py-1 bg-red-500 text-white rounded">Xóa</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
              <label className="block mb-1">Link ảnh (image_url)</label>
              <input type="text" className="w-full border p-2 rounded" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} />
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