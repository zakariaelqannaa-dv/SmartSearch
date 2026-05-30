import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "SmartSearch - Research Dashboard",
  description:
    "Search academic papers, generate citations, and manage your research.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark h-screen w-screen overflow-hidden">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        <link rel="icon" href="/icon.png" type="image/png" />
      </head>
      <body className={`${inter.variable} font-sans bg-background text-on-background min-h-screen overflow-hidden`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
