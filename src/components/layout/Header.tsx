import { Home, Search, Lightbulb } from "lucide-react"

export type Tab = "home" | "search" | "insights"

interface HeaderProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  sidebarCollapsed?: boolean
}

const tabs: { key: Tab; label: string; icon: typeof Home }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "search", label: "Search", icon: Search },
  { key: "insights", label: "Insights", icon: Lightbulb },
]

export default function Header({ activeTab, onTabChange, sidebarCollapsed }: HeaderProps) {
  return (
    <header
      className="fixed top-0 right-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm transition-all duration-300"
      style={{ left: sidebarCollapsed ? "var(--spacing-sidebar-collapsed)" : "var(--spacing-sidebar-width)" }}
    >
      <div className="flex justify-between items-center px-unit-lg h-16 w-full max-w-container-max mx-auto">
        <div className="flex items-center gap-unit-md">
          <div className="md:hidden">
            <span className="material-symbols-outlined text-on-surface">
              menu
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => onTabChange(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-label-md text-label-md transition-all cursor-pointer ${
                  activeTab === key
                    ? "text-primary font-bold bg-primary/10"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
