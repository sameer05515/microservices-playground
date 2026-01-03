# Snapshot Sources Guide

This document explains how conversation snapshot sources are modeled and consumed in `chat-gpt-conversation`.

## Why This Matters

The app loads conversation exports from `public/data/` through snapshot metadata in:

- `src/common/utils/snapshots.json`
- `src/common/utils/constants.js`

If the snapshot value shape and loader logic are not aligned, the UI shows empty data or failed fetches.

## Snapshot Configuration Model

`snapshots.json` has:

- `coversationNames` (map of key => source location)
- `LATEST_CONVERSATION_FILE` (default key)

Example source values:

- Single file source:
  - `/data/conversations-20-Feb-2026.json`
- Folder source:
  - `/data/conversations-23-Mar-2026/`

## Source Types

### 1) Single JSON file

A source points to one `.json` file that contains an array of exported conversations.

### 2) Folder shards

A source points to a folder ending with `/`, where the data is split into multiple files such as:

- `conversations-000.json`
- `conversations-001.json`
- ...

The loader should merge all shard arrays into one list.

## Current Contract (Recommended)

Keep this contract stable across all dashboard variants:

1. Store source map in `coversationNames`.
2. Treat `LATEST_CONVERSATION_FILE` as a **key**, not a URL.
3. Resolve key -> path before calling `fetch(...)`.
4. If path ends with `/`, load shard files and merge.

## Places That Must Stay In Sync

- `src/common/utils/constants.js`
  - key/path resolution helpers
- `src/components/CGPTDataRendererDashboard/fetchJsonData.js`
  - v1 loading path
- `src/components/CGPTDataRendererDashboard/cgpt-data-operations-v2.js`
  - Pragyam context loading path
- `src/components/CGPTDataRendererDashboard/JSONFileSelector/v1.jsx`
- `src/components/CGPTDataRendererDashboard/JSONFileSelector/v2.jsx`
  - selector option values should be source paths, labels should be keys

## Common Failure Modes

### Key used directly as URL

- Symptom: fetch fails for default load.
- Cause: code uses `LATEST_CONVERSATION_FILE` directly as `selectedFile`.
- Fix: resolve key to source path first.

### Folder source treated as a file

- Symptom: fetch on `/data/foo/` fails or returns invalid JSON.
- Cause: loader only does `fetch(source).json()`.
- Fix: detect folder source and load shard files.

### Selector mismatch

- Symptom: default option not selected or persisted source not restored.
- Cause: selector expects URL value, but initial value is key.
- Fix: normalize both to source path for selection state.

## Verification Checklist

After changing snapshot logic:

1. App starts with latest source loaded.
2. Switching to a single-file source works.
3. Switching to a folder source works.
4. Refresh keeps the selected source from storage.
5. Search and conversation navigation still work.

## Suggested Future Improvement

Move source loading into one shared utility and call it from all contexts/components. This avoids drift between v1 and Pragyam flows.
