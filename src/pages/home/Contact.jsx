import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setForm({ name: "", email: "", message: "" });
    alert("Message sent!");
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-8 px-2">
      <h2 className="text-center text-2xl md:text-3xl font-bold text-[#D32F2F] mb-8">
        Contact Us
      </h2>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="bg-white rounded-lg shadow p-6 flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-4">Office Information</h3>
          <p>Address: 123 A Street, District B, HCMC</p>
          <p>Hotline: 0123 456 789</p>
          <p>Email: support@bloodshare.vn</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-4">Send a Message</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1">Full Name:</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Email:</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Message:</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your message"
                className="w-full px-3 py-2 border rounded min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#D32F2F] text-white px-6 py-2 rounded font-semibold hover:bg-[#b71c1c] transition"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;