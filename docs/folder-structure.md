# Folder Structure

```
ghost-messaging-app/
│
├── app/                            # Next.js App Router root
│   │
│   ├── (auth)/                     # Route group — public auth pages (no layout wrapper)
│   │   ├── sign-in/page.tsx        # Login form (email/username + password)
│   │   ├── sign-up/page.tsx        # Registration form with real-time username check
│   │   └── verify/[username]/
│   │       └── page.tsx            # 6-digit OTP verification sent via email
│   │
│   ├── api/                        # REST API handlers (all server-side)
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── options.ts      # NextAuth config (providers, callbacks, JWT)
│   │   ├── contacts/
│   │   │   └── route.ts            # GET contacts, POST search users
│   │   ├── conversations/
│   │   │   ├── route.ts            # GET list, POST create/find conversation
│   │   │   └── [id]/
│   │   │       └── messages/
│   │   │           └── route.ts    # GET messages, POST send message
│   │   ├── profile/
│   │   │   └── route.ts            # GET profile+stats, PATCH isAcceptingMessages
│   │   ├── settings/
│   │   │   └── route.ts            # PATCH username/password, DELETE account
│   │   ├── sign-up/
│   │   │   └── route.ts            # POST register new user, send verification email
│   │   └── verify-code/
│   │       └── route.ts            # POST verify OTP code
│   │
│   ├── components/                 # Shared UI components
│   │   ├── home.tsx                # HomePage layout, GhostAvatar, GhostBackdrop, SectionHeaderButton
│   │   ├── ghost-auth-scene.tsx    # Reusable animated auth page wrapper
│   │   ├── LogoutButton.tsx        # Calls signOut()
│   │   ├── Providers.tsx           # SessionProvider wrapper for the root layout
│   │   └── UserProfile.tsx         # Sidebar user card (username, email, logout)
│   │
│   ├── dashboard/                  # Protected pages (all require auth via middleware)
│   │   ├── layout.tsx              # Minimal layout — only sets page metadata
│   │   ├── page.tsx                # Redirects to /dashboard/chats
│   │   ├── chats/page.tsx          # Two-panel chat UI with polling
│   │   ├── contacts/page.tsx       # Contacts list + user search
│   │   ├── ghost-links/page.tsx    # Shareable ghost link management (currently static)
│   │   ├── settings/page.tsx       # Account, privacy, preferences, danger zone
│   │   └── profile/
│   │       ├── page.tsx            # Own profile: stats, ghost link, message toggle
│   │       └── [slug]/page.tsx     # Dynamic public profile view by username
│   │
│   ├── helper/
│   │   └── sendVerificationEmail.ts  # Sends OTP email via Resend
│   │
│   ├── lib/
│   │   ├── dbConnect.ts            # Mongoose singleton connection
│   │   └── resend.ts               # Resend client instance
│   │
│   ├── model/                      # Mongoose models
│   │   ├── User.ts
│   │   ├── Conversation.ts
│   │   └── Message.ts
│   │
│   ├── schemas/                    # Zod validation schemas (client-side forms only)
│   │   ├── signUpSchems.ts
│   │   ├── signInSchema.ts
│   │   ├── verifySchema.ts
│   │   ├── messageSchema.ts
│   │   └── acceptMessageSchema.ts
│   │
│   ├── types/
│   │   ├── next-auth.d.ts          # Extends NextAuth Session, User, JWT interfaces
│   │   └── apiResponse.ts          # Shared ApiResponse type
│   │
│   ├── globals.css                 # Tailwind directives + custom @keyframes
│   ├── layout.tsx                  # Root layout — wraps app in <Providers>
│   ├── not-found.tsx               # Custom 404 page
│   └── page.tsx                    # Root "/" — redirects to /sign-up
│
├── pages/
│   └── api/
│       └── auth/
│           └── [...nextauth].ts    # NextAuth HTTP handler (Pages Router, required by NextAuth v4)
│
├── public/                         # Static assets
│   ├── ghost-1.png                 # Ghost backdrop images used by GhostBackdrop
│   ├── ghost-2.png
│   └── ghost-3.png
│
├── docs/                           # Project documentation (this folder)
│
├── middleware.ts                   # Edge middleware — auth guard for all routes
├── next.config.ts                  # Next.js config
├── postcss.config.mjs              # Tailwind CSS v4 config (no tailwind.config.js)
├── tsconfig.json
├── package.json
├── CLAUDE.md                       # AI assistant guidance file
└── .env.local                      # Environment variables (never commit)
```

---

## Key Conventions

**Route group `(auth)`** — the parentheses prevent this segment from appearing in the URL. `/sign-in`, `/sign-up`, and `/verify/[username]` are direct children of the root, not `/auth/sign-in`.

**`dashboard/layout.tsx`** — intentionally minimal. It only sets metadata. All visual layout (sidebar, nav, background) is handled by `<HomePage>` inside each page component.

**`pages/api/auth/[...nextauth].ts`** — the only file in `pages/`. It exists solely because NextAuth v4 requires its HTTP handler to live in the Pages Router to reliably issue/read session cookies in Next.js App Router projects.

**`app/components/home.tsx`** — the most important shared file in the project. It exports the sidebar layout wrapper (`HomePage`), ghost decorative components (`GhostAvatar`, `GhostBackdrop`), and the icon button (`SectionHeaderButton`). Any navigation or layout change starts here.
