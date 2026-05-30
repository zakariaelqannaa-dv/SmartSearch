"use client"

import { Search, SlidersHorizontal, X, ChevronDown, BookOpen, Globe, GraduationCap } from "lucide-react"
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
          className="bg-transparent border-none outline-none flex-1 text-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 font-body-md"
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
              className={`flex items-center gap-1.5 transition-colors text-label-md text-label-md font-label-md cursor-pointer whitespace-nowrap ${
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
              <div className="absolute right-0 top-full mt-2 w-72 bg-surface-container-high/95 backdrop-blur-xl border border-outline-variant/20 rounded-2xl shadow-2xl p-5 z-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-label-md text-label-md font-bold text-on-surface">Filters</h4>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="flex items-center gap-1 text-label-sm text-label-sm text-primary hover:text-primary/80 transition-colors cursor-pointer"
                    >
                      <X size={14} />
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-label-xs text-label-xs text-on-surface-variant/70 mb-1.5 block font-medium tracking-wide uppercase">Source</label>
                    <div className="relative">
                      <select
                        value={filters.source}
                        onChange={(e) => handleFilterChange("source", e.target.value)}
                        className="w-full bg-surface-variant/10 hover:bg-surface-variant/20 border-0 rounded-xl px-4 py-2.5 pr-8 text-label-md text-label-md text-on-surface font-medium outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer appearance-none"
                      >
                        {sources.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/60" />
                    </div>
                  </div>

                  {filters.source === "arxiv" && (
                    <>
                      <div>
                        <label className="text-label-xs text-label-xs text-on-surface-variant/70 mb-1.5 block font-medium tracking-wide uppercase">Category</label>
                        <div className="relative">
                          <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange("category", e.target.value)}
                            className="w-full bg-surface-variant/10 hover:bg-surface-variant/20 border-0 rounded-xl px-4 py-2.5 pr-8 text-label-md text-label-md text-on-surface font-medium outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer appearance-none"
                          >
                            {categories.map((c) => (
                              <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                          </select>
                          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/60" />
                        </div>
                      </div>

                      <div>
                        <label className="text-label-xs text-label-xs text-on-surface-variant/70 mb-1.5 block font-medium tracking-wide uppercase">Sort By</label>
                        <div className="relative">
                          <select
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                            className="w-full bg-surface-variant/10 hover:bg-surface-variant/20 border-0 rounded-xl px-4 py-2.5 pr-8 text-label-md text-label-md text-on-surface font-medium outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer appearance-none"
                          >
                            <option value="relevance">Relevance</option>
                            <option value="lastUpdatedDate">Last Updated</option>
                            <option value="submittedDate">Submission Date</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/60" />
                        </div>
                      </div>

                      <div>
                        <label className="text-label-xs text-label-xs text-on-surface-variant/70 mb-1.5 block font-medium tracking-wide uppercase">Sort Order</label>
                        <div className="relative">
                          <select
                            value={filters.sortOrder}
                            onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
                            className="w-full bg-surface-variant/10 hover:bg-surface-variant/20 border-0 rounded-xl px-4 py-2.5 pr-8 text-label-md text-label-md text-on-surface font-medium outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer appearance-none"
                          >
                            <option value="descending">Descending</option>
                            <option value="ascending">Ascending</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/60" />
                        </div>
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
