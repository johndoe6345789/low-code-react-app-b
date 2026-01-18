import { ComponentRenderer } from '@/lib/json-ui/component-renderer'
import treeCardDefinition from './definitions/tree-card.json'
import { ComponentTree } from '@/types/project'

interface TreeCardWrapperProps {
  tree: ComponentTree
  isSelected: boolean
  onSelect: () => void
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
  disableDelete?: boolean
}

export function TreeCardWrapper(props: TreeCardWrapperProps) {
  return (
    <div onClick={props.onSelect}>
      <ComponentRenderer
        component={treeCardDefinition}
        data={{
          tree: props.tree,
          isSelected: props.isSelected
        }}
        context={{}}
      />
      <div className="flex gap-xs mt-2" onClick={(e) => e.stopPropagation()}>
        <button onClick={props.onEdit} className="px-2 py-1 text-xs hover:bg-muted rounded">Edit</button>
        <button onClick={props.onDuplicate} className="px-2 py-1 text-xs hover:bg-muted rounded">Duplicate</button>
        <button onClick={props.onDelete} disabled={props.disableDelete} className="px-2 py-1 text-xs hover:bg-muted rounded disabled:opacity-50">Delete</button>
      </div>
    </div>
  )
}
