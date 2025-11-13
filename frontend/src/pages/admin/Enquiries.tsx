/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { Search, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { EnquiryDetailsDialog } from "../../component/enquiry/EnquiryDetailsDialog";
import { NewEnquiryDialog } from "../../component/enquiry/NewEnquiryDialog";
import {
  ClipboardList,
  MessageSquare,
  Activity,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";

const EnquiryPage = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [globalStats, setGlobalStats] = useState({
    total: 0,
    new: 0,
    in_progress: 0,
    closed: 0,
  });
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // Add refresh trigger state
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Create refresh function
  const refreshAll = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const fetchGlobalStats = async () => {
    try {
      const res = await api.get("/enquiries?limit=10000");
      const all = res.data.data || [];
      const active = all.filter((e: any) => !e.deleted);

      setGlobalStats({
        total: active.length,
        new: active.filter((e: any) => e.status === "new").length,
        in_progress: active.filter((e: any) => e.status === "in_progress")
          .length,
        closed: active.filter((e: any) => e.status === "closed").length,
      });
    } catch (err) {
      console.error("Failed to fetch global stats:", err);
    }
  };

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

  // Single useEffect with refreshTrigger dependency
  useEffect(() => {
    fetchEnquiries();
    fetchGlobalStats();
  }, [search, refreshTrigger]); // Added refreshTrigger here

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?"))
      return;
    try {
      await api.delete(`/enquiries/${id}`);
      toast.success("Enquiry deleted successfully");
      refreshAll(); // Use refreshAll instead of individual fetches
    } catch (err) {
      toast.error("Failed to delete enquiry");
    }
  };

  // Filter by status
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

  // Stats counts
  const cards = [
    {
      label: "Total Enquiries",
      value: globalStats.total,
      icon: <ClipboardList size={20} className="text-white" />,
      iconBg: "bg-blue-500",
    },
    {
      label: "New Today",
      value: globalStats.new,
      icon: <MessageSquare size={20} className="text-white" />,
      iconBg: "bg-pink-500",
    },
    {
      label: "In Progress",
      value: globalStats.in_progress,
      icon: <Activity size={20} className="text-white" />,
      iconBg: "bg-orange-500",
    },
    {
      label: "Closed Enquiries",
      value: globalStats.closed,
      icon: <CheckCircle size={20} className="text-white" />,
      iconBg: "bg-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
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
            {isAdmin && (
              <NewEnquiryDialog onCreated={refreshAll} /> // Use refreshAll here
            )}
          </div>
        </div>

        {/* Stats - These will now update instantly */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {card.value}
                </h3>
              </div>
              <div
                className={`${card.iconBg} w-10 h-10 rounded-full flex items-center justify-center`}
              >
                {card.icon}
              </div>
            </div>
          ))}
        </div>

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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
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
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(enq._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            title="Delete"
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
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => fetchEnquiries(page - 1)}
                className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all flex items-center gap-1 disabled:opacity-50 cursor-pointer"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => fetchEnquiries(page + 1)}
                className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all flex items-center gap-1 disabled:opacity-50 cursor-pointer"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Dialog */}
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
