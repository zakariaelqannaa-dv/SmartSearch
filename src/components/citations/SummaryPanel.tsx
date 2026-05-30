import { Bookmark, BookOpen, ExternalLink } from "lucide-react"
import { Paper } from "@/types/paper"

interface SummaryPanelProps {
  papers: Paper[]
}

export default function SummaryPanel({ papers }: SummaryPanelProps) {
  if (papers.length === 0) {
    return (
      <div className="glass-card rounded-xl p-unit-lg flex flex-col items-center justify-center text-center min-h-[200px]">
        <BookOpen className="text-on-surface-variant mb-3" size={32} />
        <p className="text-label-md text-label-md text-on-surface-variant">
          No papers saved yet.
        </p>
        <p className="text-label-sm text-label-sm text-on-surface-variant/60 mt-1">
          Click the bookmark icon on any paper to save it here.
        </p>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-unit-lg">
      <div className="flex items-center gap-2 mb-4">
        <Bookmark className="text-primary" size={20} />
        <span className="text-label-md text-label-md font-bold text-on-surface">
          Saved Papers ({papers.length})
        </span>
      </div>
      <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
        {papers.map((paper) => (
          <div
            key={paper.id}
            className="p-3 rounded-lg bg-surface-container-high/50 border border-outline-variant/10 hover:border-primary/30 transition-colors group"
          >
            {paper.link ? (
              <a
                href={paper.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-label-sm text-label-sm font-bold text-primary hover:underline line-clamp-1 transition-colors flex items-center gap-1"
              >
                {paper.title}
                <ExternalLink size={12} className="shrink-0 opacity-60" />
              </a>
            ) : (
              <h4 className="text-label-sm text-label-sm font-bold text-on-surface line-clamp-1">
                {paper.title}
              </h4>
            )}
            <p className="text-label-sm text-[10px] text-on-surface-variant mt-1">
              {paper.authors} &bull; {paper.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
