# Scripts

Utility scripts for project maintenance.

## delete-non-production-deployments.sh

Bash script to delete all Vercel deployments except the last 10 successful production deployments using the Vercel CLI.

### Usage

```bash
# Make script executable (first time only)
chmod +x scripts/delete-non-production-deployments.sh

# Preview what will be deleted (dry run)
DRY_RUN=true ./scripts/delete-non-production-deployments.sh

# Actually delete deployments (requires confirmation)
./scripts/delete-non-production-deployments.sh

# Force delete without confirmation (use with caution!)
FORCE_DELETE=true ./scripts/delete-non-production-deployments.sh
```

### Requirements

- Vercel CLI installed (`npm install -g vercel`)
- Authenticated with Vercel (`vercel login`)
- Project linked to Vercel (`vercel link`)

### How it works

1. Checks for Vercel CLI and authentication
2. Gets the current project information from `.vercel/project.json`
3. Fetches all deployments using `vercel ls`
4. Identifies successful production deployments (Production + Ready status)
5. Keeps the last N successful production deployments (default: 10, configurable via `KEEP_COUNT`)
6. Deletes all other deployments:
   - All preview deployments
   - All failed production deployments
   - Older successful production deployments (beyond the keep count)
7. Uses `vercel rm` with deployment URLs to delete

### Environment Variables

- `KEEP_COUNT` - Number of successful production deployments to keep (default: 10)
- `DRY_RUN` - Set to `true` to preview without deleting
- `FORCE_DELETE` - Set to `true` to skip confirmation prompt
- `CI` - If set, skips confirmation (useful for CI/CD)

### Examples

```bash
# Preview mode - see what would be deleted (keeps last 10 production)
DRY_RUN=true ./scripts/delete-non-production-deployments.sh

# Keep only last 5 production deployments
KEEP_COUNT=5 ./scripts/delete-non-production-deployments.sh

# Delete with confirmation (keeps last 10 production)
./scripts/delete-non-production-deployments.sh

# Delete without confirmation (dangerous!)
FORCE_DELETE=true ./scripts/delete-non-production-deployments.sh
```
