# GhostChat — Project Documentation

Anonymous private messaging application built with Next.js 16, MongoDB, and NextAuth.

---

## Documents

| Document | Contents |
|---|---|
| [architecture.md](./architecture.md) | Tech stack, data flow, application layers, key architectural decisions |
| [folder-structure.md](./folder-structure.md) | Full directory tree with explanations for every file and folder |
| [modules.md](./modules.md) | Feature-by-feature breakdown — auth, chats, contacts, profile, settings, ghost links, shared components |
| [api-patterns.md](./api-patterns.md) | All API routes — methods, request bodies, response shapes, error codes |
| [system-patterns.md](./system-patterns.md) | Reusable code patterns — 3D tilt, optimistic UI, session updates, skeletons, animations |
| [utilities.md](./utilities.md) | dbConnect, Resend client, sendVerificationEmail, Zod schemas, type extensions, CSS animations |
| [security.md](./security.md) | Auth model, route protection, input validation, data deletion, env vars, known gaps |

---

## Quick Reference

**Start dev server**: `npm run dev`  
**Build**: `npm run build`  
**Lint**: `npm run lint`

**Required env vars**: `NEXTAUTH_SECRET`, `MONGODB_URI`, `RESEND_API_KEY`

**Add a new dashboard page**:
1. Create `app/dashboard/<name>/page.tsx`
2. Add `"<name>"` to the `GhostRoute` union in `app/components/home.tsx`
3. Add the route to the `navigation` array in `home.tsx`
4. Wrap page content in `<HomePage active="<name>">`

**Add a new API route**:
1. Create `app/api/<name>/route.ts`
2. Start with auth check → `DBConnection()` → business logic → response envelope
3. See [api-patterns.md](./api-patterns.md) for the full pattern
