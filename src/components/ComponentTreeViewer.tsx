import { useState } from 'react'
import { useComponentTreeLoader } from '@/hooks/use-component-tree-loader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  Cube, 
  TreeStructure, 
  ArrowsClockwise, 
  CheckCircle, 
  Warning,
  Package,
  Stack
} from '@phosphor-icons/react'

export function ComponentTreeViewer() {
  const {
    isLoaded,
    isLoading,
    error,
    moleculeTrees,
    organismTrees,
    allTrees,
    reloadFromJSON,
  } = useComponentTreeLoader()

  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null)

  const handleReload = async () => {
    try {
      await reloadFromJSON()
      toast.success('Component trees reloaded from JSON')
    } catch (err) {
      toast.error('Failed to reload component trees')
    }
  }

  const selectedTree = allTrees.find(tree => tree.id === selectedTreeId)

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <TreeStructure size={24} weight="duotone" className="text-primary" />
          <div>
            <h2 className="text-lg font-semibold">Component Trees</h2>
            <p className="text-sm text-muted-foreground">
              Molecules and organisms loaded from JSON
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isLoaded && (
            <Badge variant="outline" className="gap-1">
              <CheckCircle size={14} weight="fill" className="text-accent" />
              {allTrees.length} trees loaded
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleReload}
            disabled={isLoading}
          >
            <ArrowsClockwise size={16} className={isLoading ? 'animate-spin' : ''} />
            Reload
          </Button>
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
          <Warning size={20} weight="fill" className="text-destructive mt-0.5" />
          <div>
            <p className="font-medium text-destructive">Error loading component trees</p>
            <p className="text-sm text-destructive/80 mt-1">{error.message}</p>
          </div>
        </div>
      )}

      <Tabs defaultValue="molecules" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 grid w-auto grid-cols-3">
          <TabsTrigger value="molecules" className="gap-2">
            <Package size={16} />
            Molecules
            <Badge variant="secondary" className="ml-1">
              {moleculeTrees.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="organisms" className="gap-2">
            <Stack size={16} />
            Organisms
            <Badge variant="secondary" className="ml-1">
              {organismTrees.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2">
            <Cube size={16} />
            All
            <Badge variant="secondary" className="ml-1">
              {allTrees.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="molecules" className="flex-1 mt-4">
          <div className="grid grid-cols-2 gap-4 px-4">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-3 pr-4">
                {moleculeTrees.map(tree => (
                  <Card
                    key={tree.id}
                    className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                      selectedTreeId === tree.id ? 'border-primary' : ''
                    }`}
                    onClick={() => setSelectedTreeId(tree.id)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Package size={18} weight="duotone" className="text-primary" />
                        {tree.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {tree.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{tree.rootNodes.length} root nodes</span>
                        <Separator orientation="vertical" className="h-3" />
                        <span>
                          {new Date(tree.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            <div className="border-l pl-4">
              {selectedTree ? (
                <TreeDetails tree={selectedTree} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <TreeStructure size={48} weight="duotone" className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Select a tree to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="organisms" className="flex-1 mt-4">
          <div className="grid grid-cols-2 gap-4 px-4">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-3 pr-4">
                {organismTrees.map(tree => (
                  <Card
                    key={tree.id}
                    className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                      selectedTreeId === tree.id ? 'border-primary' : ''
                    }`}
                    onClick={() => setSelectedTreeId(tree.id)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Stack size={18} weight="duotone" className="text-primary" />
                        {tree.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {tree.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{tree.rootNodes.length} root nodes</span>
                        <Separator orientation="vertical" className="h-3" />
                        <span>
                          {new Date(tree.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            <div className="border-l pl-4">
              {selectedTree ? (
                <TreeDetails tree={selectedTree} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <TreeStructure size={48} weight="duotone" className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Select a tree to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="all" className="flex-1 mt-4">
          <div className="grid grid-cols-2 gap-4 px-4">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-3 pr-4">
                {allTrees.map(tree => {
                  const category = (tree as any).category
                  return (
                    <Card
                      key={tree.id}
                      className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                        selectedTreeId === tree.id ? 'border-primary' : ''
                      }`}
                      onClick={() => setSelectedTreeId(tree.id)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          {category === 'molecule' ? (
                            <Package size={18} weight="duotone" className="text-primary" />
                          ) : (
                            <Stack size={18} weight="duotone" className="text-primary" />
                          )}
                          {tree.name}
                          <Badge variant="outline" className="ml-auto text-xs">
                            {category}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {tree.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{tree.rootNodes.length} root nodes</span>
                          <Separator orientation="vertical" className="h-3" />
                          <span>
                            {new Date(tree.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>

            <div className="border-l pl-4">
              {selectedTree ? (
                <TreeDetails tree={selectedTree} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <TreeStructure size={48} weight="duotone" className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Select a tree to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TreeDetails({ tree }: { tree: any }) {
  const renderNode = (node: any, depth = 0) => {
    return (
      <div key={node.id} className="space-y-2">
        <div 
          className="p-2 rounded-md bg-muted/40 border text-xs"
          style={{ marginLeft: `${depth * 16}px` }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">{node.name || node.type}</span>
            <Badge variant="secondary" className="text-xs">
              {node.type}
            </Badge>
          </div>
          {node.props && Object.keys(node.props).length > 0 && (
            <div className="text-muted-foreground mt-1">
              Props: {Object.keys(node.props).length}
            </div>
          )}
        </div>
        {node.children && node.children.map((child: any) => renderNode(child, depth + 1))}
      </div>
    )
  }

  return (
    <ScrollArea className="h-[calc(100vh-280px)]">
      <div className="pr-4">
        <div className="mb-4">
          <h3 className="font-semibold mb-2">{tree.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{tree.description}</p>
          <div className="flex gap-2 mb-4">
            <Badge variant="outline">
              {tree.rootNodes.length} root nodes
            </Badge>
            <Badge variant="outline">
              ID: {tree.id}
            </Badge>
          </div>
          <Separator className="my-4" />
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold mb-3">Component Tree Structure</h4>
          {tree.rootNodes.map((node: any) => renderNode(node))}
        </div>
      </div>
    </ScrollArea>
  )
}
