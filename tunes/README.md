# Tune Revision Catalog

All tune revision binaries (`.hpt`) and their markdown run documentation are stored here.

### Rules for Tunes:
1. **Never edit an existing tune file in place.** Always increment the version number (`v001`, `v002`, `v003`, etc.).
2. Every tune has:
   * A parent file it was derived from.
   * An immediate rollback file if testing encounters adverse behavior.
   * A corresponding entry in `revisions.json` containing its exact SHA-256 hash.
3. The original factory read (`v000-stock-read.hpt`) is placed in `backups/` and committed as the root parent of all subsequent tunes.
