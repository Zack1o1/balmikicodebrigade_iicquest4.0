# Smart Palika API Documentation

**Base URL:** `/api/v1` (proxied via Vite dev server to `http://localhost:5000`)

---

## Authentication

### Register
```
POST /auth/register
```
Body: `{ firstName, lastName, email, password, phoneNumber, role? }`
Response: `{ message: "If the account can be created..." }` (201)

### Login
```
POST /auth/login
```
Body: `{ email, password }`
Response: `{ token, user }` (200)

---

## Applications

All application endpoints (except tracking) require Bearer token in `Authorization` header.

### Create Application
```
POST /applications
```
Body: `{ service, applicantName, email, phone, ward, documents, ... }`
Response: application object with `applicationId` (e.g., `APP-2026-A3F2`)

### Get My Applications (citizen)
```
GET /applications/my
```
Response: array of current user's applications

### Get All Applications (admin/ward)
```
GET /applications/all
```
Response: array of all applications (with populated applicant)

### Get Application by ID
```
GET /applications/:id
```
Response: single application object

### Track Application (public)
```
GET /applications/track/:applicationId
```
Response: application object by `applicationId` (e.g., `APP-2026-A3F2`)

### Update Status
```
PUT /applications/:id/status
```
Body: `{ status, note? }`

### Approve Application (admin/ward)
```
PUT /applications/:id/approve
```
Body: `{ note? }`

### Reject Application (admin/ward)
```
PUT /applications/:id/reject
```
Body: `{ note? }`

### Request Documents (admin/ward)
```
PUT /applications/:id/request-documents
```
Body: `{ missingDocs: string[], note? }`

---

## Users

### Get Users by Role
```
GET /users?role=ward
```
Response: array of users filtered by role

### Create User
```
POST /users
```
Body: `{ firstName, lastName, email, password, phoneNumber, role, assignedWard? }`

### Delete User
```
DELETE /users/:id
```

---

## Services

### Get All Services
```
GET /services
```

### Get Service by ID
```
GET /services/:id
```

### Create Service (admin)
```
POST /services
```

### Update Service (admin)
```
PUT /services/:id
```

### Delete Service (admin)
```
DELETE /services/:id
```

---

## Dashboard Stats

### Citizen Dashboard
```
GET /dashboard/citizen
```
Response: `{ totalApplications, approvedApplications, pendingApplications, recentApplications }`

### Ward Dashboard
```
GET /dashboard/ward
```

### Admin Dashboard
```
GET /dashboard/admin
```

---

## Notifications

### Get User Notifications
```
GET /notifications
```

### Mark Notification Read
```
PUT /notifications/:id/read
```

---

## AI Chat
```
POST /api/v1/ai/chat
```
Body: `{ message }`

---

## Application Statuses

| Status | Meaning |
|--------|---------|
| PENDING | Application received, awaiting review |
| APPROVED | Application has been approved |
| REJECTED | Application has been rejected |
| DOCUMENT_REQUESTED | Staff requested additional documents |

## Default Admin Account
- Email: `admin@smartpalika.com`
- Password: `admin123`
