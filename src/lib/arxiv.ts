import { Paper } from "@/types/paper"

export interface ArxivFilters {
  category?: string
  sortBy?: "relevance" | "lastUpdatedDate" | "submittedDate"
  sortOrder?: "ascending" | "descending"
}

let lastRequestTime = 0

function sanitizeQuery(q: string): string {
  return q
    .replace(/[\\]/g, " ")
    .replace(/[\x00-\x1f\x7f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
}

async function throttleRequest(): Promise<void> {
  const now = Date.now()
  const elapsed = now - lastRequestTime
  const minGap = 3500
  if (elapsed < minGap) {
    await new Promise((r) => setTimeout(r, minGap - elapsed))
  }
  lastRequestTime = Date.now()
}

function extractPapersFromXml(xml: string): Paper[] {
  const papers: Paper[] = []
  const entryRegex = /<entry\b[^>]*>([\s\S]*?)<\/entry>/gi
  let entryMatch: RegExpExecArray | null

  while ((entryMatch = entryRegex.exec(xml)) !== null) {
    const block = entryMatch[1]

    const id = extractField(block, "id")
    const arxivId = (id.split("/").pop() ?? id).replace(/[<>]/g, "")
    const title = extractField(block, "title").replace(/\s+/g, " ").trim()
    const summary = extractField(block, "summary").replace(/\s+/g, " ").trim()
    const published = extractField(block, "published").slice(0, 10)

    const authorNames: string[] = []
    const authorRegex = /<author\b[^>]*>[\s\S]*?<name[^>]*>([\s\S]*?)<\/name>[\s\S]*?<\/author>/gi
    let am: RegExpExecArray | null
    while ((am = authorRegex.exec(block)) !== null) {
      authorNames.push(am[1].trim())
    }
    const authors = authorNames.join(", ")

    const categoryMatch = /<category\b[^>]*\sterm\s*=\s*"([^"]*)"/i.exec(block)
    const category = categoryMatch ? categoryMatch[1] : ""

    const linkRegex = /<link\b[^>]*href\s*=\s*"([^"]*)"[^>]*/gi
    let pdfLink = ""
    let link = ""
    let lm: RegExpExecArray | null
    while ((lm = linkRegex.exec(block)) !== null) {
      const href = lm[1]
      const fullTag = lm[0]
      if (/title\s*=\s*"pdf"/i.test(fullTag)) {
        pdfLink = href
      } else if (/rel\s*=\s*"alternate"/i.test(fullTag)) {
        link = href
      }
    }

    const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1)
    const primaryCategories = ["Cs", "Math", "Stat"]
    const tertiaryCategories = ["Physics", "Q-Bio", "Q-Fin"]
    let categoryType: "primary" | "secondary" | "tertiary" = "secondary"
    if (primaryCategories.some((c) => category.startsWith(c.toLowerCase()))) {
      categoryType = "primary"
    } else if (tertiaryCategories.some((c) => category.startsWith(c.toLowerCase()))) {
      categoryType = "tertiary"
    }

    papers.push({
      id: arxivId,
      title,
      authors,
      abstract: summary,
      date: published,
      category: categoryLabel,
      categoryType,
      pdfLink: pdfLink || `https://arxiv.org/pdf/${arxivId}.pdf`,
      link: link || `https://arxiv.org/abs/${arxivId}`,
    })
  }

  return papers
}

function extractField(block: string, tag: string): string {
  const m = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i").exec(block)
  return m ? m[1].trim() : ""
}

async function arxivFetch(url: string, signal?: AbortSignal): Promise<Response> {
  await throttleRequest()
  const res = await fetch(url, {
    headers: { Accept: "application/atom+xml", "User-Agent": "SmartSearch/1.0" },
    signal,
  })
  return res
}

function extractPapersFromHtml(html: string): Paper[] {
  const papers: Paper[] = []
  const resultRegex = /<li[^>]*class\s*=\s*"[^"]*\barxiv-result\b[^"]*"([\s\S]*?)<\/li>/gi
  let m: RegExpExecArray | null

  while ((m = resultRegex.exec(html)) !== null) {
    const block = m[1]

    const linkMatch = /<a[^>]*href\s*=\s*"(\/abs\/[^"]+)"[^>]*>/i.exec(block)
    if (!linkMatch) continue
    const linkPath = linkMatch[1]
    const link = `https://arxiv.org${linkPath}`
    const arxivId = linkPath.replace("/abs/", "")

    const titleMatch = /<a[^>]*href\s*=\s*"\/abs\/[^"]*"[^>]*>([\s\S]*?)<\/a>/i.exec(block)
    const title = titleMatch
      ? titleMatch[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
      : arxivId

    const authorsMatch = /<p\s+class\s*=\s*"[^"]*\bauthors\b[^"]*"[\s\S]*?<\/p>/i.exec(block)
    const authors = authorsMatch
      ? authorsMatch[0].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
      : ""

    let abstract = ""
    const abstractSpan = /<span\s+class\s*=\s*"[^"]*\babstract\b[^"]*"[\s\S]*?<\/span>/i.exec(block)
    if (abstractSpan) {
      abstract = abstractSpan[0].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
    }
    if (!abstract) {
      const abstractP = /<p\s+class\s*=\s*"[^"]*\babstract\b[^"]*"[\s\S]*?<\/p>/i.exec(block)
      if (abstractP) {
        abstract = abstractP[0].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
      }
    }

    const dateMatch = /<span\s+class\s*=\s*"[^"]*\bdate\b[^"]*"[\s\S]*?<\/span>/i.exec(block)
    const date = dateMatch ? dateMatch[0].replace(/<[^>]+>/g, "").trim() : ""

    papers.push({
      id: arxivId,
      title,
      authors,
      abstract,
      date,
      category: arxivId.split(".")[0] ?? "",
      categoryType: "secondary",
      link,
      pdfLink: `https://arxiv.org/pdf/${arxivId}`,
    })
  }

  return papers
}

async function fetchFromArxivHtml(query: string): Promise<Paper[]> {
  await throttleRequest()
  const params = new URLSearchParams()
  params.set("query", query)
  params.set("searchtype", "all")
  params.set("start", "0")
  const url = `https://arxiv.org/search/?${params.toString()}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`arXiv HTML search returned ${res.status}`)
    const html = await res.text()
    return extractPapersFromHtml(html)
  } finally {
    clearTimeout(timeout)
  }
}

export async function fetchFromArxiv(query: string, filters?: ArxivFilters): Promise<Paper[]> {
  const cleanQuery = sanitizeQuery(query)

  const params = new URLSearchParams()
  params.set("search_query", `all:${cleanQuery}`)
  params.set("max_results", "15")
  params.set("sortBy", filters?.sortBy ?? "relevance")
  params.set("sortOrder", filters?.sortOrder ?? "descending")
  const url = `https://export.arxiv.org/api/query?${params.toString()}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 12000)

  try {
    const res = await arxivFetch(url, controller.signal)
    if (!res.ok) throw new Error(`arXiv API returned ${res.status}`)
    const xml = await res.text()
    const papers = extractPapersFromXml(xml)
    if (papers.length > 0) return papers
  } catch {
    /* fall through to HTML fallback */
  } finally {
    clearTimeout(timeout)
  }

  return fetchFromArxivHtml(cleanQuery)
}
