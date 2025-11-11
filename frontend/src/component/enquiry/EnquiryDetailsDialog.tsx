/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import { useAuth } from "../../context/useAuth";

interface Props {
  enquiry: any;
  onClose: () => void;
  onUpdated?: () => void; // callback to refresh parent data
}

export const EnquiryDetailsDialog = ({
  enquiry,
  onClose,
  onUpdated,
}: Props) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [editableEnquiry, setEditableEnquiry] = useState(enquiry);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditableEnquiry(enquiry);
  }, [enquiry]);

  // ✅ Fetch staff list (only for admin)
  useEffect(() => {
    if (!isAdmin) return;

    const fetchStaff = async () => {
      if (!isAdmin) return;
      try {
        const res = await api.get("/users");
        // Handle both { data: [] } or direct [] API responses
        const users = Array.isArray(res.data) ? res.data : res.data.data || [];
        const staff = users.filter((u: any) => u.role === "staff");
        setStaffList(staff);
      } catch (err) {
        console.error("Failed to fetch staff list:", err);
      }
    };

    fetchStaff();
  }, [isAdmin]);

  // ✅ Update Enquiry (Admin only)
  const handleUpdate = async () => {
    try {
      setSaving(true);
      const { status, assignedTo } = editableEnquiry;

      await api.put(`/enquiries/${enquiry._id}`, {
        status,
        assignedTo: assignedTo?._id || null,
      });

      toast.success("Enquiry updated successfully");

      // ✅ Trigger both parent refresh & close dialog
      if (onUpdated) onUpdated(); // 🔥 THIS triggers RecentEnquiries + Dashboard
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update enquiry");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!enquiry} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Enquiry Details</DialogTitle>
          <DialogDescription>
            {isAdmin
              ? "Admins can change status or assign this enquiry."
              : "You can only view the enquiry details."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          {/* Name */}
          <div>
            <Label>Name</Label>
            <Input value={editableEnquiry.customerName} disabled />
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input value={editableEnquiry.email} disabled />
          </div>

          {/* Phone */}
          <div>
            <Label>Phone</Label>
            <Input value={editableEnquiry.phone} disabled />
          </div>

          {/* Message */}
          <div>
            <Label>Message</Label>
            <Input value={editableEnquiry.message} disabled />
          </div>

          {/* Admin Editable Section */}
          {/* ✅ Editable Section Based on Role */}
          {isAdmin ? (
            <>
              {/* 🟦 Admin: can update both status and assign staff */}
              <div>
                <Label>Status</Label>
                <Select
                  value={editableEnquiry.status}
                  onValueChange={(value) =>
                    setEditableEnquiry({ ...editableEnquiry, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Assigned To</Label>
                <Select
                  value={editableEnquiry.assignedTo?._id || ""}
                  onValueChange={(value) =>
                    setEditableEnquiry({
                      ...editableEnquiry,
                      assignedTo: staffList.find((s) => s._id === value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        editableEnquiry.assignedTo
                          ? editableEnquiry.assignedTo.name
                          : "Select staff"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {staffList.length > 0 ? (
                      staffList.map((s) => (
                        <SelectItem key={s._id} value={s._id}>
                          {s.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No staff available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : user?.role === "staff" &&
            editableEnquiry.assignedTo?._id === user?._id ? (
            <>
              {/* 🟧 Staff: can update ONLY their assigned enquiry's status */}
              <div>
                <Label>Status</Label>
                <Select
                  value={editableEnquiry.status}
                  onValueChange={(value) =>
                    setEditableEnquiry({ ...editableEnquiry, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Assigned To</Label>
                <Input
                  value={editableEnquiry.assignedTo?.name || "Not Assigned"}
                  disabled
                />
              </div>
            </>
          ) : (
            <>
              {/* 🩶 View-Only for others */}
              <div>
                <Label>Status</Label>
                <Input
                  value={editableEnquiry.status.replace("_", " ")}
                  disabled
                />
              </div>
              <div>
                <Label>Assigned To</Label>
                <Input
                  value={editableEnquiry.assignedTo?.name || "Not Assigned"}
                  disabled
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Close
          </Button>
          {(isAdmin ||
            (user?.role === "staff" &&
              editableEnquiry.assignedTo?._id === user?._id)) && (
            <Button
              onClick={handleUpdate}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              {saving ? "Saving..." : "Update"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
