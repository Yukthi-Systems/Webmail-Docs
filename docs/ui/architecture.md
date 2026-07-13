---
id: architecture
title: Architecture
sidebar_position: 3
---

# Architecture

Webmail UI is a single-page app built with:

| Concern | Library |
|---|---|
| Build tool | [Vite](https://vitejs.dev/) |
| UI components | [Radix UI Themes](https://www.radix-ui.com/themes) |
| Utility styling | [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`) |
| Routing | [TanStack Router](https://tanstack.com/router) (file-based) |
| Server state | [TanStack Query](https://tanstack.com/query) |
| Client state | [Jotai](https://jotai.org/) |
| Rich text editor | [Tiptap](https://tiptap.dev/) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [yup](https://github.com/jquense/yup) |

Radix UI Themes handles component primitives (dialogs, buttons, form fields), while
Tailwind utility classes are used directly in newer components (Contacts, Admin, Video).
Both coexist in the codebase — don't be surprised to see a component styled entirely with
Tailwind classes next to one using Radix's `style`/CSS-variable props.

## Folder structure

```
src/
  api/          # API client / request functions, one file per resource
  assets/       # Static assets bundled by Vite
  components/
    common/     # Shared UI building blocks
    composer/   # Email composer (Tiptap-based editor)
    contacts/   # Contact manager (list, form, bulk import/export)
    login/      # Authentication screens, including branded per-company login
    mailbox/    # Message list, thread view, search
    settings/   # Account & preference screens (see below)
    admin/      # Internal domain/tenant provisioning console — not an end-user feature
    video/      # "Instant video call" launcher (see note below)
    help/       # In-app Help/About screen — also the source of truth for the
                # feature list and keyboard shortcuts used throughout these docs
    ui/         # Shared low-level primitives (theme wrapper, toasts, error boundary)
  constants/    # Runtime config (API_CONFIG) and small app-wide constants
  hooks/        # Shared React hooks
  routes/       # File-based routes (TanStack Router)
  state/        # Jotai atoms
  utils/        # Helpers
```

`src/components/Test/` is a leftover scratch component (renders static placeholder text,
unused) — safe to ignore or delete, not a real feature.

### Settings sub-sections

`components/settings/` is a tabbed screen; each tab is its own folder:

| Tab | Folder | Purpose |
|---|---|---|
| General | `settings/general/` | Theme (light/dark), accent color, timezone, locale |
| Folder | `settings/folders/` | Per-folder visibility, sidebar label, view mode |
| Filter | `settings/filters/` | Sieve filter rule builder (see [Features](./features.md)) |
| Vacation | `settings/vacation/` | Out-of-office autoresponder |
| Mapping | `settings/mapping/` | Special-folder mapping (which IMAP folder is "Sent", etc.) |
| Templates | `settings/tempelates/` | Reusable email template CRUD |
| About | `settings/about/` | Version info |

### The video call feature, honestly

The Help screen advertises "Instant Video Calls." The actual implementation
(`components/video/index.tsx`) opens `https://meet.mail25.info` in a new browser tab
after a short delay — there's no WebRTC, no embedded call UI, and no video SDK in
`package.json`. If you're self-hosting, you'll want to either point this at your own
meeting service or treat it as a placeholder integration.

### Multi-tenant / branded routes

Alongside the default routes (under `_baselayout`), there's a parallel `$slug` route
tree (`routes/$slug.tsx` and children) that loads a company's branding config (logo,
background, allowed email domains) and renders a white-labeled login/app shell for that
slug. This is what the Admin Console's **Branding** tab manages — see
[Admin Console](./admin-panel.md).

## Data flow

1. Routes (`src/routes`) render page-level components.
2. Server data is fetched via TanStack Query hooks that call into `src/api`.
3. UI-local state (open panels, drafts, selection, user settings) lives in Jotai atoms
   under `src/state`.
4. The composer persists drafts and sends mail through the same API client.
5. Runtime config (API base URL, app version, reCAPTCHA key) is centralized in
   `src/constants/config.ts` as `API_CONFIG` — see [Configuration](./configuration.md).
