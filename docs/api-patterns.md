# API Patterns

## Conventions

All API routes follow these conventions:

**Authentication**: Every protected route calls `getServerSession(authOptions)` first. If no session exists, it returns `401` before touching the database.

**Database**: Every route calls `await DBConnection()` before any Mongoose query. The connection is a singleton — subsequent calls within the same process are no-ops.

**Response shape**: All responses follow a consistent envelope:
```json
{ "success": true,  "data": ... }
{ "success": false, "message": "Human-readable error" }
```

**Input sanitization**: String inputs passed into MongoDB regex queries are escaped with:
```ts
str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
```
This prevents regex injection.

**Error handling**: All routes wrap logic in `try/catch`. Caught errors return `500` with `"Internal server error"` — internal error details are never leaked to the client.

---

## Route Reference

### Auth

#### `POST /api/sign-up`
Register a new user.

**Body**
```json
{ "username": "string", "email": "string", "password": "string" }
```

**Responses**
| Status | Condition |
|---|---|
| 201 | User created, verification email sent |
| 200 | Username taken but unverified — code resent |
| 400 | Username already taken and verified |
| 500 | DB or email service failure |

---

#### `POST /api/verify-code`
Verify an OTP code.

**Body**
```json
{ "username": "string", "code": "string" }
```

**Responses**
| Status | Condition |
|---|---|
| 200 | Verified successfully |
| 400 | Code expired or incorrect |
| 404 | Username not found |

---

### Conversations

#### `GET /api/conversations`
Returns all conversations for the authenticated user, sorted by `lastMessageAt` descending. Participants are populated with `username` and `_id`.

**Response**
```json
{
  "success": true,
  "conversations": [
    {
      "_id": "...",
      "participants": [{ "_id": "...", "username": "ghost_user" }, { ... }],
      "lastMessage": "Hey",
      "lastMessageAt": "2026-06-05T10:00:00.000Z"
    }
  ]
}
```

---

#### `POST /api/conversations`
Find an existing conversation with a user, or create one if none exists.

**Body**
```json
{ "username": "string" }
```

**Responses**
| Status | Condition |
|---|---|
| 200 | Existing or newly created conversation returned |
| 400 | Missing username, or trying to message yourself |
| 404 | No user with that username |

Returns `{ success: true, conversation: { _id, participants, ... } }`.

---

#### `GET /api/conversations/:id/messages`
Returns all messages in a conversation, sorted `createdAt` ascending. Marks all incoming unseen messages as `seen: true`.

**Auth guard**: Session user must be a participant of the conversation.

**Response**
```json
{
  "success": true,
  "messages": [
    {
      "_id": "...",
      "sender": { "_id": "...", "username": "ghost_user" },
      "content": "Hello",
      "seen": true,
      "createdAt": "2026-06-05T10:00:00.000Z"
    }
  ]
}
```

---

#### `POST /api/conversations/:id/messages`
Send a message in a conversation.

**Auth guard**: Session user must be a participant.

**Body**
```json
{ "content": "string" }
```

**Side effects**: Updates `Conversation.lastMessage` and `Conversation.lastMessageAt`.

**Response**: `201` with `{ success: true, message: <populated Message> }`.

---

### Contacts

#### `GET /api/contacts`
Returns all unique users the current user has had a conversation with.

**Response**
```json
{
  "success": true,
  "contacts": [
    { "_id": "...", "username": "night_owl", "isAcceptingMessages": true, "isVerified": true }
  ]
}
```

---

#### `POST /api/contacts`
Search for users by username.

**Body**
```json
{ "query": "string" }
```

- Minimum 2 characters
- Case-insensitive substring match
- Returns only `isVerified: true` users
- Excludes the requesting user themselves
- Limited to 10 results

**Response**: `{ "success": true, "users": [...] }`

---

### Profile

#### `GET /api/profile`
Returns the authenticated user's profile data and stats.

**Response**
```json
{
  "success": true,
  "profile": {
    "username": "ghost_user",
    "email": "user@example.com",
    "isAcceptingMessages": true,
    "isVerified": true,
    "createdAt": "2026-01-01T00:00:00.000Z"
  },
  "stats": {
    "conversations": 12,
    "messagesSent": 48
  }
}
```

---

#### `PATCH /api/profile`
Toggle anonymous message acceptance.

**Body**
```json
{ "isAcceptingMessages": true }
```

`isAcceptingMessages` must be a boolean; any other type returns `400`.

---

### Settings

#### `PATCH /api/settings`
Update username or password. The `type` field selects which operation runs.

**Change username**
```json
{ "type": "username", "newUsername": "new_alias" }
```
- Length: 3–30 characters
- Unique check: case-insensitive, excludes self
- Returns `409` if taken

**Change password**
```json
{ "type": "password", "currentPassword": "old", "newPassword": "new_min6" }
```
- Verifies current password with bcrypt before hashing the new one
- Minimum 6 characters for new password

---

#### `DELETE /api/settings`
Permanently delete the authenticated user's account.

**Body**
```json
{ "password": "string" }
```

**Deletion order**:
1. Find all conversation IDs where user is a participant
2. Delete all `Message` documents in those conversations
3. Delete all `Conversation` documents with user as participant
4. Delete the `User` document

Returns `200` on success; client then calls `signOut()`.

---

## Error Code Summary

| Code | Meaning |
|---|---|
| 400 | Validation error or bad request body |
| 401 | Not authenticated (no valid session) |
| 404 | Resource not found |
| 409 | Conflict (e.g., username already taken) |
| 500 | Unhandled server error |
