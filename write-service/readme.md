# Write-Service

Documentation over endpoints and explains the backend models of the different resources.

## Index

- [POST user/register](#post-userregister)
- [POST posts/create](#post-postscreate)
- [DELETE posts/:id](#delete-postsid)
- [POST follow/:id](#post-followid)
- [DELETE follow/:id](#delete-followid)

## POST /user/register

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
  "status": 201,
  "message": "User registered successfully",
  "email": "user@example.com",
  "username": "johnDoe",
  "userId": "u123456"
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
  "message": "string",  
  "data": {
    "id": "string",
    "authorId": "string",
    "content": "string",
    "createdAt": "string"
  }
}
```

#### Error Cases

- 400: Missing required fields (authorId or content)
- 409: Content exceeds maximum length of 42 characters

#### 400 Bad Request

Returned when required fields are missing.

```json
{
    "status": 400,
    "message": "string",
}
```

### 409 Conflict

Returned when the content length exceeds the maximum allowed.

```json
{
    "status": 409,
    "message": "Content exceeds maximum length",
}
```

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
  "message": "Post created successfully",
  
  "data": {
    "id": "2",
    "authorId": "user123",
    "content": "Hello, world!",
    "createdAt": "2025-01-04"
  }
}
```

## DELETE /posts/:id

Deletes a specific post from the system.

### Request

#### Endpoint

```json
DELETE /posts/:id
```

#### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Unique identifier of the post to delete |

### Responses

#### 204 No Content

Post was successfully deleted. No response body.

#### 404 Not Found

Returned when the specified post ID does not exist.

```json
{
    "status": 404,
    "message": "Post with specified ID not found",
    "id": "string"
}
```

### Example

#### Request

```
DELETE /posts/post456
```

#### Error Response (Post Not Found)

```json
{
    "status": 404,
    "message": "Post with specified ID not found",
    "id": 456
}
```

## POST /follow/:id

Creates a follow relationship between two users.

### Request

#### Endpoint

```
POST /follow/:id
```

#### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | ID of the user to be followed |

#### Request Body

```json
{
    "followerId": "string"
}
```

#### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| followerId | string | Yes | ID of the user doing the following |

### Responses

#### 201 Created

Follow relationship was successfully created.

```json
{
    "status": 201,
    "message": "Follow relationship created successfully",
    "followerId": "string",
    "followedId": "string"
}
```

#### 404 Not Found

Returned when either the follower or followed user ID does not exist.

```json
{
    "status": 404,
    "message": "User not found",
    "id": "string"
}
```

#### 409 Conflict

Returned when a follow relationship already exists between these users.

```json
{
    "status": 409,
    "message": "Follow relationship already exists",
    "followerId": "string",
    "followedId": "string"
}
```

### Example

#### Request

```
POST /follow/user123
```

```json
{
    "followerId": "user456"
}
```

#### Success Response

```json
{
    "status": 201,
    "message": "Follow relationship created successfully",
    "followerId": "user456",
    "followedId": "user123"
}
```

#### Error Response (User Not Found)

```json
{
    "status": 404,
    "message": "User not found",
    "id": "user123"
}
```

#### Error Response (Already Following)

```json
{
    "status": 409,
    "message": "Follow relationship already exists",
    "followerId": "user456",
    "followedId": "user123"
}
```

## DELETE /follow/:id

Removes a follow relationship between two users.

### Request

#### Endpoint

```
DELETE /follow/:id
```

#### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | ID of the user to be unfollowed |

#### Request Body

```json
{
    "followerId": "string"
}
```

#### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| followerId | string | Yes | ID of the user doing the unfollowing |

### Responses

#### 204 No Content

Follow relationship was successfully removed. No response body.

#### 404 Not Found

Returned when the follow relationship does not exist.

```json
{
    "status": 404,
    "message": "Follow relationship not found",
    "followerId": "string",
    "followedId": "string"
}
```

### Example

#### Request

```
DELETE /follow/user123
```

```json
{
    "followerId": "user456"
}
```

#### Error Response (Not Found)

```json
{
    "status": 404,
    "message": "Follow relationship not found",
    "followerId": "user456",
    "followedId": "user123"
}
```
