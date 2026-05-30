"use client"

import { Bookmark, Quote, BookmarkCheck, Check, ExternalLink, FileText } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Paper } from "@/types/paper"
import { formatAPA, formatMLA, formatChicago } from "@/lib/citation"

interface PaperCardProps {
  paper: Paper
  isSaved: boolean
  onSaveToggle: (paper: Paper) => void
  variant?: "default" | "trending"
}

export default function PaperCard({
  paper,
  isSaved,
  onSaveToggle,
  variant = "default",
}: PaperCardProps) {
  const [mounted, setMounted] = useState(false)
  const [citeOpen, setCiteOpen] = useState(false)
  const [citePos, setCitePos] = useState<{ top: number; left: number } | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const citeBtnRef = useRef<HTMLButtonElement>(null)
  const citeDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  const openCite = () => {
    if (citeBtnRef.current) {
      const rect = citeBtnRef.current.getBoundingClientRect()
      const dropdownW = 320
      const dropdownH = 280
      let top = rect.top - dropdownH - 8
      let left = Math.max(8, rect.right - dropdownW)

      if (top < 8) {
        top = rect.bottom + 8
      }
      if (left + dropdownW > window.innerWidth - 8) {
        left = window.innerWidth - dropdownW - 8
      }

      setCitePos({ top, left })
      setCiteOpen(true)
    }
  }

  useEffect(() => {
    if (!citeOpen) return
    citeDropdownRef.current?.focus()
    const handle = (e: MouseEvent) => {
      if (
        citeDropdownRef.current && !citeDropdownRef.current.contains(e.target as Node) &&
        citeBtnRef.current && !citeBtnRef.current.contains(e.target as Node)
      ) setCiteOpen(false)
    }
    const onResize = () => setCiteOpen(false)
    document.addEventListener("mousedown", handle)
    window.addEventListener("resize", onResize)
    return () => {
      document.removeEventListener("mousedown", handle)
      window.removeEventListener("resize", onResize)
    }
  }, [citeOpen])

  const handleCopy = async (label: string, text: string) => {
    await copyToClipboard(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  const typeColors: Record<string, string> = {
    primary: "bg-primary-container/20 text-primary border-primary/20",
    secondary: "bg-secondary-container/20 text-secondary border-secondary/20",
    tertiary: "bg-tertiary-container/20 text-tertiary border-tertiary/20",
  }

  const badgeClass =
    typeColors[paper.categoryType ?? ""] ??
    "bg-primary-container/20 text-primary border-primary/20"

  const citations = [
    { label: "APA", format: () => formatAPA(paper) },
    { label: "MLA", format: () => formatMLA(paper) },
    { label: "Chicago", format: () => formatChicago(paper) },
  ]

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
    }
  }

  return (
    <>
    <div
      className={`glass-card rounded-xl p-unit-lg flex flex-col group hover:shadow-2xl hover:shadow-primary/5 transition-all relative ${variant === "trending" ? "" : ""}`}
    >
      {variant === "trending" && (
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-br from-primary/30 to-transparent" />
      )}

      <div className="flex justify-between items-start mb-3 relative z-10">
        <span
          className={`text-label-sm text-label-sm px-2 py-1 rounded ${badgeClass} border`}
        >
          {paper.category}
        </span>
        <button
          onClick={() => onSaveToggle(paper)}
          className={`transition-colors cursor-pointer ${
            isSaved ? "text-primary" : "text-on-surface-variant hover:text-primary"
          }`}
        >
          {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
        </button>
      </div>

      {paper.link ? (
        <a
          href={paper.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-headline-md text-headline-md font-bold mb-3 transition-colors relative z-10 block text-primary hover:underline"
        >
          {paper.title}
        </a>
      ) : (
        <h3 className="text-headline-md text-headline-md font-bold mb-3 text-on-surface relative z-10">
          {paper.title}
        </h3>
      )}

      {variant === "trending" ? (
        <div className="h-32 mb-unit-lg rounded-lg overflow-hidden relative z-10 bg-surface-container-high flex items-center justify-center text-on-surface-variant text-label-md">
          Neural Link Visualization
        </div>
      ) : (
        <p className="text-body-md text-body-md text-on-surface-variant line-clamp-3 mb-unit-lg relative z-10">
          {paper.abstract}
        </p>
      )}

      {(paper.link || paper.pdfLink) && (
        <div className="mb-3 relative z-10 flex items-center gap-4">
          {paper.link && (
            <a
              href={paper.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-label-sm text-primary hover:underline flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink size={14} />
              arXiv
            </a>
          )}
          {paper.pdfLink && (
            <a
              href={paper.pdfLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-label-sm text-primary hover:underline flex items-center gap-1.5 transition-colors"
            >
              <FileText size={14} />
              PDF
            </a>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between relative z-10">
        <div className="flex flex-col">
          {paper.journal && (
            <span className="text-label-md text-label-md text-on-surface">
              {paper.journal}
            </span>
          )}
          <span className="text-label-sm text-label-sm text-on-surface-variant line-clamp-1">
            {paper.authors} &bull; {paper.date}
          </span>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <button
              ref={citeBtnRef}
              onClick={openCite}
              className="bg-surface-container-highest hover:bg-primary hover:text-on-primary text-on-surface text-label-md text-label-md px-3 py-2 rounded-lg transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <Quote size={14} />
              Cite
            </button>
          </div>
          <button
            onClick={() => onSaveToggle(paper)}
            className={`px-4 py-2 rounded-lg transition-all active:scale-95 text-label-md text-label-md font-bold cursor-pointer ${
              isSaved
                ? "bg-primary text-on-primary"
                : "bg-surface-container-highest hover:bg-primary hover:text-on-primary text-on-surface"
            }`}
          >
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>

    {mounted && citeOpen && citePos && createPortal(
      <div
        ref={citeDropdownRef}
        tabIndex={-1}
        className="cite-dropdown fixed z-[100] w-80 bg-surface-container-high border border-outline-variant/30 rounded-xl p-4 shadow-2xl outline-none"
        style={{ top: citePos.top, left: citePos.left }}
      >
        <div className="space-y-4">
          {citations.map(({ label, format }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-label-sm text-label-sm font-bold text-on-surface">
                  {label}
                </span>
                <button
                  onClick={() => handleCopy(label, format())}
                  className="text-label-sm text-label-sm text-primary hover:text-primary-fixed-dim transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copied === label ? (
                    <><Check size={14} className="text-success" /> Copied</>
                  ) : (
                    "Copy"
                  )}
                </button>
              </div>
              <p className="text-label-sm text-label-sm text-on-surface-variant leading-relaxed bg-surface-container/50 p-2.5 rounded-lg">
                {format()}
              </p>
            </div>
          ))}
        </div>
      </div>,
      document.body
    )}
    </>
  )
}
