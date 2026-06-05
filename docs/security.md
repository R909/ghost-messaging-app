# Security

---

## Authentication & Session

### Mechanism
NextAuth v4 with `CredentialsProvider` and JWT strategy. No server-side session store — the session is a signed JWT cookie managed by NextAuth.

### Credential Validation
Login requires both a matching user record and `isVerified: true`. Unverified users receive a specific error message and cannot proceed:

```ts
if (!user.isVerified) {
  throw new Error("Please verify your account before signing in");
}
```

### Password Hashing
All passwords are hashed with `bcryptjs` using salt rounds of `10` before storage. Plain-text passwords are never stored or logged. Password comparison uses `bcrypt.compare()`, never direct string equality.

### JWT Cookie
NextAuth signs the JWT with `NEXTAUTH_SECRET`. This secret must be a strong random string (32+ characters) and stored only in environment variables, never in code.

### Session Fields
The JWT carries: `_id`, `username`, `email`, `isVerified`, `isAcceptingMessages`. These are written once on login and updated only through explicit `update()` calls — they are not re-fetched from the database on every request. If a user's `isVerified` status changes after login, the change is not reflected until re-login or an explicit session update.

---

## Route Protection

### Middleware (`middleware.ts`)
Runs on the Next.js Edge before page rendering. Uses `getToken()` from `next-auth/jwt` to inspect the JWT cookie without a database call:

```
Protected routes: /dashboard/**
Auth routes:      /sign-in, /sign-up

Rules:
- Authenticated  + auth route   → redirect /dashboard
- Unauthenticated + dashboard   → redirect /sign-in
```

### API Route Guard
Every API route independently calls `getServerSession(authOptions)` to validate the session. Middleware alone is insufficient for API routes because:
- API routes can be called directly (not through the browser)
- API routes are not in the middleware `matcher`

The check is always the **first operation** in every handler:
```ts
const session = await getServerSession(authOptions);
if (!session?.user?._id) {
  return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
}
```

### Resource Ownership
Conversation and message routes verify that the requesting user is a **participant** of the target conversation before returning data or accepting writes:

```ts
const conversation = await Conversation.findOne({
  _id: id,
  participants: session.user._id,  // ownership check
});
if (!conversation) {
  return NextResponse.json({ success: false, message: "Conversation not found" }, { status: 404 });
}
```

Using `404` (not `403`) for unauthorized resource access avoids confirming whether a resource exists to an unauthorized caller.

---

## Input Validation

### Client Side
Zod schemas (`app/schemas/`) validate form fields before submission via `react-hook-form`. This prevents clearly invalid requests but is not a security boundary.

### Server Side
API routes perform their own inline validation on all inputs. Critical validations include:

- **Username uniqueness**: Case-insensitive check before updating
- **Password length**: Minimum 6 characters enforced server-side
- **Boolean type enforcement**: `isAcceptingMessages` must be strictly `boolean`, not truthy
- **Self-message prevention**: `POST /api/conversations` rejects requests where target user equals the session user

### Regex Injection Prevention
Any user-supplied string used in a MongoDB `$regex` query is escaped before use:

```ts
const sanitized = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const users = await User.find({
  username: { $regex: sanitized, $options: "i" },
});
```

This prevents malicious regex patterns from causing ReDoS or unintended matches.

---

## Data Deletion (Account Cleanup)

Account deletion deletes in dependency order to avoid orphaned documents:

1. Find all `Conversation._id` where user is a participant
2. `Message.deleteMany({ conversationId: { $in: convIds } })` — child records first
3. `Conversation.deleteMany({ participants: userId })` — then parent records
4. `User.findByIdAndDelete(userId)` — finally the user

Password re-confirmation is required before deletion. The confirmation password is verified with `bcrypt.compare()` — the same mechanism as login.

---

## Email Verification

A 6-digit OTP is generated and stored (with an expiry timestamp) in `User.verifyCode` and `User.verifyCodeExpire` at sign-up. The code is sent via Resend. At verification time:

- Code must match exactly
- Current time must be before `verifyCodeExpire`
- On success: `isVerified = true`, `verifyCode` and `verifyCodeExpire` are cleared from the document

This prevents replay attacks (code expires) and ensures users own the email address they registered with.

---

## Environment Variables

| Variable | Purpose | Risk if Exposed |
|---|---|---|
| `NEXTAUTH_SECRET` | Signs JWT cookies | Full session forgery — attacker can craft valid session tokens for any user |
| `MONGODB_URI` | Database connection string (includes credentials) | Full database access — read, write, delete all user data |
| `RESEND_API_KEY` | Email sending API key | Ability to send emails from your domain, potential phishing vector |

**All three must be in `.env.local` only.** This file must be in `.gitignore` and must never be committed.

---

## Known Gaps & Recommendations

| Area | Current State | Recommendation |
|---|---|---|
| Rate limiting | None | Add rate limiting on sign-up, sign-in, and verify-code to prevent brute-force |
| Message content | No server-side length limit on message `content` | Add `maxlength` validation in `POST /api/conversations/:id/messages` |
| Ghost Links | No authentication on incoming ghost link messages | Ensure the ghost-link message endpoint validates `isAcceptingMessages` before writing |
| HTTPS | Not enforced in code | Ensure deployment enforces HTTPS; `NEXTAUTH_URL` must be an `https://` URL in production |
| `User.messages` | Unbounded string array | Add a max-messages cap to prevent inbox flooding |
| Session expiry | Default NextAuth expiry | Configure explicit `maxAge` in session options for production |
