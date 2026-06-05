# Utilities

---

## Database Connection — `app/lib/dbConnect.ts`

A singleton Mongoose connection manager. Prevents opening multiple connections during hot module reloads in development or across concurrent serverless invocations.

```ts
const connection: { isConnected?: boolean } = {};

const DBConnection = async (): Promise<void> => {
  if (connection.isConnected) return;  // reuse existing connection
  const db = await mongoose.connect(process.env.MONGODB_URI || "");
  connection.isConnected = db.connections[0].readyState === 1;
};
```

**Usage**: Every API route handler calls `await DBConnection()` before any Mongoose query. It is idempotent — safe to call multiple times.

**Failure behavior**: If the connection fails, `process.exit(1)` is called. This intentionally crashes the server rather than silently serving broken responses.

---

## Email Client — `app/lib/resend.ts`

Exports a configured `Resend` client instance:

```ts
import { Resend } from "resend";
export const resend = new Resend(process.env.RESEND_API_KEY);
```

Used only by `sendVerificationEmail`. Requires `RESEND_API_KEY` in environment.

---

## Send Verification Email — `app/helper/sendVerificationEmail.ts`

Sends a 6-digit OTP to a new user's email address during sign-up.

**Signature**
```ts
sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse>
```

**Returns** `{ success: true, message: "..." }` or `{ success: false, message: "..." }`.

**Email template**: Built with `@react-email/components`. The template receives `username` and `otp` props and renders an HTML email with the code displayed prominently.

**Called from**: `POST /api/sign-up` after user creation or update.

---

## Validation Schemas — `app/schemas/`

Zod schemas used exclusively on the client side with `react-hook-form` via `@hookform/resolvers/zod`.

| File | Schema | Used in |
|---|---|---|
| `signUpSchems.ts` | `signUpSchema` | `(auth)/sign-up/page.tsx` |
| `signInSchema.ts` | `signInSchema` | `(auth)/sign-in/page.tsx` |
| `verifySchema.ts` | `verifySchema` | `(auth)/verify/[username]/page.tsx` |
| `messageSchema.ts` | `messageSchema` | (available, not yet wired) |
| `acceptMessageSchema.ts` | `acceptMessageSchema` | (available, not yet wired) |

These schemas are **not imported by API routes**. Server-side validation is done inline in each route handler.

---

## Type Extensions — `app/types/`

### `next-auth.d.ts`

Extends NextAuth's built-in TypeScript interfaces so that `session.user` includes the custom fields returned by the `session` callback:

```ts
declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
  }
  interface Session {
    user: {
      _id?: string;
      username?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
  }
}
```

Without this file, TypeScript would not know about `session.user._id`, `session.user.username`, etc.

### `apiResponse.ts`

Shared type for API response envelopes:

```ts
export interface ApiResponse {
  success: boolean;
  message: string;
}
```

Used as the return type of `sendVerificationEmail` and as a base for inline API response types.

---

## Local Preferences — `ghost_prefs` (localStorage)

The settings page stores three UI preferences locally. Not a utility file, but a named convention:

```ts
const PREFS_KEY = "ghost_prefs";

type LocalPrefs = {
  ghostMode: boolean;      // default: true
  selfDestruct: boolean;   // default: false
  readReceipts: boolean;   // default: false
};
```

Loaded on component mount via `JSON.parse(localStorage.getItem(PREFS_KEY) ?? "{}")`. Merged with `defaultPrefs` so new keys always have a fallback value. Saved immediately on each toggle via `localStorage.setItem`.

These preferences have no server-side effect currently — they exist to support future feature development.

---

## Custom CSS Animations — `app/globals.css`

All custom `@keyframes` and their utility classes are defined here. Reference by class name:

| Class | Duration | Effect |
|---|---|---|
| `animate-float-slow` | 7s | Gentle Y-axis float (±12px) |
| `animate-drift` | 11s | Combined X+Y translate drift |
| `animate-cloud-drift` | 14s | Slow X+Y drift |
| `animate-wave-pulse` | 5s | Scale + opacity pulse |
| `animate-slide-up-fade` | 0.55s | Slide up from 18px + fade in |
| `animate-slide-in-left` | 0.4s | Slide in from left |
| `animate-slide-in-right` | 0.4s | Slide in from right |
| `animate-glow-breathe` | 3s | Box-shadow intensity pulse |
| `animate-bounce-dot` | 1.2s | Vertical bounce (used for loading dots) |
| `animate-fade-in-up` | 0.5s | Opacity 0→1 + Y translate |
| `animate-pulse-soft` | 4s | Opacity 0.7→1 pulse |

Use `style={{ animationDelay: "Xms" }}` inline to stagger multiple elements using the same animation class.
