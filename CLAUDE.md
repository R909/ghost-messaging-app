# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server on http://localhost:3000
npm run build     # Production build (also type-checks)
npm run start     # Start production server (requires build first)
npm run lint      # Run ESLint
```

There is no test suite. Type-checking runs implicitly during `npm run build`.

## Required environment variables

```
NEXTAUTH_SECRET=
MONGODB_URI=
RESEND_API_KEY=
```

These must be present in `.env.local`. The app will crash on startup without `MONGODB_URI` and `NEXTAUTH_SECRET`.

## Architecture overview

**Framework**: Next.js 16 App Router with TypeScript. One legacy handler exists at `pages/api/auth/[...nextauth].ts` for NextAuth compatibility — the actual auth options live in `app/api/auth/[...nextauth]/options.ts`.

**Route structure**:
- `app/(auth)/` — sign-up, sign-in, verify/[username] (public, grouped)
- `app/dashboard/` — chats, contacts, ghost-links, profile, settings (all protected)
- `app/api/` — REST handlers; one file per feature area
- `middleware.ts` — redirects unauthenticated users away from `/dashboard/*` and authenticated users away from `/sign-in`, `/sign-up`

**Shared layout component**: Every dashboard page wraps its content with `<HomePage active="<route>">` from `app/components/home.tsx`. This file also exports `GhostAvatar`, `GhostBackdrop`, and `SectionHeaderButton`. Do not duplicate sidebar/nav logic anywhere else.

**Authentication**: NextAuth v4 with JWT strategy and `CredentialsProvider` only. Session data (\_id, username, isVerified, isAcceptingMessages) is populated in the `jwt` callback and forwarded in the `session` callback. The extended types are in `app/types/next-auth.d.ts`. To update session data client-side without re-login, call `update({ field: value })` from `useSession()` — this triggers `trigger === "update"` in the JWT callback.

**Database**: Mongoose with a singleton connection in `app/lib/dbConnect.ts`. Every API route must `await DBConnection()` before any query. Models are in `app/model/` — `User`, `Conversation`, `Message`.

**Forms**: `react-hook-form` + `zod` on the client. Validation schemas live in `app/schemas/`. Server-side API routes do their own validation (no shared schema reuse between client and server currently).

**Email**: Verification emails are sent via Resend. The helper is `app/helper/sendVerificationEmail.ts`; the email template uses `@react-email/components`.

## UI conventions

**Theme**: Background `#030106`, accent violet/fuchsia gradients, white text at varying opacity (`/40`, `/50`, `/80`). Tailwind CSS v4 (no `tailwind.config.js` — configuration is in `postcss.config.mjs`).

**Custom animations** (defined in `app/globals.css`): `animate-float-slow`, `animate-drift`, `animate-wave-pulse`, `animate-slide-up-fade`, `animate-glow-breathe`, `animate-bounce-dot`. Use these instead of inventing new keyframes.

**3D tilt effect**: Dashboard pages use `rotateX`/`rotateY` state driven by `onMouseMove` / `onMouseLeave` on the outer card, with `style={{ perspective: "1200px" }}` on the container and `transformStyle: "preserve-3d"` on children. This is the established pattern — follow it when adding new full-page cards.

**Glass cards**: `rounded-[2.2rem] border border-white/12 bg-[linear-gradient(...)] backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.15),...]` — copy the exact shadow/border from an existing page rather than approximating.

## Key data relationships

- A `Conversation` has exactly two `participants` (User ObjectIds). Finding a user's contacts means querying their conversations and extracting the non-self participant.
- `User.isAcceptingMessages` gates whether anonymous messages can be sent via ghost links. The profile page exposes a toggle that calls `update()` to sync the JWT without a full re-auth.
- `User.messages` is a `String[]` — it stores anonymous message text sent via the ghost link flow, separate from `Conversation`/`Message` documents.
