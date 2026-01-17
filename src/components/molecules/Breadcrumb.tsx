import { Link } from 'react-router-dom'
import { CaretRight, House, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useNavigationHistory } from '@/hooks/use-navigation-history'
import { getPageById } from '@/config/page-loader'
import { Flex, IconWrapper } from '@/components/atoms'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function Breadcrumb() {
  const { history, clearHistory } = useNavigationHistory()

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
    <nav aria-label="Breadcrumb" className="overflow-x-auto">
      <Flex align="center" gap="xs" className="text-sm">
        <Link
          to="/"
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-md transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            history[0]?.path === '/' ? "text-foreground font-medium" : "text-muted-foreground"
          )}
          aria-label="Home"
        >
          <IconWrapper 
            icon={<House size={16} weight="duotone" />} 
            size="sm"
            variant={history[0]?.path === '/' ? 'default' : 'muted'}
          />
        </Link>

        {previousPages.length > 0 && (
          <>
            <CaretRight size={14} className="text-muted-foreground shrink-0" />
            <Flex align="center" gap="xs">
              {previousPages.map((item, index) => (
                <Flex key={item.path} align="center" gap="xs">
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
                </Flex>
              ))}
            </Flex>
          </>
        )}

        {currentPage.path !== '/' && (
          <>
            <CaretRight size={14} className="text-muted-foreground shrink-0" />
            <span
              className={cn(
                "px-2 py-1 rounded-md font-medium text-foreground bg-accent/50 text-sm",
                "max-w-[150px] truncate"
              )}
              title={getPageTitle(currentPage.path)}
            >
              {getPageTitle(currentPage.path)}
            </span>
          </>
        )}

        {history.length > 1 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 ml-2 shrink-0"
                  onClick={clearHistory}
                  aria-label="Clear navigation history"
                >
                  <X size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear history</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </Flex>
    </nav>
  )
}
