"use client"

import { useState, useEffect } from "react"

// Simple UI Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>{children}</div>
)

const Button = ({ children, className = "", type = "button", onClick }) => (
  <button type={type} onClick={onClick} className={`px-4 py-2 rounded-md font-medium transition-colors ${className}`}>
    {children}
  </button>
)

const Input = ({ className = "", ...props }) => (
  <input className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${className}`} {...props} />
)

const stripHtmlTags = (text) => {
  if (!text) return ""
  try {
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = text
    return tempDiv.textContent || tempDiv.innerText || ""
  } catch (error) {
    // Simple fallback without any regex
    let result = text
    while (result.includes("<") && result.includes(">")) {
      const start = result.indexOf("<")
      const end = result.indexOf(">", start)
      if (end > start) {
        result = result.substring(0, start) + result.substring(end + 1)
      } else {
        break
      }
    }
    return result
  }
}

function App() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("world")

  const API_KEY = "367ea638-f55e-439b-9ef8-cf62e668916f"

  const categories = [
    { id: "world", name: "World" },
    { id: "technology", name: "Technology" },
    { id: "business", name: "Business" },
    { id: "sport", name: "Sports" },
    { id: "culture", name: "Culture" },
    { id: "science", name: "Science" },
  ]

  const fetchNews = async (searchQuery = "", selectedCategory = "world") => {
    setLoading(true)
    try {
      let url = `https://content.guardianapis.com/search?api-key=${API_KEY}&show-fields=thumbnail,trailText&page-size=20`

      if (searchQuery) {
        url += `&q=${encodeURIComponent(searchQuery)}`
      } else {
        url += `&section=${selectedCategory}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (data.response && data.response.results) {
        setArticles(data.response.results)
      }
    } catch (error) {
      console.error("Error fetching news:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews("", category)
  }, [category])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      fetchNews(searchTerm)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-normal text-gray-900">
                <span className="text-blue-500">W</span>
                <span className="text-red-500">o</span>
                <span className="text-yellow-500">r</span>
                <span className="text-blue-500">k</span>
                <span className="text-green-500">p</span>
                <span className="text-red-500">l</span>
                <span className="text-red-500">a</span>
                <span className="text-yellow-500">c</span>
                <span className="text-blue-500">e</span>
                <span className="ml-2 text-gray-700">News</span>
              </h1>
              <nav className="hidden md:flex space-x-6">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`text-sm font-medium transition-colors ${
                      category === cat.id
                        ? "text-blue-600 border-b-2 border-blue-600 pb-4"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </nav>
            </div>

            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Search
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="md:hidden bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-4 py-3 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  category === cat.id ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                {article.fields?.thumbnail && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={article.fields.thumbnail || "https://via.placeholder.com/400x200"}
                      alt={article.webTitle}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {article.sectionName}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(article.webPublicationDate)}</span>
                  </div>

                  <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                    <a href={article.webUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {article.webTitle}
                    </a>
                  </h2>

                  {article.fields?.trailText && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">{stripHtmlTags(article.fields.trailText)}</p>
                  )}

                  <a
                    href={article.webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Read more
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        )}
        {articles.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles found. Try a different search term or category.</p>
          </div>
        )}
      </main>
      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p className="mt-2">© 2025 Workplace News</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
