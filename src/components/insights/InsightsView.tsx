"use client"

import { Paper } from "@/types/paper"
import SummaryPanel from "@/components/citations/SummaryPanel"
import { BarChart3, BookOpen } from "lucide-react"

interface InsightsViewProps {
  savedPapers: Paper[]
  searchHistory: string[]
}

export default function InsightsView({
  savedPapers,
  searchHistory,
}: InsightsViewProps) {
  return (
    <div className="h-full flex flex-col overflow-hidden pt-16">
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-unit-lg pb-unit-xl">
        <div className="max-w-container-max mx-auto w-full pt-unit-xl">
          <div className="glass-card rounded-xl p-unit-lg mb-unit-lg">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-primary" size={28} />
              <div>
                <h2 className="text-title-lg text-title-lg font-bold text-on-surface">
                  Research Insights
                </h2>
                <p className="text-body-md text-body-md text-on-surface-variant">
                  Track your reading patterns and saved citations
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-unit-lg">
            <div className="glass-card rounded-xl p-unit-lg">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="text-primary shrink-0" size={20} />
                <span className="text-label-md text-label-md font-bold text-on-surface">
                  Saved Papers ({savedPapers.length})
                </span>
              </div>
              {savedPapers.length === 0 ? (
                <div className="text-center py-6">
                  <BookOpen className="text-on-surface-variant mx-auto mb-2" size={24} />
                  <p className="text-label-sm text-label-sm text-on-surface-variant">
                    No saved papers yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedPapers.map((paper) => (
                    <div
                      key={paper.id}
                      className="p-3 rounded-lg bg-surface-container-high/50 border border-outline-variant/10"
                    >
                      <h4 className="text-label-md text-label-md font-bold text-on-surface line-clamp-1">
                        {paper.title}
                      </h4>
                      <p className="text-label-sm text-label-sm text-on-surface-variant mt-1">
                        {paper.authors}
                      </p>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-primary/10 text-label-sm text-label-sm text-primary">
                        {paper.categoryType}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-card rounded-xl p-unit-lg">
              <SummaryPanel papers={savedPapers} />
            </div>
          </div>

          <div className="glass-card rounded-xl p-unit-lg">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="text-primary shrink-0" size={20} />
              <span className="text-label-md text-label-md font-bold text-on-surface">
                Search Activity
              </span>
            </div>
            {searchHistory.length === 0 ? (
              <p className="text-label-sm text-label-sm text-on-surface-variant">
                No search history yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((query) => (
                  <span
                    key={query}
                    className="px-3 py-1.5 rounded-full bg-surface-container-high/50 text-label-sm text-label-sm text-on-surface-variant border border-outline-variant/10"
                  >
                    {query}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
