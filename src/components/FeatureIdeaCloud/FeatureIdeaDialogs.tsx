import { Edge } from 'reactflow'
import { FeatureIdea, IdeaEdgeData, IdeaGroup } from './types'
import { EdgeDialog } from './dialogs/EdgeDialog'
import { GroupDialog } from './dialogs/GroupDialog'
import { IdeaEditDialog } from './dialogs/IdeaEditDialog'
import { IdeaViewDialog } from './dialogs/IdeaViewDialog'

type FeatureIdeaDialogsProps = {
  ideas: FeatureIdea[] | null
  groups: IdeaGroup[] | null
  safeIdeas: FeatureIdea[]
  safeGroups: IdeaGroup[]
  edges: Edge<IdeaEdgeData>[]
  selectedIdea: FeatureIdea | null
  selectedGroup: IdeaGroup | null
  selectedEdge: Edge<IdeaEdgeData> | null
  editDialogOpen: boolean
  groupDialogOpen: boolean
  viewDialogOpen: boolean
  edgeDialogOpen: boolean
  setSelectedIdea: (idea: FeatureIdea | null) => void
  setSelectedGroup: (group: IdeaGroup | null) => void
  setSelectedEdge: (edge: Edge<IdeaEdgeData> | null) => void
  setEditDialogOpen: (open: boolean) => void
  setGroupDialogOpen: (open: boolean) => void
  setViewDialogOpen: (open: boolean) => void
  setEdgeDialogOpen: (open: boolean) => void
  handleSaveIdea: () => void
  handleDeleteIdea: (id: string) => void
  handleSaveGroup: () => void
  handleDeleteGroup: (id: string) => void
  handleDeleteEdge: (edgeId: string) => void
  handleSaveEdge: () => void
}

export const FeatureIdeaDialogs = ({
  ideas,
  groups,
  safeIdeas,
  safeGroups,
  edges,
  selectedIdea,
  selectedGroup,
  selectedEdge,
  editDialogOpen,
  groupDialogOpen,
  viewDialogOpen,
  edgeDialogOpen,
  setSelectedIdea,
  setSelectedGroup,
  setSelectedEdge,
  setEditDialogOpen,
  setGroupDialogOpen,
  setViewDialogOpen,
  setEdgeDialogOpen,
  handleSaveIdea,
  handleDeleteIdea,
  handleSaveGroup,
  handleDeleteGroup,
  handleDeleteEdge,
  handleSaveEdge,
}: FeatureIdeaDialogsProps) => (
  <>
    <GroupDialog
      open={groupDialogOpen}
      onOpenChange={setGroupDialogOpen}
      selectedGroup={selectedGroup}
      groups={groups}
      setSelectedGroup={setSelectedGroup}
      onSave={handleSaveGroup}
      onDelete={handleDeleteGroup}
    />

    <IdeaEditDialog
      open={editDialogOpen}
      onOpenChange={setEditDialogOpen}
      selectedIdea={selectedIdea}
      ideas={ideas}
      safeGroups={safeGroups}
      setSelectedIdea={setSelectedIdea}
      onSave={handleSaveIdea}
      onDelete={handleDeleteIdea}
    />

    <IdeaViewDialog
      open={viewDialogOpen}
      onOpenChange={setViewDialogOpen}
      selectedIdea={selectedIdea}
      safeGroups={safeGroups}
      safeIdeas={safeIdeas}
      edges={edges}
      onEdit={() => {
        setViewDialogOpen(false)
        setEditDialogOpen(true)
      }}
    />

    <EdgeDialog
      open={edgeDialogOpen}
      onOpenChange={setEdgeDialogOpen}
      selectedEdge={selectedEdge}
      safeIdeas={safeIdeas}
      setSelectedEdge={setSelectedEdge}
      onDelete={handleDeleteEdge}
      onSave={handleSaveEdge}
    />
  </>
)
