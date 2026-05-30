# Live Search Flow Implementation

## Files to Modify

### 1. src/app/page.tsx

**Changes:**
- Remove unused etchFromArxiv import
- Add error: string | null state after loading
- Update handleSearch to route through /api/search proxy, set error on failure
- Pass error prop to MainDashboard

**handleSearch replacement:**
`	sx
const handleSearch = useCallback(
  async (query: string) => {
    setError(null)
    setSearchHistory((prev) => {
      const filtered = prev.filter((s) => s !== query)
      return [query, ...filtered].slice(0, 20)
    })
    setLoading(true)
    try {
      const res = await fetch(\/api/search?q=\\)
      if (!res.ok) throw new Error("Search request failed")
      const data = await res.json()
      setResults(data.papers)
    } catch {
      setResults([])
      setError("Network connection interrupted. Please try again.")
    } finally {
      setLoading(false)
    }
  },
  []
)
`

**MainDashboard usage:**
\\\	sx
<MainDashboard
  results={results}
  savedPapers={savedPapers}
  loading={loading}
  error={error}
  onSearch={handleSearch}
  onSaveToggle={handleSaveToggle}
  isSaved={isSaved}
/>
\\\

### 2. src/components/MainDashboard.tsx

**Changes:**
- Add error: string | null to props interface
- Add SkeletonCard component for loading state
- Replace text loading with 4 skeleton cards
- Add error banner above results
- Import AlertCircle from lucide-react

### 3. No changes needed to:
- src/app/api/search/route.ts
- src/lib/arxiv.ts
- src/components/Sidebar.tsx
- src/components/search/SearchBar.tsx

## Verification
Run \
pm run build\ after changes.
