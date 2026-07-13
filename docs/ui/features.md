---
id: features
title: Features
sidebar_position: 4
---

# Features

A detailed tour of what Webmail UI does, organized the same way the in-app Help screen
(`components/help`) presents it — this page goes one level deeper than that screen's
short descriptions.

## Mailbox

- **Threaded list + reading pane** — conversations are grouped into threads; opening one
  shows the full reply/forward history in chronological order.
- **Search** — the search bar filters by sender, subject, or content; combine it with
  folder navigation to narrow results further.
- **Drag and drop** — click and drag any message from the list onto a folder in the
  sidebar to move it instantly, without opening a context menu.
- **Quick sender preview** — hovering a sender's name pops up a card with their contact
  info and other recipients on the thread. This is controlled by the
  `email.show_recipient` setting under **Settings → General**.
- **Quick hover actions** — hovering a row also reveals inline Delete/Flag/Move buttons,
  controlled separately by the `email.show_quick_hover_actions` setting.

## Composer

Built on [Tiptap](https://tiptap.dev/), with:

- Rich text formatting (bold, italic, lists, links, etc.)
- Attachments, including inline (embedded) attachments
- Draft autosave
- **Templates** — insert a reusable template (managed under **Settings → Templates**)
  directly into a message via the template picker in the composer toolbar

## Contacts

A full address book at `components/contacts/`, backed by the API's `/contacts/*`
endpoints:

1. **Browse** — a paginated table (desktop) or card list (mobile) of every contact.
2. **Add / edit** — a modal form (name, email, phone, notes).
3. **Bulk create** — add several contacts at once via a dynamic add/duplicate/remove-row
   form (`BulkCreateView`), or import a CSV (`CSVImport`).
4. **Bulk delete** — multi-select rows (including "select all") and delete in one action.
5. **Export** — export the full directory as CSV, XLSX, or vCard, with progress feedback
   since it paginates through the whole contact list before exporting.
6. **Search** — typeahead search by partial email as you type.

## Sieve Filters

Server-side mail filtering, managed under **Settings → Filter**, using the
[Sieve](https://www.rfc-editor.org/rfc/rfc5228) mail filtering language under the hood
(via the ManageSieve protocol on the API side — see
[API: Sieve Filters](/docs/api/reference/sieve)).

Concepts:

- A mail account can have multiple **scripts**, but only one is **active** at a time.
- Each script contains one or more **filters** — named rules with:
  - **Conditions** — e.g. `Subject matches "Invoice*"`, combined with a **match type**
    (`allof` = AND, `anyof` = OR)
  - **Actions** — e.g. file into a folder, discard, forward
- Filters can be individually enabled/disabled without deleting them.

Step by step, to create a filter:

1. Go to **Settings → Filter**.
2. Pick (or create) the script you want to edit in the script selector.
3. Click **New Filter**, give it a name.
4. Add one or more conditions (field, comparator, value) and choose whether all
   conditions must match (`allof`) or any one is enough (`anyof`).
5. Add the action(s) to run when the filter matches (e.g. move to a folder).
6. Save — the UI serializes your rule into real Sieve syntax and uploads the whole
   script back to the mail server.

An in-app `SieveTutorial` walks through this same flow interactively if you'd rather
learn by doing than by reading.

## Vacation responder

**Settings → Vacation** configures an out-of-office autoresponder — enable/disable it,
set the message, and (depending on server support) a date range.

## Folder settings

**Settings → Folder** lets you control, per folder (Inbox, Sent, Drafts, Spam, Trash,
and any custom folders):

- Whether it's shown in the sidebar at all
- Its sidebar label
- View mode — flat list vs. threaded conversation view (Inbox/Sent)

**Settings → Mapping** is a related, separate tab: it maps special roles (which real
IMAP folder counts as "Sent", "Drafts", etc.) — useful when connecting to a mail server
whose folder names don't match the client's defaults.

## Appearance

**Settings → General** controls:

- **Theme** — Light / Dark
- **Accent color** — a swatch picker that drives Radix Themes' accent color site-wide
- **Timezone** and **locale**

:::note
The in-app Help screen also advertises a "System" theme option and a UI "density"
setting. Neither currently exists as a real field in Settings → General — if you're
extending this feature, that's the gap to fill; if you're just using the app, ignore
those two lines in the Help screen for now.
:::

## Video calls

The Help screen advertises "Instant Video Calls." In the current implementation,
clicking this simply opens `https://meet.mail25.info` in a new browser tab after a short
delay — there is no in-app calling UI, no WebRTC, and no video SDK involved. Treat it as
an external-link launcher rather than a built-in feature; see
[Architecture](./architecture.md#the-video-call-feature-honestly) for the implementation
note.

## Admin console

Domain provisioning and white-label branding are handled by a separate, API-key-gated
internal console — this is operator tooling for whoever runs the mail platform, not an
end-user mailbox feature. See [Admin Console](./admin-panel.md) for details.
