export interface Paper {
  id: string
  category: string
  categoryType?: "primary" | "secondary" | "tertiary"
  title: string
  abstract: string
  journal?: string
  authors: string
  date: string
  isTrending?: boolean
  pdfLink?: string
  link?: string
}
