/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "../../services/api";
import { toast } from "react-toastify";

export const EditUserModal = ({
  open,
  onClose,
  selectedUser,
  isAdmin,
  onSuccess,
}: any) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "staff",
  });

  const [saving, setSaving] = useState(false);

  // Load selected user into modal fields
  useEffect(() => {
    if (open && selectedUser) {
      setForm({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
      });
    }
  }, [open, selectedUser]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!isAdmin) return toast.warning("Only admin can update users");

    try {
      setSaving(true);

      await api.put(`/users/${selectedUser._id}`, {
        role: form.role, // only role editable
      });

      toast.success("User updated successfully");

      onSuccess?.(); // Refresh parent list
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold text-gray-800">Edit User</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <input
            type="text"
            value={form.name}
            disabled
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
          />

          <input
            type="email"
            value={form.email}
            disabled
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
          />

          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className={`w-full py-2 rounded-lg text-white font-semibold transition cursor-pointer 
              ${saving ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};
