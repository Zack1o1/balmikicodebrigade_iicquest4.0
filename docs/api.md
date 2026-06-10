# Smart Palika API

## Base URL
`http://localhost:5000/api`

## Auth Endpoints

### Register
`POST /auth/register`

Body:
```json
{
  "name": "User Name",
  "email": "user@domain.com",
  "password": "Password123!",
  "role": "customer"
}
```

Roles: `customer`, `staff`, `admin`

### Login
`POST /auth/login`

Body:
```json
{
  "email": "ram.customer@palika.gov.np",
  "password": "Password123!"
}
```

Response:
```json
{
  "user": { "id": 1, "name": "Ram Sharma", "email": "...", "role": "customer" },
  "token": "eyJhbG..."
}
```

### Get Current User
`GET /auth/me`

Headers: `Authorization: Bearer <token>`

## Test Credentials

| Role     | Email                       | Password      |
|----------|-----------------------------|---------------|
| Customer | ram.customer@palika.gov.np  | Password123!  |
| Staff    | sita.staff@palika.gov.np    | Password123!  |
| Admin    | admin@palika.gov.np         | Password123!  |
