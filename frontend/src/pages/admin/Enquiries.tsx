/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { Search, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { EnquiryDetailsDialog } from "../../component/enquiry/EnquiryDetailsDialog";
import { NewEnquiryDialog } from "../../component/enquiry/NewEnquiryDialog";
import { useAuth } from "../../context/useAuth";
import { StatusOverview } from "../../component/dashboard/StatusCards";

const EnquiryPage = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const refreshAll = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const fetchEnquiries = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/enquiries?page=${pageNum}&limit=10&search=${search}`
      );
      const all = res.data.data || [];
      const active = all.filter((e: any) => !e.deleted);
      setEnquiries(active);

      setPage(res.data.page);
      setTotalPages(Math.ceil(res.data.total / res.data.limit));
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [search, refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?"))
      return;

    try {
      await api.delete(`/enquiries/${id}`);
      toast.success("Enquiry deleted successfully");
      refreshAll();
    } catch (err) {
      toast.error("Failed to delete enquiry");
    }
  };

  const filteredEnquiries =
    selectedTab === "all"
      ? enquiries
      : enquiries.filter((e) => e.status === selectedTab);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: "bg-blue-100 text-blue-700 border-blue-200",
      in_progress: "bg-orange-100 text-orange-700 border-orange-200",
      closed: "bg-green-100 text-green-700 border-green-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="w-full mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              Enquiry Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and track all customer enquiries in one place
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && <NewEnquiryDialog onCreated={refreshAll} />}
          </div>
        </div>

        <StatusOverview refreshTrigger={refreshTrigger} />

        {/* Filters */}
        <div className="border-b border-gray-200 pb-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 ">
            {["all", "new", "in_progress", "closed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedTab === tab
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search enquiries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Assigned To</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    Loading enquiries...
                  </td>
                </tr>
              ) : filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No enquiries found.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enq) => (
                  <tr
                    key={enq._id}
                    className="border-b hover:bg-gray-50 transition-all"
                  >
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {enq.customerName}
                    </td>
                    <td className="px-6 py-3">{enq.email}</td>
                    <td className="px-6 py-3">{enq.phone}</td>

                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          enq.status
                        )}`}
                      >
                        {enq.status.replace("_", " ")}
                      </span>
                    </td>

                    <td className="px-6 py-3">
                      {enq.assignedTo?.name || "Unassigned"}
                    </td>

                    <td className="px-6 py-3">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedEnquiry(enq)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(enq._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="border-t border-gray-200 px-8 py-8 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => fetchEnquiries(page - 1)}
                className="px-2 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 cursor-pointer"
              >
                <ChevronLeft size={15} />
              </button>

              <button
                disabled={page >= totalPages}
                onClick={() => fetchEnquiries(page + 1)}
                className="px-2 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 cursor-pointer"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedEnquiry && (
        <EnquiryDetailsDialog
          enquiry={selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          onUpdated={refreshAll}
        />
      )}
    </div>
  );
};

export default EnquiryPage;
