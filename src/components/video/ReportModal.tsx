"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button, Select } from "@/components/ui";
import toast from "react-hot-toast";

interface ReportModalProps {
  reportedUserId: string;
  callId: string;
  onClose: () => void;
}

const REPORT_REASONS = [
  { value: "inappropriate-behavior", label: "Inappropriate Behavior" },
  { value: "harassment", label: "Harassment" },
  { value: "spam", label: "Spam / Advertising" },
  { value: "underage", label: "Underage User" },
  { value: "illegal-content", label: "Illegal Content" },
  { value: "other", label: "Other" },
];

export default function ReportModal({
  reportedUserId,
  callId,
  onClose,
}: ReportModalProps) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason) {
      toast.error("Please select a reason");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportedUserId,
          callId,
          reason,
          description,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Report submitted successfully");
        onClose();
      } else {
        toast.error(data.error || "Failed to submit report");
      }
    } catch (error) {
      toast.error("Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-dark-900 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-dark-800">
          <h2 className="text-lg font-semibold text-white">Report User</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <Select
            label="Reason for reporting"
            options={[
              { value: "", label: "Select a reason..." },
              ...REPORT_REASONS,
            ]}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1.5">
              Additional details (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={1000}
              className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-dark-600 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Provide any additional information..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              className="flex-1"
              isLoading={isSubmitting}
            >
              Submit Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
