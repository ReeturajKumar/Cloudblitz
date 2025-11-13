/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { X } from "lucide-react";
import api from "../../services/api";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // refresh parent
}

export const AddUserModal = ({ open, onClose, onSuccess }: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.warning("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/users", formData);

      toast.success("User created successfully");
      setFormData({ name: "", email: "", password: "", role: "staff" });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const disableClass = loading ? "opacity-60 pointer-events-none" : "";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold text-gray-800">Add New User</h2>

          <button
            onClick={!loading ? onClose : undefined}
            className={`p-2 rounded-lg cursor-pointer ${
              loading ? "opacity-50 pointer-events-none" : "hover:bg-gray-100"
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className={disableClass}>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              disabled={loading}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              disabled={loading}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-3"
            />

            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              disabled={loading}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-3"
            />

            <select
              value={formData.role}
              disabled={loading}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-3"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-md cursor-pointer"
            }`}
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
};
