---
id: folders
title: Folders & ACL
sidebar_position: 3
---

# Folders & ACL

## Folder management

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/folder/path` | Get the full folder hierarchy — name, flags, delimiter, unread count, status, for every folder |
| `POST` | `/folder/path` | Create a folder. Query: `folder_path` |
| `PUT` | `/folder/path` | Rename a folder. Query: `old_folder_path`, `new_folder_path` |
| `DELETE` | `/folder/path` | Delete a folder and everything in it |
| `GET` | `/folder/uid-validity` | Get IMAP `UIDNEXT` / `UIDVALIDITY` / `MESSAGES` for a folder — useful for clients that want to detect when a cached view is stale |
| `GET` | `/folder/quota` | Get quota usage for a folder (used/total, parsed into KB/MB/percent). Root-level quota is not implemented yet (`501`) |

## Shared-mailbox ACLs

IMAP ACLs let one account grant another account specific permissions on a folder — this
is what powers shared/delegated mailboxes.

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/folder/acl` | List every ACL entry on a folder — `[{user, permissions}, ...]` |
| `GET` | `/folder/acl/own` | Get *your own* effective rights on a folder (IMAP `MYRIGHTS`) |
| `POST` | `/folder/acl` | Grant/set a user's permissions on a folder |
| `DELETE` | `/folder/acl` | Remove a user's ACL entry entirely |

`POST /folder/acl` body:

```json
{
  "folder_path": "Shared/Team Inbox",
  "user": "colleague@example.com",
  "permissions": "lrs"
}
```

### Permission letters

| Letter | Meaning |
|---|---|
| `l` | Lookup — folder is visible to `LIST`/`LSUB` |
| `r` | Read — select the folder, fetch, search |
| `s` | Keep per-message Seen/unseen state |
| `w` | Write — change flags other than Seen/Deleted |
| `i` | Insert (append/copy into the folder) |
| `p` | Post (send mail directly to the folder's submission address, if supported) |
| `k` | Create sub-folders |
| `x` | Delete this folder (or rename it away) |
| `t` | Delete messages (mark `\Deleted`) |
| `e` | Expunge |
| `a` | Administer — change this folder's own ACL |

A common read-only share is `lrs`; a full collaborative shared folder is closer to
`lrswipkxte`.
