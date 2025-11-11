/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Trash2,
  UserPlus,
  Users,
  Shield,
  Search,
  RefreshCw,
  Edit,
  X,
  Clock,
} from "lucide-react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../../context/useAuth";

// 🎨 Reusable Modal Component
const Modal = ({ title, onClose, children }: any) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-200">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
          <X size={18} />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

const UsersPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [users, setUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]); // Store all users for search
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  // ✅ Fetch Users - Fixed to handle API response properly
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users?page=${page}&limit=${limit}`);

      // Handle different API response structures
      let usersData = [];
      if (Array.isArray(res.data)) {
        usersData = res.data;
      } else if (res.data.data && Array.isArray(res.data.data)) {
        usersData = res.data.data;
      } else if (res.data.users && Array.isArray(res.data.users)) {
        usersData = res.data.users;
      }

      setUsers(usersData);
      setAllUsers(usersData); // Store for search functionality
      setTotal(res.data.total || usersData.length);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users for search (optional - if your API supports it)
  const fetchAllUsers = async () => {
    try {
      const res = await api.get("/users?limit=1000"); // Get all users for search
      let allUsersData = [];

      if (Array.isArray(res.data)) {
        allUsersData = res.data;
      } else if (res.data.data && Array.isArray(res.data.data)) {
        allUsersData = res.data.data;
      } else if (res.data.users && Array.isArray(res.data.users)) {
        allUsersData = res.data.users;
      }

      setAllUsers(allUsersData);
    } catch (err) {
      console.error("Failed to fetch all users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAllUsers(); // Fetch all users for search functionality
  }, [page]);

  // ✅ Delete User - Fixed to refresh data properly
  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      toast.warning("Only admin can delete users");
      return;
    }
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);

      // Refresh both current page data and all users data
      await fetchUsers();
      await fetchAllUsers();

      // Also update local state immediately for better UX
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setAllUsers((prev) => prev.filter((u) => u._id !== id));
      setTotal((prev) => prev - 1);

      toast.success("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user");
    }
  };

  // ✅ Create User - Fixed to handle pagination
  const handleAddUser = async () => {
    if (!isAdmin) {
      toast.warning("Only admin can create users");
      return;
    }

    if (!formData.name || !formData.email || !formData.password) {
      toast.warning("All fields are required");
      return;
    }

    try {
      const res = await api.post("/users", formData);
      const newUser = res.data.data || res.data;

      // Refresh data from server to ensure consistency
      await fetchUsers();
      await fetchAllUsers();

      // If we're not on page 1, go to page 1 to see the new user
      if (page !== 1) {
        setPage(1);
      } else {
        // If on page 1, update local state immediately
        setUsers((prev) => [newUser, ...prev.slice(0, limit - 1)]);
        setAllUsers((prev) => [newUser, ...prev]);
      }

      setTotal((prev) => prev + 1);
      toast.success("User created successfully");
      setShowAddModal(false);
      setFormData({ name: "", email: "", password: "", role: "staff" });
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create user");
    }
  };

  // ✅ Edit User - Fixed to refresh data properly
  const handleEditUser = async () => {
    if (!isAdmin) {
      toast.warning("Only admin can edit users");
      return;
    }

    if (!editUser || !formData.name || !formData.email) {
      toast.warning("All fields are required");
      return;
    }

    try {
      const res = await api.put(`/users/${editUser._id}`, formData);
      const updatedUser = res.data.data || res.data;

      // Refresh data from server
      await fetchUsers();
      await fetchAllUsers();

      toast.success("User updated successfully");
      setShowEditModal(false);
      setEditUser(null);
      setFormData({ name: "", email: "", password: "", role: "staff" });
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update user");
    }
  };

  // ✅ Populate form for edit
  const openEditModal = (user: any) => {
    if (!isAdmin) {
      toast.warning("Only admin can edit users");
      return;
    }
    setEditUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Don't pre-fill password
      role: user.role,
    });
    setShowEditModal(true);
  };

  // ✅ Filtered users (search) - Use allUsers for comprehensive search
  const filteredUsers = allUsers.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(total / limit);
  const displayUsers = search ? filteredUsers : users;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              User Management
            </h1>
            <p className="text-gray-600 mt-2">Manage system users and roles</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchUsers();
                fetchAllUsers();
              }}
              className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw size={18} />
              Refresh
            </button>

            {isAdmin ? (
              <button
                onClick={() => {
                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                    role: "staff",
                  });
                  setShowAddModal(true);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                <UserPlus size={20} />
                Add User
              </button>
            ) : (
              <button
                disabled
                className="px-6 py-2.5 bg-gray-300 text-gray-600 rounded-lg font-medium flex items-center gap-2 cursor-not-allowed cursor-pointer"
              >
                <UserPlus size={20} />
                Add User
              </button>
            )}
          </div>
        </div>

        {/* Stats Section - Fixed to use allUsers for accurate counts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Users</p>
                <h3 className="text-3xl font-bold">{total}</h3>
              </div>
              <div className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-gradient-to-r from-blue-500 to-indigo-500">
                <Users size={20} />
              </div>
            </div>
          </div>

          {/* Admins */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Admins</p>
                <h3 className="text-3xl font-bold">
                  {allUsers.filter((u) => u.role === "admin").length}
                </h3>
              </div>
              <div className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-gradient-to-r from-green-500 to-emerald-600">
                <Shield size={20} />
              </div>
            </div>
          </div>

          {/* Staff */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Staff</p>
                <h3 className="text-3xl font-bold">
                  {allUsers.filter((u) => u.role === "staff").length}
                </h3>
              </div>
              <div className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-gradient-to-r from-orange-400 to-yellow-500">
                <Users size={20} />
              </div>
            </div>
          </div>

          {/* Recently Added */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Recently Added</p>
                <h3 className="text-3xl font-bold">
                  {
                    allUsers.filter((u) => {
                      const created = new Date(u.createdAt);
                      const diff =
                        (Date.now() - created.getTime()) /
                        (1000 * 60 * 60 * 24);
                      return diff <= 7; // last 7 days
                    }).length
                  }
                </h3>
              </div>
              <div className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-gradient-to-r from-purple-500 to-pink-500">
                <Clock size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Table Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-64"
              />
            </div>

            {/* Pagination Controls */}
            {!search && totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : displayUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      {search ? "No users match your search" : "No users found"}
                    </td>
                  </tr>
                ) : (
                  displayUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            user.role === "admin"
                              ? "bg-blue-100 text-blue-700 border-blue-200"
                              : "bg-green-100 text-green-700 border-green-200"
                          }`}
                        >
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          disabled={!isAdmin}
                          className={`p-2 rounded-lg transition-all cursor-pointer ${
                            isAdmin
                              ? "text-gray-600 hover:bg-gray-100"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={!isAdmin}
                          className={`p-2 rounded-lg transition-all cursor-pointer ${
                            isAdmin
                              ? "text-red-600 hover:bg-red-50"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <Modal title="Add New User" onClose={() => setShowAddModal(false)}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleAddUser}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-md transition"
            >
              Create User
            </button>
          </div>
        </Modal>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <Modal title="Edit User" onClose={() => setShowEditModal(false)}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              disabled={true}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              disabled={true}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {/* <input
              type="password"
              placeholder="New Password (leave blank to keep current)"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            /> */}
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleEditUser}
              className="w-full py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-md transition cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UsersPage;
