# Module Documentation

Each module below corresponds to a feature area. Where a module has both a page and API routes, both are described together.

---

## 1. Authentication (`app/(auth)/`)

### Purpose
Handles user registration, login, and email-based OTP verification. All three routes are public. Authenticated users are redirected away from these pages by `middleware.ts`.

### Pages

**Sign-up** (`app/(auth)/sign-up/page.tsx`)
- Form fields: username, email, password, confirmPassword
- Real-time username availability check via debounced API call
- On submit: `POST /api/sign-up` → redirects to `/verify/[username]`
- Validated with `signUpSchema` (Zod) via react-hook-form

**Sign-in** (`app/(auth)/sign-in/page.tsx`)
- Fields: identifier (email or username), password
- Uses NextAuth `signIn("credentials", {...})` 
- On success: redirected to `/dashboard` by NextAuth callback
- Error messages surfaced from NextAuth's error query param

**Verify** (`app/(auth)/verify/[username]/page.tsx`)
- Single 6-digit OTP input
- `POST /api/verify-code` with `{ username, code }`
- On success: redirects to `/sign-in`
- Code is valid only within `verifyCodeExpire` window set at sign-up

### API Routes

**`POST /api/sign-up`**
- Creates user with `isVerified: false`
- Hashes password with bcrypt (salt rounds: 10)
- Calls `sendVerificationEmail()` to send OTP via Resend
- If username already exists but is unverified, updates the user and resends code

**`POST /api/verify-code`**
- Finds user by username, checks code match and expiry
- On success: sets `isVerified: true`, clears `verifyCode` and `verifyCodeExpire`

---

## 2. Dashboard Shell (`app/dashboard/`)

### Purpose
Provides the authenticated application frame. The `dashboard/page.tsx` file just redirects to `/dashboard/chats`. All visual layout comes from `<HomePage>` in `app/components/home.tsx`.

### `app/components/home.tsx` exports

| Export | Description |
|---|---|
| `HomePage` | Main layout wrapper with sidebar nav. Takes `active: GhostRoute` prop |
| `GhostAvatar` | Animated ghost face SVG. Props: `size` ("sm" \| "md"), `accent` |
| `GhostBackdrop` | Full-bleed ghost image with gradient overlays. Props: `src`, `alt`, `className`, `imageClassName` |
| `SectionHeaderButton` | Square icon button for panel headers |
| `GhostRoute` | Union type: `"chats" \| "ghost-links" \| "contacts" \| "settings" \| "profile"` |

The sidebar navigation array is defined inside `home.tsx`. Adding a new route requires updating both the `navigation` array and the `GhostRoute` type.

---

## 3. Chats (`app/dashboard/chats/`)

### Purpose
Real-time (polled) two-panel messaging interface between registered users.

### UI Structure
- **Left panel**: conversation list with search, skeleton loaders, "New Message" flow
- **Right panel**: message thread, compose bar, optimistic message bubbles
- On narrow screens both panels stack vertically

### Key Behaviors

**Conversation creation**: User types a username in "New Message" input → `POST /api/conversations` → opens that conversation on success.

**Message sending**: Optimistic UI — a temp message (`temp-<timestamp>` ID) is appended to state immediately. On API success the temp message is replaced with the real one; on failure it is removed and the draft is restored.

**Polling**: `setInterval` at 4000ms fetches both messages and the conversation list whenever a conversation is active. Interval is cleared on component unmount and when switching conversations.

**Seen status**: `GET /api/conversations/:id/messages` marks all incoming unseen messages as `seen: true` on every fetch. The UI shows `✓✓` in violet for seen own messages.

**Date separators**: A date label (e.g., "June 5, 2026") is rendered between messages from different calendar days.

### API Routes

See [api-patterns.md](./api-patterns.md) — `Conversations` and `Messages` sections.

---

## 4. Contacts (`app/dashboard/contacts/`)

### Purpose
Shows users the current user has spoken with, and allows searching for new users to message.

### UI Structure
- **My Contacts tab**: fetched from `GET /api/contacts`, derived from existing conversations
- **Find Ghosts tab**: search bar → `POST /api/contacts` with `{ query }` → results list
- Each card shows username, verified badge, message acceptance status, and a "Message" button

### Key Behaviors
- "Message" button calls `POST /api/conversations` to find or create a conversation, then navigates to `/dashboard/chats?conversation=<id>`
- Search requires minimum 2 characters; returns up to 10 verified users matching the regex

### API Routes

**`GET /api/contacts`**
- Finds all conversations for the session user
- Populates participants, filters out self, deduplicates
- Returns `{ contacts: [{ _id, username, isAcceptingMessages, isVerified }] }`

**`POST /api/contacts`**
- Body: `{ query: string }` (min 2 chars)
- Case-insensitive regex search on `username`, `isVerified: true` only, excludes self
- Returns `{ users: [...] }`, limited to 10

---

## 5. Profile (`app/dashboard/profile/`)

### Purpose
Displays the current user's stats and provides controls for their ghost link and message acceptance toggle. Also has a dynamic public view at `/dashboard/profile/[slug]`.

### Own Profile (`profile/page.tsx`)
- Fetches from `GET /api/profile` on mount
- Displays: username, email, verified badge, member-since date, days active
- Stats cards: total conversations, messages sent
- Toggle: "Accept Anonymous Messages" → `PATCH /api/profile { isAcceptingMessages }` + `updateSession()`
- Ghost link: `window.location.origin/dashboard/profile/[username]` with clipboard copy

### Public Profile (`profile/[slug]/page.tsx`)
- Reads slug from params
- Shows public info for any user (feature under development)

### API Routes

**`GET /api/profile`**
Returns: `{ profile: { username, email, isAcceptingMessages, isVerified, createdAt }, stats: { conversations, messagesSent } }`

**`PATCH /api/profile`**
Body: `{ isAcceptingMessages: boolean }`  
Updates `User.isAcceptingMessages` in DB.

---

## 6. Settings (`app/dashboard/settings/`)

### Purpose
Account management: change username, change password, privacy toggle, local preferences, and account deletion.

### Sections

| Section | Behavior |
|---|---|
| Change Username | `PATCH /api/settings { type: "username", newUsername }` + `updateSession({ username })` |
| Change Password | `PATCH /api/settings { type: "password", currentPassword, newPassword }` |
| Accept Messages | `PATCH /api/profile { isAcceptingMessages }` + `updateSession()` (mirrors profile page) |
| Preferences | Stored in `localStorage` under key `ghost_prefs` — no API call |
| Delete Account | `DELETE /api/settings { password }` → `signOut({ callbackUrl: "/sign-in" })` |

Toast notifications (success/error) auto-dismiss after 3500ms.

### API Routes

**`PATCH /api/settings`**
- `type: "username"`: validates length (3–30), checks uniqueness (case-insensitive), updates DB
- `type: "password"`: verifies current password with bcrypt, hashes new password, updates DB

**`DELETE /api/settings`**
Requires password confirmation. On success:
1. Deletes all `Message` documents in user's conversations
2. Deletes all `Conversation` documents the user is a participant in
3. Deletes the `User` document

---

## 7. Ghost Links (`app/dashboard/ghost-links/`)

### Purpose
Temporary shareable links that allow anonymous, unauthenticated users to send messages to a registered user's inbox (`User.messages` array).

### Current State
The page is currently **UI-only with static data**. The link management (generate, expire, copy) is not yet wired to any API. The underlying data model (`User.messages: String[]`) exists and is ready for implementation.

---

## 8. Shared Components (`app/components/`)

### `ghost-auth-scene.tsx`
Reusable auth page frame used by sign-in, sign-up, and verify pages. Provides:
- Slide-in animation (left or right direction via `direction` prop)
- Ghost backdrop image with radial gradient overlays
- Floating decorative elements
- Back-navigation between auth pages

### `UserProfile.tsx`
Sidebar user card rendered at the bottom of the `<HomePage>` sidebar. Shows username and email from session, and renders `<LogoutButton>`.

### `Providers.tsx`
Thin wrapper: `<SessionProvider>{children}</SessionProvider>`. Mounted in `app/layout.tsx` to make `useSession()` available throughout the app.

### `LogoutButton.tsx`
Calls `signOut()` from `next-auth/react`. Renders as a styled button.
