/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import api from "../../services/api";
import { Button } from "../../components/ui/button";
import { EnquiryDetailsDialog } from "../../component/enquiry/EnquiryDetailsDialog";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface RecentEnquiriesProps {
  onUpdated?: () => void;
  refreshTrigger?: number;
}

export function RecentEnquiries({
  onUpdated,
  refreshTrigger = 0,
}: RecentEnquiriesProps) {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const navigate = useNavigate();

  // Fetch the most recent enquiries
  const fetchRecent = async () => {
    try {
      setLoading(true);
      const res = await api.get("/enquiries");
      const all = res.data.data || [];

      const active = all.filter((e: any) => !e.deleted);
      const sorted = active.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setEnquiries(sorted.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch recent enquiries:", err);
      toast.error("Failed to load recent enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, [refreshTrigger]);

  // Helper: Status Badge styling
  const getStatusBadge = (status: string) => {
    const statusClasses: Record<string, string> = {
      new: "bg-blue-100 text-blue-700",
      in_progress: "bg-yellow-100 text-yellow-700",
      closed: "bg-green-100 text-green-700",
    };
    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
          statusClasses[status] || "bg-gray-100 text-gray-600"
        }`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Enquiries
          </h3>
          <p className="text-sm text-gray-500">
            The most recent 5 enquiries submitted by users.
          </p>
        </div>

        {/* View All Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/enquiries")}
          className="hover:bg-blue-50 text-blue-600 border-blue-200 cursor-pointer"
        >
          View All
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading enquiries...</p>
      ) : enquiries.length === 0 ? (
        <p className="text-gray-500 text-sm">No enquiries found.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-100">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 text-center font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e: any, idx: number) => (
                <tr
                  key={e._id}
                  className={`transition ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  <td className="px-4 py-3 text-gray-800 font-medium">
                    {e.customerName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{e.email}</td>
                  <td className="px-4 py-3 text-gray-600">{e.phone}</td>
                  <td className="px-4 py-3">{getStatusBadge(e.status)}</td>
                  <td className="px-4 py-3 text-gray-500 text-sm">
                    {new Date(e.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedEnquiry(e)}
                      className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Enquiry Details Dialog */}
      {selectedEnquiry && (
        <EnquiryDetailsDialog
          enquiry={selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          onUpdated={() => {
            fetchRecent();
            if (onUpdated) onUpdated();
          }}
        />
      )}
    </div>
  );
}
