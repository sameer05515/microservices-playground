# Review Notes

This file captures practical review findings for maintainers.

## Scope Reviewed

- Snapshot metadata and source loading paths
- Dashboard v1 and Pragyam loading flows
- File selectors and source value handling

## Key Findings

### 1) Snapshot key vs URL path ambiguity

`LATEST_CONVERSATION_FILE` represents a key in `coversationNames`, not always a fetchable URL by itself.

Impact:

- Default source initialization can fail if code directly passes the key to `fetch`.

Recommendation:

- Keep key/path mapping explicit in `constants`.
- Resolve key before network operations.

### 2) Folder shard sources are now part of data reality

`snapshots.json` includes folder-based values ending in `/`.

Impact:

- Loaders that only parse one JSON file are insufficient.

Recommendation:

- Support both source types:
  - direct file
  - shard folder merge

### 3) Duplicate loading logic across modules

There are multiple fetch pipelines (`fetchJsonData` and `cgpt-data-operations-v2`).

Impact:

- Logic can drift, causing one dashboard variant to work while another breaks.

Recommendation:

- Consolidate into one shared loader utility and reuse it everywhere.

### 4) Selector value normalization

Selectors label entries with keys and submit path values. This is correct, but default selected value must be normalized to path.

Impact:

- Mismatch causes "not selected" defaults or inconsistent restore behavior.

Recommendation:

- Store and operate on resolved source paths in UI selection state.

## Risk Level Summary

- **High**: key/path confusion in initial load
- **High**: no shard-folder loading support
- **Medium**: duplicated loading implementations
- **Medium**: selector value normalization mismatch

## Regression Tests To Keep

1. Load latest default source on first launch.
2. Load a single-file snapshot source.
3. Load a folder-sharded snapshot source.
4. Persist and restore selected source after refresh.
5. Verify conversation list, search, and message rendering in both v1 and v2 paths.

## Notes For Contributors

- If you change source shape in `snapshots.json`, update docs and loader utility in the same PR.
- Prefer centralized logic over per-component fetch behavior.
