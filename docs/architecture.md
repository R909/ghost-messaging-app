# Architecture

## Overview

GhostChat is a full-stack anonymous messaging web application built with **Next.js 16 App Router**. It supports real-user-to-real-user private chat via conversations, plus shareable ghost links that allow anyone to send anonymous messages to a user's inbox without creating an account.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS v4 |
| Authentication | NextAuth v4 (JWT, CredentialsProvider) |
| Database | MongoDB via Mongoose 9 |
| Email | Resend + @react-email/components |
| Forms | react-hook-form + Zod |
| Animations | Framer Motion + custom CSS keyframes |
| Icons | Inline SVGs (no icon library dependency at runtime) |

---

## High-Level Data Flow

```
Browser (Client Components)
    │
    ├── useSession()          ← next-auth/react (JWT cookie)
    ├── fetch("/api/...")     ← REST calls to App Router handlers
    │
Next.js Edge / Node.js Server
    │
    ├── middleware.ts         ← Auth guard (getToken from JWT cookie)
    ├── app/api/**/route.ts   ← API Route Handlers (Node.js)
    │       │
    │       ├── getServerSession(authOptions)
    │       └── DBConnection() → Mongoose → MongoDB Atlas
    │
    └── pages/api/auth/[...nextauth].ts  ← NextAuth session endpoint
```

---

## Application Layers

### 1. Routing Layer

Next.js App Router with three top-level segments:

- **`(auth)`** — public route group: sign-up, sign-in, verify/[username]
- **`dashboard`** — protected nested routes, all behind `middleware.ts`
- **`api`** — REST handlers, no rendering

One legacy entry point exists at `pages/api/auth/[...nextauth].ts` solely for NextAuth's `/api/auth/*` callback URLs to work correctly with the Pages Router session endpoint. The actual configuration is in `app/api/auth/[...nextauth]/options.ts`.

### 2. Auth Layer

NextAuth v4 with:
- **Strategy**: JWT (stateless, no DB session store)
- **Provider**: `CredentialsProvider` only — email/username + password
- **Session fields**: `_id`, `username`, `email`, `isVerified`, `isAcceptingMessages`
- **Client updates**: `update({ field: value })` from `useSession()` triggers `trigger === "update"` in the JWT callback, syncing the cookie without requiring re-login

### 3. Data Layer

Three Mongoose models:

```
User
 ├── username, email, password (bcrypt hashed)
 ├── isVerified, verifyCode, verifyCodeExpire
 ├── isAcceptingMessages
 └── messages: String[]   ← anonymous ghost-link inbox (separate from Conversations)

Conversation
 ├── participants: [User, User]   ← always exactly 2
 ├── lastMessage: String
 └── lastMessageAt: Date

Message
 ├── conversationId → Conversation
 ├── sender → User
 ├── content: String
 └── seen: Boolean
```

`User.messages` (String array) is the anonymous message inbox — messages sent via ghost links land here. It is **separate** from the `Message` collection which stores conversation messages between registered users.

### 4. UI Layer

All dashboard pages share a single layout component (`HomePage` in `app/components/home.tsx`) that renders the sidebar navigation and wraps the page content. No separate layout file is used for content — each page is self-contained inside `<HomePage active="...">`.

---

## Key Architectural Decisions

**No real-time WebSockets** — the chat page polls `/api/conversations/:id/messages` every 4 seconds using `setInterval`. This keeps infrastructure simple at the cost of slight message latency.

**Dual NextAuth handler** — `pages/api/auth/[...nextauth].ts` handles the HTTP session endpoints while `app/api/auth/[...nextauth]/options.ts` holds the configuration. This split exists because NextAuth v4 requires the handler in the Pages Router for reliable cookie handling in some Next.js 13+ setups.

**Client-side local preferences** — the settings page stores UI preferences (Ghost Mode, Self-destruct, Read Receipts) in `localStorage` under the key `ghost_prefs`. These are purely cosmetic and not persisted to the database.

**No shared Zod schemas between client and server** — client-side forms validate with schemas in `app/schemas/`; server API routes do their own inline validation. There is intentional duplication here; the schemas are not imported cross-boundary.
