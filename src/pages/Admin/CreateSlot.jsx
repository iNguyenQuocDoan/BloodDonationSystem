import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useApi from "../../hooks/useApi";

/**
 * CreateSlot –form + modal confirm (hiệu ứng Framer Motion)
 */
export default function CreateSlot() {
  const [formData, setFormData] = useState({
    Slot_Date: "",
    Start_Time: "",
    End_Time: "",
    Max_Volume: "",
  });

  const { loading, createSlot } = useApi();
  const [message, setMessage] = useState({ text: "", type: "" });
  const [timeError, setTimeError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // HANDLERS
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "Start_Time") {
      setFormData((prev) => {
        const updated = { ...prev, Start_Time: value };
        if (prev.End_Time && prev.End_Time <= value) {
          setTimeError("Giờ kết thúc phải sau giờ bắt đầu");
          return { ...updated, End_Time: "" };
        }
        setTimeError("");
        return updated;
      });
      return;
    }

    if (name === "End_Time") {
      if (formData.Start_Time && value <= formData.Start_Time) {
        setTimeError("Giờ kết thúc phải sau giờ bắt đầu");
      } else {
        setTimeError("");
      }
      setFormData({ ...formData, End_Time: value });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleTimeRangeChange = (e) => {
    const range = e.target.value;
    if (!range) {
      setFormData({ ...formData, Start_Time: "", End_Time: "" });
      return;
    }
    const [start, end] = range.split("-");
    setFormData({ ...formData, Start_Time: start, End_Time: end });
    setTimeError("");
  };

  const validateTimes = () =>
    !(
      formData.Start_Time &&
      formData.End_Time &&
      formData.End_Time <= formData.Start_Time
    );

  // CALL API
  const submitSlot = async () => {
    if (!validateTimes()) {
      setMessage({ text: "Giờ kết thúc phải sau giờ bắt đầu", type: "error" });
      setShowConfirm(false);
      return;
    }

    try {
      const payload = {
        Slot_Date: formData.Slot_Date,
        Start_Time: formData.Start_Time,
        End_Time: formData.End_Time,
        Max_Volume: parseInt(formData.Max_Volume, 10),
      };
      await createSlot(payload);
      setMessage({ text: "Tạo ca hiến máu thành công!", type: "success" });
      setFormData({
        Slot_Date: "",
        Start_Time: "",
        End_Time: "",
        Max_Volume: "",
      });
    } catch (err) {
      setMessage({
        text: err.message || "Đã xảy ra lỗi khi tạo ca hiến máu",
        type: "error",
      });
    } finally {
      setShowConfirm(false);
    }
  };

  // UI
  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-center text-lg font-semibold text-blue-600 mb-6">
        Tạo Ca Hiến Máu
      </h2>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded text-center ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* FORM */}
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium mb-1">Ngày</label>
          <input
            type="date"
            name="Slot_Date"
            value={formData.Slot_Date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
            min={new Date().toLocaleDateString("en-CA")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Khung Giờ</label>
          <select
            value={
              formData.Start_Time && formData.End_Time
                ? `${formData.Start_Time}-${formData.End_Time}`
                : ""
            }
            onChange={handleTimeRangeChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Chọn khung giờ hiến máu</option>
            <option value="07:00-11:00">07:00 - 11:00</option>
            <option value="13:00-17:00">13:00 - 17:00</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Giờ Bắt Đầu</label>
          <input
            type="time"
            name="Start_Time"
            value={formData.Start_Time}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Giờ Kết Thúc</label>
          <input
            type="time"
            name="End_Time"
            value={formData.End_Time}
            onChange={handleChange}
            className={`w-full border ${
              timeError ? "border-red-500" : "border-gray-300"
            } rounded px-3 py-2`}
            required
            disabled={!formData.Start_Time}
          />
          {timeError && (
            <p className="text-red-500 text-xs mt-1">{timeError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Sức Chứa Tối Đa (Người)
          </label>
          <input
            type="number"
            name="Max_Volume"
            value={formData.Max_Volume}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="200"
            required
            min="1"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          disabled={loading || !!timeError}
          className={`w-full ${
            loading || timeError
              ? "bg-blue-400"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white py-2 rounded transition`}
        >
          {loading ? "Đang xử lý..." : "Tạo Ca Hiến Máu"}
        </button>
      </form>

      {/* MODAL XÁC NHẬN */}
      <AnimatePresence>
        {showConfirm && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => !loading && setShowConfirm(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />

            {/* Wrapper center */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white w-full max-w-sm rounded-lg p-6 shadow-lg"
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Xác nhận tạo ca?
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Tạo ca hiến máu ngày <b>{formData.Slot_Date || "--"}</b> từ{" "}
                  <b>{formData.Start_Time || "--:--"}</b> đến{" "}
                  <b>{formData.End_Time || "--:--"}</b>?
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800"
                    onClick={() => setShowConfirm(false)}
                    disabled={loading}
                  >
                    Huỷ
                  </button>
                  <button
                    className={`px-4 py-2 text-white rounded ${
                      loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    onClick={submitSlot}
                    disabled={loading}
                  >
                    {loading ? "Đang tạo..." : "Xác nhận"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
