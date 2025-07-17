import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const blogData = data.data || data.blog || data;
        setBlog(blogData);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải chi tiết bài viết!");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-8">Đang tải chi tiết...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!blog) return <div className="text-center py-8">Không tìm thấy bài viết</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4 text-[#D32F2F]">{blog.title || blog.Title || blog.blog_title}</h1>
      {blog.imageUrl && (
        <img src={blog.imageUrl} alt={blog.title} className="mb-4 w-full rounded" />
      )}
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.content || blog.Content || blog.blog_content || '' }} />
    </div>
  );
};

export default BlogDetail; 