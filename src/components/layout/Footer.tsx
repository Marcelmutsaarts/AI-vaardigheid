import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
            <span className="text-sm text-gray-600">
              AI voor Docenten &copy; {new Date().getFullYear()}
            </span>
          </div>

          <nav className="flex items-center space-x-6">
            <Link
              href="/over"
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Over KIES
            </Link>
            <Link
              href="/docent/login"
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Voor docenten
            </Link>
            <Link
              href="https://aivoordocenten.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              aivoordocenten.nl
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
