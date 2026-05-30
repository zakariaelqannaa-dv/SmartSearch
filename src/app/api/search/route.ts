import { NextRequest, NextResponse } from "next/server"
import { fetchFromArxiv, ArxivFilters } from "@/lib/arxiv"
import { searchWikipedia } from "@/lib/wikipedia"
import { searchCornell } from "@/lib/cornell"

export type SearchSource = "arxiv" | "wikipedia" | "cornell"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") ?? ""
  const source = (searchParams.get("source") ?? "arxiv") as SearchSource

  if (!query.trim()) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    )
  }

  try {
    let papers

    switch (source) {
      case "wikipedia":
        papers = await searchWikipedia(query)
        break
      case "cornell":
        papers = await searchCornell(query)
        break
      default: {
        const filters: ArxivFilters = {}
        const category = searchParams.get("category")
        const sortBy = searchParams.get("sortBy") as ArxivFilters["sortBy"] | null
        const sortOrder = searchParams.get("sortOrder") as ArxivFilters["sortOrder"] | null
        if (category) filters.category = category
        if (sortBy) filters.sortBy = sortBy
        if (sortOrder) filters.sortOrder = sortOrder
        papers = await fetchFromArxiv(query, filters)
      }
    }

    return NextResponse.json({ papers, source })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)

    if (source === "arxiv") {
      if (message.includes("429")) {
        return NextResponse.json(
          { error: "arXiv is rate-limiting requests. Please wait a moment and try again." },
          { status: 429 }
        )
      }
      if (message.includes("abort") || message.includes("timeout")) {
        return NextResponse.json(
          { error: "arXiv is not responding. Try again in a moment." },
          { status: 504 }
        )
      }
    }

    return NextResponse.json(
      { error: `${source} search failed. ${message}` },
      { status: 500 }
    )
  }
}
