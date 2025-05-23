# 🚀 DevTinder API Documentation

## 📝 Authentication APIs

### POST `/auth/signup`
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string",
    "name": "string",
    "skills": ["string"],
    "interests": ["string"]
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "token": "jwt_token",
      "user": {
        "_id": "user_id",
        "name": "string",
        "email": "string"
      }
    }
  }
  ```

### POST `/auth/login`
- **Description**: Authenticate user and get JWT token
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "token": "jwt_token",
      "user": {
        "_id": "user_id",
        "name": "string",
        "email": "string"
      }
    }
  }
  ```

### POST `/auth/logout`
- **Description**: Invalidate user's JWT token
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Logged out successfully"
  }
  ```

## 📱 Profile APIs

### GET `/profile/view`
- **Description**: View current user's profile
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "user": {
        "_id": "user_id",
        "name": "string",
        "email": "string",
        "skills": ["string"],
        "interests": ["string"],
        "connections": number,
        "projects": ["string"]
      }
    }
  }
  ```

### PATCH `/profile/edit`
- **Description**: Update user profile
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "name": "string",
    "skills": ["string"],
    "interests": ["string"],
    "projects": ["string"]
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Profile updated successfully"
  }
  ```

### PATCH `/profile/password`
- **Description**: Change user password
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Password changed successfully"
  }
  ```

## 🔄 Connection APIs

### POST `/connections/request/send/:status/:userId`
- **Description**: Send a connection request
- **Headers**: `Authorization: Bearer <token>`
- **Path Params**:
  - `status`: "interested" | "ignore"
  - `userId`: target user ID
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Connection request sent"
  }
  ```

### POST `/connections/request/review/:status/:requestId`
- **Description**: Review and respond to connection request
- **Headers**: `Authorization: Bearer <token>`
- **Path Params**:
  - `status`: "accepted" | "rejected"
  - `requestId`: request ID to review
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Request reviewed successfully"
  }
  ```

### GET `/user/connections`
- **Description**: Get user's connections
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "connections": [
        {
          "_id": "user_id",
          "name": "string",
          "skills": ["string"],
          "interests": ["string"]
        }
      ]
    }
  }
  ```

### GET `/user/requests/received`
- **Description**: Get received connection requests
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "requests": [
        {
          "_id": "request_id",
          "sender": {
            "_id": "user_id",
            "name": "string",
            "skills": ["string"]
          },
          "status": "pending"
        }
      ]
    }
  }
  ```

### GET `/user/feed`
- **Description**: Get user's personalized feed
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "feed": [
        {
          "_id": "user_id",
          "name": "string",
          "skills": ["string"],
          "interests": ["string"],
          "projects": ["string"],
          "matchScore": number
        }
      ]
    }
  }
  ```
