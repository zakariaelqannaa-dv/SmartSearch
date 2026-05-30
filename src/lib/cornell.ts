import { Paper } from "@/types/paper"

export async function searchCornell(query: string): Promise<Paper[]> {
  const url = `https://news.cornell.edu/search-results?query=${encodeURIComponent(query)}`

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "text/html",
    },
  })

  if (!res.ok) throw new Error(`Cornell search returned ${res.status}`)

  const html = await res.text()
  return extractCornellPapers(html)
}

function extractCornellPapers(html: string): Paper[] {
  const papers: Paper[] = []
  const resultRegex = /<article[\s\S]*?<\/article>/gi
  let m: RegExpExecArray | null

  while ((m = resultRegex.exec(html)) !== null) {
    const block = m[0]

    const linkMatch = /<a[^>]*href\s*=\s*"([^"]*)"[^>]*>([\s\S]*?)<\/a>/i.exec(block)
    if (!linkMatch) continue

    const href = linkMatch[1]
    const fullLink = href.startsWith("http") ? href : `https://news.cornell.edu${href}`
    const title = linkMatch[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()

    if (!title || !fullLink.includes("cornell.edu")) continue

    const dateMatch = /<time[\s\S]*?datetime\s*=\s*"([^"]*)"/i.exec(block)
    const date = dateMatch ? dateMatch[1].slice(0, 10) : ""

    const textContent = block.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
    const abstract = textContent.replace(title, "").slice(0, 300).trim()

    papers.push({
      id: `cornell-${fullLink.split("/").pop() ?? title}`,
      title,
      authors: "Cornell University",
      abstract,
      date,
      category: "Cornell",
      categoryType: "tertiary",
      link: fullLink,
    })
  }

  if (papers.length === 0) {
    const genericLinks: { title: string; href: string }[] = []
    const linkRegex = /<a[^>]*href\s*=\s*"([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi
    let lm: RegExpExecArray | null
    while ((lm = linkRegex.exec(html)) !== null) {
      const href = lm[1]
      const title = lm[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
      if (
        title &&
        title.length > 20 &&
        href.includes("cornell.edu") &&
        !href.includes("#") &&
            genericLinks.length < 15
      ) {
        genericLinks.push({ title, href: href.startsWith("http") ? href : `https://news.cornell.edu${href}` })
      }
    }

    for (const link of genericLinks.slice(0, 15)) {
      papers.push({
        id: `cornell-${link.href.split("/").pop() ?? link.title}`,
        title: link.title,
        authors: "Cornell University",
        abstract: "",
        date: "",
        category: "Cornell",
        categoryType: "tertiary",
        link: link.href,
      })
    }
  }

  return papers
}
