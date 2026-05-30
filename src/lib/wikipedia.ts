import { Paper } from "@/types/paper"

interface WikipediaSearchResult {
  title: string
  pageid: number
  snippet: string
}

interface WikipediaPageSummary {
  title: string
  extract: string
  pageid: number
  timestamp: string
}

export async function searchWikipedia(query: string): Promise<Paper[]> {
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&srlimit=15&origin=*`

  const searchRes = await fetch(searchUrl, {
    headers: { "User-Agent": "SmartSearch/1.0" },
  })

  if (!searchRes.ok) throw new Error(`Wikipedia search returned ${searchRes.status}`)

  const searchData = await searchRes.json()
  const results: WikipediaSearchResult[] = searchData?.query?.search ?? []

  if (results.length === 0) return []

  const papers: Paper[] = []

  for (const result of results.slice(0, 15)) {
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(result.title)}`

    try {
      const summaryRes = await fetch(summaryUrl, {
        headers: { "User-Agent": "SmartSearch/1.0" },
      })

      if (!summaryRes.ok) continue

      const summary: WikipediaPageSummary = await summaryRes.json()

      papers.push({
        id: `wiki-${result.pageid}`,
        title: summary.title,
        authors: "Wikipedia",
        abstract: summary.extract?.slice(0, 500) ?? result.snippet.replace(/<[^>]+>/g, ""),
        date: summary.timestamp?.slice(0, 10) ?? "",
        category: "Wikipedia",
        categoryType: "tertiary",
        link: `https://en.wikipedia.org/wiki/${encodeURIComponent(summary.title.replace(/ /g, "_"))}`,
      })
    } catch {
      const title = result.title
      papers.push({
        id: `wiki-${result.pageid}`,
        title,
        authors: "Wikipedia",
        abstract: result.snippet.replace(/<[^>]+>/g, ""),
        date: "",
        category: "Wikipedia",
        categoryType: "tertiary",
        link: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`,
      })
    }
  }

  return papers
}
