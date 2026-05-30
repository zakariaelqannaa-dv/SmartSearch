"use client"

import SearchBar, { SearchFilters } from "@/components/search/SearchBar"
import PaperCard from "@/components/paper/PaperCard"
import SummaryPanel from "@/components/citations/SummaryPanel"
import { Paper } from "@/types/paper"
import { BookOpen, AlertCircle, Search } from "lucide-react"

interface MainDashboardProps {
  results: Paper[]
  savedPapers: Paper[]
  loading: boolean
  error: string | null
  hasSearched: boolean
  onSearch: (query: string, filters?: SearchFilters) => void
  onSaveToggle: (paper: Paper) => void
  isSaved: (id: string) => boolean
}

function SkeletonCard() {
  return (
    <div className="glass-card rounded-xl p-unit-lg animate-pulse">
      <div className="h-5 bg-on-surface-variant/10 rounded w-3/4 mb-3" />
      <div className="h-3 bg-on-surface-variant/10 rounded w-1/4 mb-4" />
      <div className="h-3 bg-on-surface-variant/10 rounded w-full mb-2" />
      <div className="h-3 bg-on-surface-variant/10 rounded w-5/6 mb-2" />
      <div className="h-3 bg-on-surface-variant/10 rounded w-4/6 mb-4" />
      <div className="flex gap-2">
        <div className="h-6 bg-on-surface-variant/10 rounded-full w-16" />
        <div className="h-6 bg-on-surface-variant/10 rounded-full w-20" />
      </div>
    </div>
  )
}

export default function MainDashboard({
  results,
  savedPapers,
  loading,
  error,
  hasSearched,
  onSearch,
  onSaveToggle,
  isSaved,
}: MainDashboardProps) {
  return (
    <div className="h-full flex flex-col overflow-hidden pt-16">
      <section className="shrink-0 px-unit-lg pt-8 mb-unit-xl text-center flex flex-col items-center">
        <h2 className="font-display-lg text-display-lg text-primary mb-unit-sm tracking-tight">
          Search the Knowledge Base
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-unit-lg">
          Access millions of academic journals, research papers, and
          technical documentations with precision filtering.
        </p>
        <SearchBar onSearch={onSearch} />
      </section>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-unit-lg pb-unit-xl max-w-container-max mx-auto w-full custom-scrollbar">
        {error && (
          <div className="flex items-center gap-3 glass-card rounded-xl px-unit-lg py-4 mb-unit-lg border border-error/30 bg-error/5">
            <AlertCircle className="text-error shrink-0" size={20} />
            <p className="text-label-md text-error flex-1">
              {error}
            </p>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter pt-unit-lg">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {!loading && !error && results.length === 0 && !hasSearched && (
          <div className="flex items-center justify-center py-unit-xl">
            <div className="text-center">
              <p className="text-body-lg text-on-surface-variant">
                Enter a query above to search academic papers.
              </p>
            </div>
          </div>
        )}

        {!loading && !error && results.length === 0 && hasSearched && (
          <div className="glass-card rounded-xl p-unit-lg text-center max-w-lg mx-auto mt-unit-lg">
            <Search className="text-on-surface-variant/40 mx-auto mb-3" size={36} />
            <p className="text-body-lg text-on-surface-variant mb-2">
              No results found
            </p>
            <p className="text-label-md text-on-surface-variant/60">
              Try different keywords, check your spelling, or broaden your search.
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter pt-unit-lg">
            {results.map((paper) => (
              <PaperCard
                key={paper.id}
                paper={paper}
                isSaved={isSaved(paper.id)}
                onSaveToggle={onSaveToggle}
              />
            ))}
          </div>
        )}

        {savedPapers.length > 0 && (
          <section className="mt-unit-xl">
            <SummaryPanel papers={savedPapers} />
          </section>
        )}

        {!loading && results.length === 0 && savedPapers.length === 0 && (
          <section className="mt-unit-xl">
            <div className="glass-card rounded-xl p-unit-lg flex flex-col items-center justify-center text-center min-h-[200px]">
              <BookOpen className="text-on-surface-variant mb-3" size={32} />
              <p className="text-label-md text-on-surface-variant">
                No papers saved yet.
              </p>
              <p className="text-label-sm text-on-surface-variant/60 mt-1">
                Click the bookmark icon on any paper to save it here.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
