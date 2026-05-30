"use client"

import { useState, useEffect, useCallback } from "react"
import Sidebar from "@/components/Sidebar"
import Header, { Tab } from "@/components/layout/Header"
import MainDashboard from "@/components/MainDashboard"
import HomeView from "@/components/home/HomeView"
import InsightsView from "@/components/insights/InsightsView"
import { SearchFilters } from "@/components/search/SearchBar"
import { Paper } from "@/types/paper"

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("home")
  const [results, setResults] = useState<Paper[]>([])
  const [savedPapers, setSavedPapers] = useState<Paper[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("savedPapers")
      const history = localStorage.getItem("searchHistory")
      if (saved) setSavedPapers(JSON.parse(saved))
      if (history) setSearchHistory(JSON.parse(history))
    } catch {
      /* corrupt or unavailable localStorage */
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("savedPapers", JSON.stringify(savedPapers))
  }, [savedPapers])

  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
  }, [searchHistory])

  const handleSaveToggle = useCallback((paper: Paper) => {
    setSavedPapers((prev) => {
      const exists = prev.find((p) => p.id === paper.id)
      if (exists) return prev.filter((p) => p.id !== paper.id)
      return [paper, ...prev]
    })
  }, [])

  const handleRemoveSaved = useCallback((id: string) => {
    setSavedPapers((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const handleSearch = useCallback(
    async (query: string, filters?: SearchFilters, retries = 1) => {
      setError(null)
      setHasSearched(true)
      setSearchHistory((prev) => {
        const filtered = prev.filter((s) => s !== query)
        return [query, ...filtered].slice(0, 20)
      })
      setLoading(true)
      try {
        const params = new URLSearchParams({ q: query })
        if (filters) {
          if (filters.source !== "arxiv") params.set("source", filters.source)
          if (filters.category && filters.category !== "all") params.set("category", filters.category)
          if (filters.sortBy !== "relevance") params.set("sortBy", filters.sortBy)
          if (filters.sortOrder !== "descending") params.set("sortOrder", filters.sortOrder)
        }
        const res = await fetch(`/api/search?${params.toString()}`)
        const data = await res.json()
        if (!res.ok) {
          if (res.status === 429 && retries > 0) {
            await new Promise((r) => setTimeout(r, 3000))
            setLoading(false)
            return handleSearch(query, filters, retries - 1)
          }
          throw new Error(data.error || "Search request failed")
        }
        setResults(data.papers ?? [])
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return
        setResults([])
        setError(err instanceof Error ? err.message : "Search failed. Please try again.")
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const handleRemoveHistory = useCallback((query: string) => {
    setSearchHistory((prev) => prev.filter((s) => s !== query))
  }, [])

  const handleViewSavedPaper = useCallback((paper: Paper) => {
    setResults([paper])
    setError(null)
    setActiveTab("search")
  }, [])

  const handleNewSession = useCallback(() => {
    setResults([])
    setSearchHistory([])
    setHasSearched(false)
    setActiveTab("search")
  }, [])

  const isSaved = useCallback(
    (id: string) => savedPapers.some((p) => p.id === id),
    [savedPapers]
  )

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeView
            savedPapers={savedPapers}
            searchHistory={searchHistory}
            onNavigate={setActiveTab}
          />
        )

      case "insights":
        return (
          <InsightsView
            savedPapers={savedPapers}
            searchHistory={searchHistory}
          />
        )

      case "search":
        return (
          <MainDashboard
            results={results}
            savedPapers={savedPapers}
            loading={loading}
            error={error}
            hasSearched={hasSearched}
            onSearch={handleSearch}
            onSaveToggle={handleSaveToggle}
            isSaved={isSaved}
          />
        )
    }
  }

  return (
    <>
      <Sidebar
        savedPapers={savedPapers}
        searchHistory={searchHistory}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRemoveSaved={handleRemoveSaved}
        onRemoveHistory={handleRemoveHistory}
        onSearchHistory={handleSearch}
        onViewSavedPaper={handleViewSavedPaper}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((p) => !p)}
        onNewSession={handleNewSession}
      />

      <Header activeTab={activeTab} onTabChange={setActiveTab} sidebarCollapsed={sidebarCollapsed} />

      <main
        className="h-screen overflow-x-hidden transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? "var(--spacing-sidebar-collapsed)" : "var(--spacing-sidebar-width)" }}
      >
        {renderContent()}
      </main>
    </>
  )
}


