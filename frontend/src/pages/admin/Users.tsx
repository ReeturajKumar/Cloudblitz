/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Trash2, UserPlus, Search, Edit } from "lucide-react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../../context/useAuth";
import { UserStats } from "../../component/dashboard/UserStats";
import { AddUserModal } from "../../component/users/AddUserModal";
import { EditUserModal } from "../../component/users/EditUserModal";

const UsersPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [users, setUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users?page=${page}&limit=${limit}`);

      let usersData: any[] = [];

      if (Array.isArray(res.data)) {
        usersData = res.data;
      } else if (res.data.data) {
        usersData = res.data.data;
      } else if (res.data.users) {
        usersData = res.data.users;
      }

      setUsers(usersData);
      setAllUsers(usersData);
      setTotal(res.data.total || usersData.length);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await api.get("/users?limit=1000");

      let usersData: any[] = [];

      if (Array.isArray(res.data)) usersData = res.data;
      else if (res.data.data) usersData = res.data.data;
      else if (res.data.users) usersData = res.data.users;

      setAllUsers(usersData);
    } catch (err) {
      console.error("Failed to fetch all users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAllUsers();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!isAdmin) return toast.warning("Only admin can delete users");
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted successfully");
      fetchUsers();
      fetchAllUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  const openEditModal = (user: any) => {
    if (!isAdmin) return toast.warning("Only admin can edit users");
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const filteredUsers = search
    ? allUsers.filter(
        (u) =>
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage system users and their roles
            </p>
          </div>

          {isAdmin ? (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              <UserPlus size={20} />
              Add User
            </button>
          ) : (
            <button
              disabled
              className="px-6 py-2.5 bg-gray-300 text-gray-600 rounded-lg font-medium flex items-center gap-2 cursor-not-allowed"
            >
              <UserPlus size={20} />
              Add User
            </button>
          )}
        </div>

        {/* Stats Section */}
        <UserStats users={allUsers} total={total} />

        {/* Table Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 p-4 flex items-center justify-between">
            {/* Search */}
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
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>

            {/* Pagination */}
            {!search && totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
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
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{u.name}</td>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border 
                          ${
                            u.role === "admin"
                              ? "bg-blue-100 text-blue-700 border-blue-200"
                              : "bg-green-100 text-green-700 border-green-200"
                          }`}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(u)}
                          disabled={!isAdmin}
                          className={`p-2 rounded-lg ${
                            isAdmin ? "hover:bg-gray-100" : "opacity-50"
                          }`}
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(u._id)}
                          disabled={!isAdmin}
                          className={`p-2 rounded-lg ${
                            isAdmin
                              ? "hover:bg-red-50 text-red-600"
                              : "opacity-50"
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

        {/* Modals */}
        <AddUserModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchUsers}
        />

        <EditUserModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          selectedUser={selectedUser}
          isAdmin={isAdmin}
          onSuccess={fetchUsers}
        />
      </div>
    </div>
  );
};

export default UsersPage;
