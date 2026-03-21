# ProfitPenny Studio OS — Claude Code Context

## What This App Is
Internal operating system for ProfitPenny Design Studio. A single-page React/Vite/Firebase app
where the whole team manages projects, tasks, time logs, leaves, meetings, clients, and billing.
Deployed on Vercel. Admin backend is a separate static file (`public/admin.html`).

---

## Tech Stack
- **Frontend:** React 18, Vite 5
- **Database:** Firebase Firestore (via custom `firebase.js` wrapper)
- **Auth:** Firebase Auth
- **Icons:** Lucide React v0.263.1 (pinned — do not upgrade, imports will break)
- **Fonts:** Inter (Google Fonts, loaded in CSS)
- **Deployment:** Vercel + serverless functions in `/api/`
- **Email:** Resend via `/api/send-email` serverless function

---

## Project Structure
```
profitpenny-app/
├── src/
│   ├── App.jsx          # ENTIRE frontend — one large file (~4700 lines)
│   └── firebase.js      # Firestore helpers + COLS constant
├── public/
│   └── admin.html       # Standalone admin backend (plain HTML/JS, Firebase SDK via CDN)
├── api/
│   └── send-email.js    # Vercel serverless — Resend email
├── CLAUDE.md            # This file
└── vite.config.js
```

> **Important:** All UI code lives in `src/App.jsx`. There are no separate component files,
> no CSS modules, no Tailwind. Everything is inline React style objects.

---

## Architecture Patterns

### State Management
- Single `data` state object at the App root, populated from Firestore on load.
- `setDataAndSync` interceptor wraps `setData` to auto-detect diffs and write them back to Firestore.
- `safeList(col)` helper used for every Firestore collection read — catches permission errors so
  one missing collection never crashes the whole `loadAll()`.

```js
const safeList = (col) => listDocs(col).catch(() => []);
```

### Styling
- Design token system: `D.light` and `D.dark` objects. Active theme passed as `t` prop everywhere.
- `iStyle(t)` helper returns the standard input style object.
- Component variants use inline style objects, never CSS classes (except a handful in the `CSS` string).
- Card component: `<Card t={t}>`, Badge: `<Badge label color t>`, Btn: `<Btn v t>`.

### Firestore Collections (`COLS` object in firebase.js)
```
TASKS, USERS, CLIENTS, DEPARTMENTS, LEAVES, MEETINGS, TIMELOGS,
NOTIFICATIONS, ONBOARDING, NOTES, CREDENTIALS, ADPROJECTS, ADTASKS,
SETTINGS, PROJECTS
```

---

## Role System
```
Founder  >  Admin  >  Manager / HoD  >  Member
```
- `currentUser.role` is always one of: `"Founder"`, `"Admin"`, `"Manager"`, `"HoD"`, `"Member"`
- `isFounder` = role is Founder
- `isFounderAdmin` = Founder or Admin
- `canManage` = Founder, Admin, or Manager

---

## Key Components (all inside App.jsx)
| Component | What it does |
|-----------|-------------|
| `Projects` | Client → Project → Task 3-level hierarchy. `view` state switches between "projects" and "tasks". `currentProject` holds the active project. |
| `AdProjects` | Ad-hoc one-off jobs. Three tabs: projects (cards), tasks (table), commercials (billing, password-gated). |
| `TimeLogs` | Project-based card view for Founder/Manager; restricted for Members. |
| `Team` | Staff directory with search + dept/designation filters. |
| `Dashboard` | "Needs Approval" = Review tasks + pending leaves. |
| `Notifications` | All clickable, jump to source item. |
| `Sidebar` | Drag-to-reorder, saved as `navOrder` array on the user's Firestore doc. |

---

## Project Data Model
```js
// projects collection
{
  id, name, clientId, projectLead, members:[],
  deadline,        // datetime-local string
  estHours, brief, briefAttachment, outputLink,
  references:[],   // array of URL strings
  priority,        // "High" | "Medium" | "Low"
  status,          // "Not Started" | "In Progress" | "Review" | "On Hold" | "Completed"
  createdAt, createdBy
}
```

### Sub-tasks (stored on task documents, not a separate collection)
```js
// inside a task document
subtasks: [{ id, title, done, aId, deptId, due, dueTime, est, drive, refLink, brief }]
```

Sub-tasks are visible as a collapsible branch directly on the task card row.
`expandedSt` state in Projects component tracks which sub-task is expanded: `"taskId::stId"`.

---

## Ad-Hoc Projects Data Model
```js
// adprojects collection
{
  id, name, clientId, brief, poc, cost, deadline, filesLink,
  deliveryDate, fileLink, paymentStatus,  // editable in Commercials tab
  createdAt
}
```

### Commercials Tab Rules
- Visible to: Founder, Admin, Manager
- Requires password: `ProfitPenny@2026`
- State: `commUnlocked`, `commPwdInput`, `commFilterClient`, `commFilterMonth`, `editingCommCell`
- Editable columns (inline): Delivery Date, File Link, Payment Status
- `saveCommCell(rowId, field, val)` writes directly to `adProjects` in state (syncs to Firestore)

---

## Admin Backend (`public/admin.html`)
- Standalone HTML file, no bundler. Firebase SDK loaded via CDN.
- Light mode default, ☀️/🌙 toggle, Inter font.
- **Export All Data:** downloads full Firestore dump as JSON.
- **Reset App Data:** selective — checkboxes for each collection, password `ProfitPenny@2026` + type "RESET".
  Collections: tasks, leaves, meetings, timelogs, notifications, onboarding, credentials, adprojects, adtasks, settings, projects.
  Users and clients are NEVER reset.
- **Audit log:** records all admin actions.
- Build note: if build fails with EPERM on dist/admin.html, run `rm -rf dist && npm run build`.

---

## Coding Conventions
- **Never use `\n` inside JSX text** — use separate elements or template literals carefully.
- **No Tailwind, no CSS modules** — always inline style objects.
- **Lucide icons** — import from `"lucide-react"` only. Do not add new icon packages.
- **Dates** — `fd(d)` = short date, `fdt(d)` = full date. Deadlines stored as `datetime-local` strings.
- **Status colours** — use `SC(status)` for tasks, `PS_COLOR[status]` for ad-hoc projects.
- **Priority colours** — use `PC(priority)`.
- **Toasts** — `toast("message")` for success, `toast("message", "error")` for errors.
- **Modals** — `<Modal open onClose t w={width}>` wrapper component.
- **Grid layout** — 3-column cards: `gridTemplateColumns:"repeat(3,1fr)"` + `className="grid-1-mobile"` for responsive collapse.

---

## Common Commands
```bash
npm run dev      # Start dev server (Vite)
npm run build    # Production build
npm run preview  # Preview production build locally
```

If build fails due to dist/admin.html permissions:
```bash
rm -rf dist && npm run build
```

---

## Known Patterns to Follow
1. **Adding a new Firestore collection:** Add to `COLS` in `firebase.js`, add `safeList` call in `loadAll()`, add to `INIT` default state object.
2. **Adding a new tab/module:** Add to the `NAV` array with icon + label, add the component function, add to the render switch in the main App return.
3. **Adding a role gate:** `if(!["Founder","Admin"].includes(currentUser?.role)) return <AccessDenied/>`.
4. **Syncing a state change to Firestore:** Use `setData(d => ({...d, ...}))` — `setDataAndSync` handles the Firestore write automatically.
