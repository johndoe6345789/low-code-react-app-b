import { Link } from 'react-router-dom'
import { CaretRight, House } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useNavigationHistory } from '@/hooks/use-navigation-history'
import { getPageById } from '@/config/page-loader'

export function Breadcrumb() {
  const { history } = useNavigationHistory()

  if (history.length === 0) {
    return null
  }

  const getPageTitle = (path: string) => {
    const pathSegments = path.split('/').filter(Boolean)
    const pageId = pathSegments[0]
    
    if (!pageId || path === '/') {
      return 'Dashboard'
    }

    const pageConfig = getPageById(pageId)
    return pageConfig?.title || pageId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const currentPage = history[0]
  const previousPages = history.slice(1, 4)

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm overflow-x-auto">
      <Link
        to="/"
        className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-md transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          history[0]?.path === '/' ? "text-foreground font-medium" : "text-muted-foreground"
        )}
        aria-label="Home"
      >
        <House className="shrink-0" size={16} weight="duotone" />
      </Link>

      {previousPages.length > 0 && (
        <>
          <CaretRight size={14} className="text-muted-foreground shrink-0" />
          <div className="flex items-center gap-1">
            {previousPages.map((item, index) => (
              <div key={item.path} className="flex items-center gap-1">
                <Link
                  to={item.path}
                  className={cn(
                    "px-2 py-1 rounded-md transition-colors text-muted-foreground",
                    "hover:bg-accent hover:text-accent-foreground",
                    "max-w-[120px] truncate"
                  )}
                  title={getPageTitle(item.path)}
                >
                  {getPageTitle(item.path)}
                </Link>
                {index < previousPages.length - 1 && (
                  <CaretRight size={14} className="text-muted-foreground shrink-0" />
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {currentPage.path !== '/' && (
        <>
          <CaretRight size={14} className="text-muted-foreground shrink-0" />
          <span
            className={cn(
              "px-2 py-1 rounded-md font-medium text-foreground bg-accent/50",
              "max-w-[150px] truncate"
            )}
            title={getPageTitle(currentPage.path)}
          >
            {getPageTitle(currentPage.path)}
          </span>
        </>
      )}
    </nav>
  )
}
