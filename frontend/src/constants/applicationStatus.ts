export const APPLICATION_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  DOCUMENT_REQUESTED: "DOCUMENT_REQUESTED",
  UNDER_REVIEW: "UNDER_REVIEW",
} as const;

export const STATUS_LABELS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  DOCUMENT_REQUESTED: "Document Requested",
  UNDER_REVIEW: "Under Review",
};

export const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  DOCUMENT_REQUESTED: "bg-blue-100 text-blue-700",
  UNDER_REVIEW: "bg-purple-100 text-purple-700",
};
