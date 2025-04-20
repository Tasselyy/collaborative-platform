## 📡 API Documentation

This document all available API endpoints in the Collaborative Data Analysis Platform. It uses `Next.js 13 App Router` conventions.


### 🧑‍💻 Authentication

#### `GET/POST /api/auth/[...all]`
**Description:** Handles user sign-in, sign-up, session, and OAuth callbacks using `better-auth`.

- **GET**: Check current session
- **POST**: Sign in / Sign up

**Response:**
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  },
  "expires": "timestamp"
}
```


### ☁️ Cloud Upload / Download

#### `POST /api/cloud-upload`
**Description:** Upload dataset files (CSV, Excel, JSON) to S3 cloud storage.

**Request:** `multipart/form-data`
- `file`: File to upload

**Response:**
```json
{
  "url": "https://signed-s3-url"
}
```

#### `GET /api/cloud-get?filename=...`
**Description:** Generate a signed URL to download a file from S3.

**Query Parameter:**
- `filename`: The name of the file

**Response:**
```json
{
  "url": "https://signed-s3-url"
}
```

## 📊 Dataset API

### `GET /api/dataset`
**Description:** Get datasets visible to the user (PUBLIC, PRIVATE, TEAM-based access).

**Query Params:**
- `teamId` (optional): filter by team ownership

**Response:** List of datasets with metadata
```json
[{
  "id": "string",
  "name": "string",
  "owner": "string",
  "visibility": "PUBLIC | PRIVATE | TEAM",
  "team": "string | null",
  "fileName": "string",
  "createdAt": "timestamp"
}]
```

#### `POST /api/dataset`
**Description:** Create a new dataset metadata entry.

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "fileName": "string",
  "fileUrl": "string",
  "ownerId": "string",
  "visibility": "PUBLIC | PRIVATE | TEAM",
  "teamId": "string | null"
}
```

**Response:** Dataset record


#### `GET /api/dataset/[id]`
**Description:** Fetch detailed dataset info.

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "visibility": "string",
  "team": "string",
  "owner": "string",
  "createdAt": "timestamp",
  "visualizations": 2
}
```

#### `PUT /api/dataset/[id]`
**Description:** Update dataset metadata (name, description, visibility, teamId).

**Authorization:** Must be owner of dataset.

#### `GET /api/dataset/[id]/file`
**Description:** Stream raw dataset file by ID. Handles both local and S3.

**Response Headers:**
- `Content-Type`: Based on file type (CSV, JSON, Excel)
- `Content-Disposition`: inline; filename="name"


#### `GET /api/dataset/[id]/visualizations`
**Description:** Get all visualizations linked to a dataset

**Response:**
```json
[{
  "id": "string",
  "title": "string",
  "type": "bar | line | pie | radar | bubble",
  "config": { ... }
}]
```


### 📈 Visualizations

#### `POST /api/visualizations`
**Description:** Create a new visualization.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "type": "bar | line | pie | radar | bubble",
  "config": { ... },
  "datasetId": "string"
}
```

**Response:** Created visualization

#### `GET /api/visualizations/datasets?ownerId=...`
**Description:** Return datasets accessible by the user (owner + team + public).


### 💬 Comments

#### `GET /api/comments?vizId=...`
**Description:** Get all comments for a visualization.

#### `POST /api/comments`
**Request Body:**
```json
{
  "vizId": "string",
  "content": "string",
  "currentUserId": "string"
}
```

#### `DELETE /api/comments/[commentId]`
**Description:** Delete a specific comment


### 👥 Teams

#### `GET /api/teams`
**Description:** Get all teams owned or joined by the current user

#### `POST /api/teams`
**Description:** Create a new team
```json
{
  "name": "string",
  "memberIds": ["string"]
}
```

#### `GET /api/teams/[teamId]`
**Description:** Get details of a team

#### `DELETE /api/teams/[teamId]`
**Description:** Disband a team (OWNER only)

#### `GET /api/teams/curUser`
**Description:** Get teams for currently authenticated user

#### `POST /api/teams/[teamId]/members`
**Description:** Add members to a team (OWNER only)
```json
{
  "members": [
    { "userId": "string", "role": "MEMBER" }
  ]
}
```

#### `DELETE /api/teams/[teamId]/members/[userId]`
**Description:** Remove a member from a team


### 🔍 User Search

#### `GET /api/users/search?q=...`
**Description:** Search users by name or email. Returns up to 10 results.

**Authorization:** Required

**Response:**
```json
[{
  "id": "string",
  "name": "string",
  "email": "string",
  "image": "string"
}]
```


### 🔐 Authentication & Authorization
- Most API routes require a valid session via `better-auth`
- Team and dataset APIs check role-based access control (OWNER vs MEMBER)



### 🛠 Error Handling
- `400 Bad Request`: Missing parameters or invalid input
- `401 Unauthorized`: No valid session
- `403 Forbidden`: Not allowed (e.g., not a team owner)
- `404 Not Found`: Resource doesn't exist
- `500 Internal Server Error`: Unexpected failure