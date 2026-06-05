# System Patterns

Recurring patterns used across the codebase. Understanding these lets you add new features that feel native to the project.

---

## 1. Dashboard Page Skeleton

Every dashboard page follows this exact structure:

```tsx
"use client";
import { useState } from "react";
import { GhostBackdrop, HomePage } from "../../components/home";

export default function MyPage() {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRotateX(-((e.clientY - rect.top - rect.height / 2) / rect.height) * 3);
    setRotateY(((e.clientX - rect.left - rect.width / 2) / rect.width) * 3);
  };

  return (
    <HomePage active="my-route">
      <div style={{ perspective: "1200px" }}
        className="relative flex h-full flex-1 items-center justify-center overflow-hidden p-4 sm:p-6">

        {/* Ambient glow layer */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(...)]" />
          <div className="absolute ... blur-3xl animate-float-slow" />
        </div>

        <GhostBackdrop src="/ghost-X.png" alt="..." imageClassName="opacity-[0.11]" />

        {/* 3D glass card */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { setRotateX(0); setRotateY(0); }}
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.15s ease-out",
          }}
          className="relative z-10 w-full max-w-4xl rounded-[2.2rem] border border-white/12
                     bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]
                     p-6 sm:p-8
                     shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_35px_80px_rgba(0,0,0,0.45)]
                     backdrop-blur-2xl animate-slide-up-fade"
        >
          {/* Content elevated in Z-space */}
          <div style={{ transform: "translateZ(30px)" }}>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Page Title</h1>
          </div>
          
          {/* Child cards */}
          <div className="mt-6 grid gap-4" style={{ transformStyle: "preserve-3d" }}>
            <div style={{ transform: "translateZ(15px)", animationDelay: "200ms" }}
              className="rounded-[1.6rem] border border-white/8 bg-white/[0.02] p-4 animate-slide-up-fade">
              {/* card content */}
            </div>
          </div>
        </div>
      </div>
    </HomePage>
  );
}
```

**Key values:**
- Outer perspective: `1200px`–`1500px`
- Card tilt max: `±3deg` (some pages use `±2.5deg`)
- Card `border-radius`: `rounded-[2.2rem]` (outer), `rounded-[1.6rem]` (inner cards)
- Header Z-elevation: `translateZ(30px)`; inner cards: `translateZ(15px)`–`translateZ(20px)`

---

## 2. 3D Tilt Effect

Mouse-tracking tilt is applied to the main glass card on every dashboard page:

```ts
// State
const [rotateX, setRotateX] = useState(0);
const [rotateY, setRotateY] = useState(0);

// Handler
const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  setRotateX(-((e.clientY - rect.top - rect.height / 2) / rect.height) * 3);
  setRotateY(((e.clientX - rect.left - rect.width / 2) / rect.width) * 3);
};
```

Applied on the card container:
```tsx
style={{
  transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
  transformStyle: "preserve-3d",
  transition: "transform 0.15s ease-out",
}}
```

The `perspective` must be on the **parent** of the tilting element. Child elements use `translateZ(N px)` to float above the card surface.

---

## 3. Session Update Without Re-login

When user data changes (username, `isAcceptingMessages`), the JWT cookie must be refreshed client-side without forcing a re-login. Pattern:

```ts
const { data: session, update: updateSession } = useSession();

// After a successful PATCH API call:
await updateSession({ username: "new_name" });
// or
await updateSession({ isAcceptingMessages: true });
```

This calls NextAuth's `update()` which triggers `trigger === "update"` in the `jwt` callback in `options.ts`:
```ts
if (trigger === "update" && updatePayload) {
  if (typeof payload.username === "string") token.username = payload.username;
  if (typeof payload.isAcceptingMessages === "boolean") token.isAcceptingMessages = payload.isAcceptingMessages;
}
```

Always call `updateSession()` **after** the API call succeeds, never before.

---

## 4. Optimistic UI for Messages

The chat page sends messages with immediate visual feedback before the API confirms:

```ts
// 1. Generate a local temp ID
const tempId = `temp-${Date.now()}`;

// 2. Append to local state immediately
setMessages(prev => [...prev, { _id: tempId, content, sender: currentUser, ... }]);

// 3. Make API call
const res = await fetch(`/api/conversations/${id}/messages`, { method: "POST", ... });
const data = await res.json();

if (data.success) {
  // 4a. Replace temp with real message
  setMessages(prev => prev.map(m => m._id === tempId ? data.message : m));
} else {
  // 4b. Remove temp, restore draft
  setMessages(prev => prev.filter(m => m._id !== tempId));
  setDraft(content);
}
```

Temp messages render at reduced opacity (`.opacity-60`) so the user knows they are in-flight.

---

## 5. API Route Structure Pattern

Every API route handler:

```ts
export const GET = async (req: NextRequest) => {
  // 1. Auth check — always first
  const session = await getServerSession(authOptions);
  if (!session?.user?._id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Connect to DB
    await DBConnection();

    // 3. Business logic + Mongoose queries
    const result = await SomeModel.find({ ... });

    // 4. Return success envelope
    return NextResponse.json({ success: true, result });

  } catch (error: unknown) {
    console.error("[HANDLER_NAME]:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
};
```

---

## 6. Staggered Animation Entry

List items fade in with cascading delays:

```tsx
{items.map((item, index) => (
  <div
    key={item.id}
    style={{ animationDelay: `${index * 80 + 200}ms` }}
    className="animate-slide-up-fade"
  >
    ...
  </div>
))}
```

The base delay (`200ms`) prevents the list from starting before the parent card finishes its own entry animation. The per-item increment (`80ms`) creates the cascade.

---

## 7. Toast Notification Pattern

Used in the settings page; applicable anywhere:

```ts
type Toast = { message: string; type: "success" | "error" };
const [toast, setToast] = useState<Toast | null>(null);

const showToast = (message: string, type: Toast["type"]) => {
  setToast({ message, type });
  setTimeout(() => setToast(null), 3500);
};
```

Rendered as a fixed overlay:
```tsx
{toast && (
  <div className={`fixed right-5 top-5 z-50 rounded-2xl border px-5 py-3 text-sm backdrop-blur-xl
    ${toast.type === "success"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
      : "border-red-400/20 bg-red-400/10 text-red-300"
    }`}>
    {toast.message}
  </div>
)}
```

---

## 8. Custom Toggle Component

Reusable toggle (used in settings):

```tsx
function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`h-8 w-14 rounded-full border p-1 transition-all duration-300
        ${checked
          ? "border-violet-400/40 bg-violet-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          : "border-white/10 bg-black/40"
        }`}
    >
      <span className={`block h-5 w-5 rounded-full bg-white transition-all duration-300
        ${checked ? "translate-x-6 bg-violet-100" : "translate-x-0"}`} />
    </button>
  );
}
```

---

## 9. Loading Skeleton Pattern

Used in the chats page for skeleton loaders while data is fetching:

```tsx
{isLoading ? (
  <div className="flex flex-col gap-2 pt-2">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex items-center gap-3 rounded-[1.4rem] border border-white/5 px-4 py-3 animate-pulse">
        <div className="h-11 w-11 shrink-0 rounded-2xl bg-white/5" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded bg-white/5" />
          <div className="h-2.5 w-36 rounded bg-white/5" />
        </div>
      </div>
    ))}
  </div>
) : ( /* real content */ )}
```

The `animate-pulse` class comes from Tailwind and creates a fade-in/fade-out breathing effect on the placeholder shapes.

---

## 10. Inline SVG Icon Pattern

The codebase avoids importing icon libraries at runtime. All icons are small inline SVG functions co-located at the bottom of their file:

```tsx
function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 8.5h10M7 12h6" strokeLinecap="round" />
      <path d="M5.5 4.5h13a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H10l-4.5 3v-3H5.5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" />
    </svg>
  );
}
```

Standard dimensions: `h-4 w-4` for button icons, `h-5 w-5` for nav icons, `h-6 w-6` for larger contexts. Always use `strokeWidth="1.8"` for consistency.
