# Write-Service

Documentation over endpoints and explains the backend models of the different resources.

## /user/register

Endpoint for registering new users in the system.

```
POST /user/register
```

### Request Body

```json
{
  "email": "string",
  "username": "string",
  "userId": "string"
}
```

#### Fields

| Field    | Type   | Required | Description                               |
|----------|--------|----------|-------------------------------------------|
| email    | string | Yes      | User's email address                      |
| username | string | Yes      | The username for the account          |
| userId   | string | Yes      | Unique identifier for the user            |

### Responses

#### Success Response

**Code**: 200 OK

```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "email": "user@example.com",
    "username": "johnDoe",
    "userId": "u123456"
  }
}
```

#### Error Responses

##### Missing Required Fields

**Code**: 403 Forbidden

```json
{
  "status": "error",
  "message": "Missing required fields",
}
```

##### Duplicate Data

**Code**: 409 Conflict

```json
{
  "status": "error",
  "message": "User already exists",
  "details": {
    "conflictField": "email"
  }
}
```

### Example Request

```bash
curl -X POST \
  http://api.example.com/user/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "username": "johnDoe",
    "userId": "u123456"
  }'
```
