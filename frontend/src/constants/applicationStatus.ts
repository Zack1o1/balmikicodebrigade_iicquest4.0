export const APPLICATION_STATUS = {
  SUBMITTED: "submitted",
  RECEIVED: "received",
  UNDER_REVIEW: "under_review",
  APPROVED: "approved",
  REJECTED: "rejected",
  READY_FOR_COLLECTION: "ready_for_collection",
} as const;

export const STATUS_LABELS = {
  submitted: "Submitted",
  received: "Received",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  ready_for_collection: "Ready for Collection",
};

export const STATUS_COLORS = {
  submitted: "bg-blue-100 text-blue-700",
  received: "bg-sky-100 text-sky-700",
  under_review: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  ready_for_collection: "bg-emerald-100 text-emerald-700",
};