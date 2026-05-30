import {
  LayoutDashboard,
  BookOpen,
  Plus,
  Bookmark,
  X,
  History,
  Home,
  Lightbulb,
  PanelLeftClose,
  PanelLeft,
  ExternalLink,
} from "lucide-react"
import { Paper } from "@/types/paper"
import { Tab } from "@/components/layout/Header"

interface SidebarProps {
  savedPapers: Paper[]
  searchHistory: string[]
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  onRemoveSaved: (id: string) => void
  onRemoveHistory: (query: string) => void
  onSearchHistory: (query: string) => void
  onViewSavedPaper: (paper: Paper) => void
  isCollapsed: boolean
  onToggle: () => void
  onNewSession: () => void
}

const sidebarTabs: { key: Tab; label: string; icon: typeof Home }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "search", label: "Search", icon: LayoutDashboard },
  { key: "insights", label: "Insights", icon: Lightbulb },
]

export default function Sidebar({
  savedPapers,
  searchHistory,
  activeTab,
  onTabChange,
  onRemoveSaved,
  onRemoveHistory,
  onSearchHistory,
  onViewSavedPaper,
  isCollapsed,
  onToggle,
  onNewSession,
}: SidebarProps) {
  return (
    <aside
      className="fixed left-0 top-0 h-screen z-50 bg-surface-container-low/90 backdrop-blur-xl border-r border-outline-variant/20 shadow-xl flex flex-col py-unit-lg overflow-x-hidden select-none transition-[width] duration-300 ease-in-out"
      style={{ width: isCollapsed ? "var(--spacing-sidebar-collapsed)" : "var(--spacing-sidebar-width)" }}
    >
      <div className="px-unit-lg mb-unit-xl flex items-center gap-3 min-w-0">
        <div
          className="overflow-hidden transition-[opacity,width] duration-200 ease-in-out flex items-center"
          style={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : "auto" }}
        >
          <div className="whitespace-nowrap">
            <h1 className="text-headline-md text-headline-md font-bold text-primary leading-none">
              SmartSearch
            </h1>
            <p className="text-label-sm text-label-sm text-on-surface-variant opacity-70 mt-0.5">
              Research Assistant
            </p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="ml-auto shrink-0 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
        >
          {isCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-unit-sm space-y-1">
        {sidebarTabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`w-full flex items-center gap-unit-md py-3 px-unit-md rounded-lg transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] text-label-md text-label-md cursor-pointer text-left ${
              activeTab === key
                ? "bg-primary/10 text-primary border-0"
                : "text-on-surface-variant hover:bg-surface-variant/20"
            }`}
          >
            <Icon
              className={`shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${activeTab === key ? "text-primary scale-110" : ""}`}
              size={20}
            />
            <span
              className="overflow-hidden transition-[opacity,width] duration-200 ease-in-out whitespace-nowrap py-0.5"
              style={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : "auto" }}
            >
              {label}
            </span>
          </button>
        ))}
      </nav>

      <div
        className="overflow-hidden transition-[opacity,max-height] duration-200 ease-in-out px-unit-md"
        style={{
          opacity: isCollapsed ? 0 : 1,
          maxHeight: isCollapsed ? 0 : searchHistory.length > 0 ? "240px" : "0",
        }}
      >
        {searchHistory.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-3 px-2">
              <History className="text-primary shrink-0" size={16} />
              <span className="text-label-sm text-label-sm font-bold text-on-surface whitespace-nowrap">
                Recent Searches
              </span>
            </div>
            <div className="space-y-1 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
              {searchHistory.map((query) => (
                <div
                  key={query}
                  className="flex items-center justify-between group/item px-2 py-1.5 rounded-lg hover:bg-surface-container-high/50 transition-colors cursor-pointer"
                  onClick={() => {
                    onTabChange("search")
                    onSearchHistory(query)
                  }}
                >
                  <span className="text-label-sm text-label-sm text-on-surface-variant truncate group-hover/item:text-primary transition-colors">
                    {query}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveHistory(query)
                    }}
                    className="opacity-0 group-hover/item:opacity-100 text-on-surface-variant hover:text-error hover:bg-error/10 transition-all duration-200 shrink-0 cursor-pointer rounded-full p-1.5"
                    title="Remove"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div
        className="overflow-hidden transition-[opacity,max-height] duration-200 ease-in-out px-unit-md"
        style={{
          opacity: isCollapsed ? 0 : 1,
          maxHeight: isCollapsed ? 0 : "60px",
        }}
      >
        <button onClick={onNewSession} className="w-full bg-primary text-on-primary py-3 px-4 rounded-xl text-label-md text-label-md font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/10 cursor-pointer whitespace-nowrap">
          <Plus size={18} />
          New Research Session
        </button>
      </div>

      <div className="mt-auto px-unit-md pt-unit-lg border-t border-outline-variant/20">
        <div className="flex items-center gap-2 mb-4 px-2">
          <Bookmark className="text-primary shrink-0" size={20} />
          <div
            className="overflow-hidden transition-[opacity,width] duration-200 ease-in-out flex items-center gap-2"
            style={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : "auto" }}
          >
            <span className="text-label-md text-label-md font-bold text-on-surface whitespace-nowrap">
              Saved Citations
            </span>
            {savedPapers.length > 0 && (
              <span className="text-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">
                {savedPapers.length}
              </span>
            )}
          </div>
        </div>
        <div
          className="space-y-3 max-h-[240px] overflow-y-auto custom-scrollbar pr-1 transition-[opacity,max-height] duration-200 ease-in-out"
          style={{
            opacity: isCollapsed ? 0 : 1,
            maxHeight: isCollapsed ? 0 : "240px",
          }}
        >
          {savedPapers.length === 0 ? (
            <p className="text-label-sm text-label-sm text-on-surface-variant/50 px-2 whitespace-nowrap">
              No papers saved yet.
            </p>
          ) : (
            savedPapers.map((paper) => (
              <div
                key={paper.id}
                onClick={() => onViewSavedPaper(paper)}
                className="p-3 rounded-lg bg-surface-container-high/50 border border-outline-variant/10 hover:border-primary/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-1">
                  {paper.link ? (
                    <a
                      href={paper.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-label-sm text-label-sm font-bold text-primary hover:underline line-clamp-1 transition-colors flex-1 whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-1"
                    >
                      {paper.title}
                      <ExternalLink size={12} className="shrink-0 opacity-60" />
                    </a>
                  ) : (
                    <h4 className="text-label-sm text-label-sm font-bold text-on-surface line-clamp-1 flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                      {paper.title}
                    </h4>
                  )}
                  <button
                    onClick={() => onRemoveSaved(paper.id)}
                    className="text-on-surface-variant hover:text-error transition-colors shrink-0 opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="text-label-sm text-[10px] text-on-surface-variant mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                  {paper.authors} &bull; {paper.date}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

    </aside>
  )
}
