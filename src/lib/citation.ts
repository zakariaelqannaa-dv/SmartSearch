import { Paper } from "@/types/paper"

function formatAuthors(authors: string): string {
  const parts = authors.split(", ")
  if (parts.length === 0) return ""

  const formatted = parts.map((author) => {
    const nameParts = author.trim().split(/\s+/)
    if (nameParts.length < 2) return author.trim()
    const last = nameParts[nameParts.length - 1]
    const initials = nameParts
      .slice(0, -1)
      .map((n) => `${n.charAt(0)}.`)
      .join(" ")
    return `${last}, ${initials}`
  })

  if (formatted.length === 1) return formatted[0]
  if (formatted.length === 2) return `${formatted[0]} & ${formatted[1]}`
  return `${formatted[0]} et al.`
}

function formatAuthorsMla(authors: string): string {
  const parts = authors.split(", ")
  if (parts.length === 0) return ""

  const formatted = parts.map((author) => {
    const nameParts = author.trim().split(/\s+/)
    if (nameParts.length < 2) return author.trim()
    const first = nameParts[0]
    const last = nameParts[nameParts.length - 1]
    return `${last}, ${first}`
  })

  if (formatted.length === 1) return formatted[0]
  if (formatted.length === 2) return `${formatted[0]} and ${formatted[1]}`
  return `${formatted[0]}, et al.`
}

function formatAuthorsChicago(authors: string): string {
  const parts = authors.split(", ")
  if (parts.length === 0) return ""

  const formatted = parts.map((author) => {
    const nameParts = author.trim().split(/\s+/)
    if (nameParts.length < 2) return author.trim()
    const first = nameParts[0]
    const last = nameParts[nameParts.length - 1]
    return `${last}, ${first}`
  })

  if (formatted.length === 1) return formatted[0]
  if (formatted.length === 2) return `${formatted[0]} and ${formatted[1]}`
  return `${formatted[0]} et al.`
}

function getYear(published: string): string {
  return published.slice(0, 4)
}

export function formatAPA(paper: Paper): string {
  const author = formatAuthors(paper.authors)
  const year = getYear(paper.date)
  const title = paper.title.endsWith(".")
 ? paper.title
    : `${paper.title}.`
  const source = paper.journal ? `${paper.journal}.` : "arXiv preprint."
  const url = paper.link ?? paper.pdfLink ?? ""

  return `${author} (${year}). ${title} ${source}${url ? ` ${url}` : ""}`
}

export function formatMLA(paper: Paper): string {
  const author = formatAuthorsMla(paper.authors)
  const title = paper.title.endsWith(".")
    ? paper.title
    : `${paper.title}.`
  const source = paper.journal ? `${paper.journal},` : "arXiv,"
  const year = getYear(paper.date)
  const url = paper.link ?? paper.pdfLink ?? ""

  return `${author} "${title}" ${source} ${year}.${url ? ` ${url}.` : ""}`
}

export function formatChicago(paper: Paper): string {
  const author = formatAuthorsChicago(paper.authors)
  const title = paper.title.endsWith(".")
    ? paper.title
    : `${paper.title}.`
  const source = paper.journal ? `${paper.journal}` : "arXiv preprint"
  const year = getYear(paper.date)
  const url = paper.link ?? paper.pdfLink ?? ""

  return `${author} "${title}" ${source} (${year}).${url ? ` ${url}.` : ""}`
}
