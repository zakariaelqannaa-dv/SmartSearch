"use client"

import { Paper } from "@/types/paper"
import { Home, BarChart3, TrendingUp, BookOpen, CircleHelp } from "lucide-react"
import { Tab } from "@/components/layout/Header"

interface HomeViewProps {
  savedPapers: Paper[]
  searchHistory: string[]
  onNavigate: (tab: Tab) => void
}

export default function HomeView({
  savedPapers,
  searchHistory,
  onNavigate,
}: HomeViewProps) {
  return (
    <div className="h-full flex flex-col overflow-hidden pt-16">
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-unit-lg pb-unit-xl">
        <div className="max-w-container-max mx-auto w-full pt-unit-xl">
          <div className="glass-card rounded-xl p-unit-lg mb-unit-lg">
            <div className="flex items-center gap-3">
              <Home className="text-primary" size={28} />
              <div>
                <h2 className="text-title-lg text-title-lg font-bold text-on-surface">
                  Welcome back, Researcher
                </h2>
                <p className="text-body-md text-body-md text-on-surface-variant">
                  Your personal academic dashboard
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-unit-lg">
            <div className="glass-card rounded-xl p-unit-lg">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="text-[#a78bfa]" size={20} />
                <span className="text-label-md text-label-md text-on-surface-variant">
                  Saved Papers
                </span>
              </div>
              <p className="text-headline-lg text-headline-lg font-bold text-on-surface">
                {savedPapers.length}
              </p>
            </div>

            <div className="glass-card rounded-xl p-unit-lg">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="text-[#34d399]" size={20} />
                <span className="text-label-md text-label-md text-on-surface-variant">
                  Recent Searches
                </span>
              </div>
              <p className="text-headline-lg text-headline-lg font-bold text-on-surface">
                {searchHistory.length}
              </p>
            </div>

            <div className="glass-card rounded-xl p-unit-lg">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="text-[#f472b6]" size={20} />
                <span className="text-label-md text-label-md text-on-surface-variant">
                  Productivity
                </span>
              </div>
              <p className="text-headline-lg text-headline-lg font-bold text-on-surface">
                Active
              </p>
            </div>
          </div>

          <div className="glass-card rounded-xl p-unit-lg text-center mb-unit-lg">
            <BarChart3 className="text-on-surface-variant mx-auto mb-3" size={32} />
            <p className="text-label-md text-label-md text-on-surface-variant">
              Start searching or explore your insights.
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => onNavigate("search")}
                className="bg-primary text-on-primary px-6 py-2.5 rounded-xl text-label-md text-label-md font-bold hover:brightness-110 transition-all cursor-pointer"
              >
                Search Papers
              </button>
              <button
                onClick={() => onNavigate("insights")}
                className="bg-secondary-container/30 text-on-secondary-container px-6 py-2.5 rounded-xl text-label-md text-label-md font-bold hover:bg-secondary-container/50 transition-all cursor-pointer"
              >
                View Insights
              </button>
            </div>
          </div>

          <div className="glass-card rounded-xl p-unit-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <CircleHelp className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-title-lg text-title-lg font-bold text-on-surface">
                  What is SmartSearch?
                </h3>
                <p className="text-label-md text-label-md text-on-surface-variant">
                  Your zero-database research assistant
                </p>
              </div>
            </div>

            <p className="text-body-md text-body-md text-on-surface-variant leading-relaxed mb-8">
              SmartSearch is a zero-database research dashboard that helps you discover
              academic papers from arXiv, generate formatted citations, and bookmark
              papers for later reference — all in your browser with no sign-up required.
              Your data persists automatically via localStorage between sessions.
            </p>

            <h4 className="text-title-md text-title-md font-bold text-on-surface mb-4">
              Key Features
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-surface-container/60 rounded-xl p-5 border border-outline-variant/10">
                <h5 className="text-label-md text-label-md font-bold text-primary mb-1.5">Search</h5>
                <p className="text-label-sm text-label-sm text-on-surface-variant leading-relaxed">Query arXiv by keyword, author, or topic. Results load with abstracts, authors, and dates.</p>
              </div>
              <div className="bg-surface-container/60 rounded-xl p-5 border border-outline-variant/10">
                <h5 className="text-label-md text-label-md font-bold text-primary mb-1.5">Cite</h5>
                <p className="text-label-sm text-label-sm text-on-surface-variant leading-relaxed">Generate APA, MLA, or Chicago citations with one click. Copy directly to your clipboard.</p>
              </div>
              <div className="bg-surface-container/60 rounded-xl p-5 border border-outline-variant/10">
                <h5 className="text-label-md text-label-md font-bold text-primary mb-1.5">Bookmark</h5>
                <p className="text-label-sm text-label-sm text-on-surface-variant leading-relaxed">Save papers to your collection. View and manage them anytime from the sidebar or Insights tab.</p>
              </div>
              <div className="bg-surface-container/60 rounded-xl p-5 border border-outline-variant/10">
                <h5 className="text-label-md text-label-md font-bold text-primary mb-1.5">Local Storage</h5>
                <p className="text-label-sm text-label-sm text-on-surface-variant leading-relaxed">All data stays in your browser. No accounts, no servers — just your research, your way.</p>
              </div>
            </div>

            <h4 className="text-title-md text-title-md font-bold text-on-surface mb-4">
              How to Use
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 bg-surface-container/30 rounded-xl p-4 border border-outline-variant/10">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/15 text-primary text-label-md text-label-md font-bold shrink-0">1</span>
                <div>
                  <p className="text-label-md text-label-md font-bold text-on-surface mb-0.5">Search</p>
                  <p className="text-label-sm text-label-sm text-on-surface-variant">Enter your query to find papers from arXiv.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-surface-container/30 rounded-xl p-4 border border-outline-variant/10">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/15 text-primary text-label-md text-label-md font-bold shrink-0">2</span>
                <div>
                  <p className="text-label-md text-label-md font-bold text-on-surface mb-0.5">Cite</p>
                  <p className="text-label-sm text-label-sm text-on-surface-variant">Choose your citation format and copy it with one click.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-surface-container/30 rounded-xl p-4 border border-outline-variant/10">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/15 text-primary text-label-md text-label-md font-bold shrink-0">3</span>
                <div>
                  <p className="text-label-md text-label-md font-bold text-on-surface mb-0.5">Bookmark</p>
                  <p className="text-label-sm text-label-sm text-on-surface-variant">Save papers to your personal collection.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-surface-container/30 rounded-xl p-4 border border-outline-variant/10">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/15 text-primary text-label-md text-label-md font-bold shrink-0">4</span>
                <div>
                  <p className="text-label-md text-label-md font-bold text-on-surface mb-0.5">Insights</p>
                  <p className="text-label-sm text-label-sm text-on-surface-variant">Review your saved papers and search activity.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-5 border-t border-outline-variant/20">
              <button
                onClick={() => onNavigate("search")}
                className="flex-1 bg-primary text-on-primary py-3 rounded-xl text-label-md text-label-md font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                Start Searching
              </button>
              <button
                onClick={() => onNavigate("insights")}
                className="flex-1 bg-surface-container/80 text-on-surface py-3 rounded-xl text-label-md text-label-md font-bold hover:bg-surface-variant/30 active:scale-95 transition-all cursor-pointer border border-outline-variant/20"
              >
                View Insights
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
