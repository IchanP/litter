# Write-Service

Documentation over endpoints and explains the backend models of the different resources.

## /user/register

Endpoint for registering new users in the system.

```json
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

**Code**: 201 OK

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

**Code**: 400 Validation Error

```json
{
  "status": 400,
  "message": "Missing required fields",
}
```

##### Duplicate Data

**Code**: 409 Conflict

```json
{
  "status": 409,
  "message": "Field already exists",
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

## POST /posts/create

Creates a new post in the system.

### Request

#### Endpoint

```json
POST /posts/create
```

### Request Body

```json
{
  "authorId": "string",
  "content": "string"
}
```

##### Fields

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| authorId | string | Yes | - | Unique identifier of the post author |
| content | string | Yes | Max length: 42 characters | The content of the post |

### Responses

#### 201 Created

Successful creation of the post.

```json
{
  "id": "string",
  "authorId": "string",
  "content": "string",
  "createdAt": "string"
}
```

#### 400 Bad Request

Returned when required fields are missing.

```json
{
  "error": {
    "status": 400,
    "message": "string",
  }
}
```

### 409 Conflict

Returned when the content length exceeds the maximum allowed.

```json
{
  "error": {
    "code": 409,
    "message": "string",
  }
}
```

#### Error Cases

- 400: Missing required fields (authorId or content)
- 409: Content exceeds maximum length of 42 characters

## Example

### Request

```json
{
  "authorId": "user123",
  "content": "Hello, world!"
}
```

### Success Response

```json
{
  "id": "post456",
  "authorId": "user123",
  "content": "Hello, world!",
  "createdAt": "2025-01-04T12:00:00Z"
}
```

### Error Response (Content Too Long)

```json
{
  "error": {
    "status": 409,
    "message": "Content exceeds maximum length",
  }
}
```
