"use client"

import { SlidersHorizontal, X, ChevronDown, BookOpen, Globe, GraduationCap, Check } from "lucide-react"
import { useState, useRef, useEffect } from "react"

export type SearchSource = "arxiv" | "wikipedia" | "cornell"

export interface SearchFilters {
  source: SearchSource
  category: string
  sortBy: "relevance" | "lastUpdatedDate" | "submittedDate"
  sortOrder: "ascending" | "descending"
}

interface SearchBarProps {
  onSearch?: (query: string, filters?: SearchFilters) => void
}

interface SelectOption {
  value: string
  label: string
}

interface CustomSelectProps {
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
}

function CustomSelect({ value, options, onChange }: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selected = options.find((o) => o.value === value)

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full bg-surface-variant/10 hover:bg-surface-variant/20 border-0 rounded-xl px-3 py-2 text-label-sm text-on-surface font-medium outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer flex items-center justify-between gap-2"
      >
        <span>{selected?.label ?? value}</span>
        <ChevronDown size={16} className="shrink-0 text-on-surface-variant/60" />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-surface-container-high border border-outline-variant/20 rounded-xl shadow-2xl z-50 py-1 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`w-full text-left px-3 py-1.5 text-label-sm transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                opt.value === value
                  ? "text-primary bg-primary/10"
                  : "text-on-surface hover:bg-surface-variant/20"
              }`}
            >
              <span>{opt.label}</span>
              {opt.value === value && <Check size={14} className="shrink-0 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const sources: { value: SearchSource; label: string; icon: typeof BookOpen }[] = [
  { value: "arxiv", label: "arXiv", icon: BookOpen },
  { value: "wikipedia", label: "Wikipedia", icon: Globe },
  { value: "cornell", label: "Cornell", icon: GraduationCap },
]

const categories = [
  { value: "all", label: "All Categories" },
  { value: "cs", label: "Computer Science" },
  { value: "math", label: "Mathematics" },
  { value: "physics", label: "Physics" },
  { value: "stat", label: "Statistics" },
  { value: "q-bio", label: "Quantitative Biology" },
  { value: "q-fin", label: "Quantitative Finance" },
]

const defaultFilters: SearchFilters = {
  source: "arxiv",
  category: "all",
  sortBy: "relevance",
  sortOrder: "descending",
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters)
  const [activeFilterCount, setActiveFilterCount] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let count = 0
    if (filters.source !== "arxiv") count++
    if (filters.category !== "all") count++
    if (filters.sortBy !== "relevance") count++
    if (filters.sortOrder !== "descending") count++
    setActiveFilterCount(count)
  }, [filters])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowFilters(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && onSearch) {
      onSearch(query.trim(), filters)
    }
  }

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters(defaultFilters)
  }

  const SourceIcon = sources.find((s) => s.value === filters.source)?.icon ?? BookOpen

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl search-glow transition-all duration-300 focus-within:max-w-4xl">
      <div className="relative flex items-center glass-card rounded-full px-6 py-4">
        <SourceIcon className="text-primary mr-3 shrink-0" size={22} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search query"
          className="bg-transparent border-none outline-none flex-1 text-body-md text-on-surface placeholder:text-on-surface-variant/50 font-body-md"
          placeholder={
            filters.source === "wikipedia"
              ? "Search Wikipedia..."
              : filters.source === "cornell"
              ? "Search Cornell news..."
              : "Search by paper title, author, or DOI..."
          }
          type="text"
        />
        <div className="flex items-center gap-3">
          <span className="w-px h-6 bg-outline-variant/30" />
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowFilters((p) => !p)}
              aria-expanded={showFilters}
              aria-label="Open filters"
              className={`flex items-center gap-1.5 transition-colors text-label-md font-label-md cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none rounded-lg ${
                activeFilterCount > 0
                  ? "text-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <SlidersHorizontal size={18} />
              {filters.source !== "arxiv" ? sources.find((s) => s.value === filters.source)?.label : "Filters"}
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-primary text-[10px] text-on-primary font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-surface-container-high/95 backdrop-blur-xl border border-outline-variant/20 rounded-2xl shadow-2xl p-4 z-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-label-sm font-bold text-on-surface">Filters</h4>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="flex items-center gap-1 text-label-xs text-primary hover:text-primary/80 transition-colors cursor-pointer"
                    >
                      <X size={12} />
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-label-xs text-on-surface-variant/70 mb-1 block font-medium tracking-wide uppercase">Source</label>
                    <CustomSelect
                      value={filters.source}
                      options={sources}
                      onChange={(v) => handleFilterChange("source", v)}
                    />
                  </div>

                  {filters.source === "arxiv" && (
                    <>
                      <div>
                        <label className="text-label-xs text-on-surface-variant/70 mb-1 block font-medium tracking-wide uppercase">Category</label>
                        <CustomSelect
                          value={filters.category}
                          options={categories}
                          onChange={(v) => handleFilterChange("category", v)}
                        />
                      </div>

                      <div>
                        <label className="text-label-xs text-on-surface-variant/70 mb-1 block font-medium tracking-wide uppercase">Sort By</label>
                        <CustomSelect
                          value={filters.sortBy}
                          options={[
                            { value: "relevance", label: "Relevance" },
                            { value: "lastUpdatedDate", label: "Last Updated" },
                            { value: "submittedDate", label: "Submission Date" },
                          ]}
                          onChange={(v) => handleFilterChange("sortBy", v)}
                        />
                      </div>

                      <div>
                        <label className="text-label-xs text-on-surface-variant/70 mb-1 block font-medium tracking-wide uppercase">Sort Order</label>
                        <CustomSelect
                          value={filters.sortOrder}
                          options={[
                            { value: "descending", label: "Descending" },
                            { value: "ascending", label: "Ascending" },
                          ]}
                          onChange={(v) => handleFilterChange("sortOrder", v)}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
