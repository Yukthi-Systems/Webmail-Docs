---
id: keyboard-shortcuts
title: Keyboard Shortcuts
sidebar_position: 5
---

# Keyboard Shortcuts

Webmail UI ships with a Gmail-style keyboard shortcut system, implemented in
[`useKeyboardNavigation`](https://github.com/your-org/webmail-ui/blob/main/src/hooks/useKeyboardShortcuts.tsx)
and wired up in the mailbox view. This page documents both the shortcuts themselves and
the rules that govern when each one fires, since a few of them behave conditionally.

Press <kbd>Ctrl</kbd>+<kbd>?</kbd> at any time to open the same reference in-app.

## How it works

- Shortcuts are handled by a **single global `keydown` listener** — there's no per-row
  keybinding, so a shortcut fires no matter where focus is on the page, subject to the
  guards below.
- **Typing is never hijacked.** If focus is inside an `<input>`, `<textarea>`, or any
  content-editable element (e.g. the composer body), every shortcut is ignored *except*
  <kbd>Esc</kbd>, so you can always type the letters `j`, `c`, `r`, etc. normally.
- **All shortcuts are disabled while the composer is open.** This is a hard guard, not
  just an input-focus check — even keys that wouldn't otherwise conflict are suppressed.
- **The folder sidebar is a separate context.** While focus is on a folder item, most
  list/action shortcuts (compose, delete, flag, select, etc.) are suppressed; only a
  handful of navigation keys still apply.
- **A few actions only make sense with the reading pane open** — Reply, Reply All, and
  Forward do nothing unless an email is currently open in the viewer.
- Every keypress is **debounced by 100ms** to absorb accidental key-repeat.
- Shortcuts that use letter modifiers ignore the key if <kbd>Ctrl</kbd>, <kbd>Cmd</kbd>,
  or <kbd>Alt</kbd> is also held (except where a modifier combo is the shortcut itself,
  like <kbd>Ctrl</kbd>+<kbd>R</kbd>).

## Navigation

| Shortcut | What it does |
|---|---|
| <kbd>j</kbd> or <kbd>↓</kbd> | Move the cursor to the next email. At the end of the current page, this automatically advances to the next page instead of stopping. |
| <kbd>k</kbd> or <kbd>↑</kbd> | Move the cursor to the previous email. At the top of the page, this automatically goes to the previous page. |
| <kbd>o</kbd> or <kbd>Enter</kbd> | Open the email currently under the cursor. |
| <kbd>→</kbd> | Open the email under the cursor (only if the reading pane isn't already open). |
| <kbd>←</kbd> | Close the reading pane if it's open; otherwise, move focus to the folder sidebar. |
| <kbd>Esc</kbd> | Close the reading pane, if open. This is the one shortcut that still works while typing in a text field. |
| <kbd>n</kbd> or <kbd>Page Down</kbd> | Go to the next page of the list. |
| <kbd>p</kbd> or <kbd>Page Up</kbd> | Go to the previous page of the list. |
| <kbd>Shift</kbd>+<kbd>g</kbd> | Move focus to the folder sidebar. |
| <kbd>/</kbd> | Focus the search bar. |

## Actions

| Shortcut | What it does |
|---|---|
| <kbd>c</kbd> | Open the composer. |
| <kbd>r</kbd> | Reply — only while the reading pane is open. |
| <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>r</kbd> | Refresh the current mailbox — works regardless of whether the reading pane is open. |
| <kbd>a</kbd> | Reply All — only while the reading pane is open. |
| <kbd>f</kbd> | Forward — only while the reading pane is open. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open the in-app shortcuts reference modal. |

## Selection & Management

| Shortcut | What it does |
|---|---|
| <kbd>x</kbd> | Toggle selection of the email under the cursor. |
| <kbd>Shift</kbd>+<kbd>*</kbd> | Toggle between selecting every email on the page and clearing the selection. |
| <kbd>Shift</kbd>+<kbd>i</kbd> | Mark the current selection (or cursor email) as read. |
| <kbd>Shift</kbd>+<kbd>u</kbd> | Mark the current selection (or cursor email) as unread. |
| <kbd>e</kbd> | Flag the current selection. |
| <kbd>s</kbd> | Remove the flag from the current selection. |
| <kbd>#</kbd>, <kbd>Delete</kbd>, or <kbd>Backspace</kbd> | Delete the current selection. |
