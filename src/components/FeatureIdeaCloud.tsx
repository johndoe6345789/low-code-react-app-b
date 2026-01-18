import { FeatureIdeaCanvas } from './FeatureIdeaCloud/FeatureIdeaCanvas'
import { FeatureIdeaDialogs } from './FeatureIdeaCloud/FeatureIdeaDialogs'
import { useFeatureIdeaCloud } from './FeatureIdeaCloud/useFeatureIdeaCloud'

export function FeatureIdeaCloud() {
  const cloud = useFeatureIdeaCloud()

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-muted/20 to-background">
      <FeatureIdeaCanvas
        nodes={cloud.nodes}
        edges={cloud.edges}
        onNodesChangeWrapper={cloud.onNodesChangeWrapper}
        onEdgesChangeWrapper={cloud.onEdgesChangeWrapper}
        onConnect={cloud.onConnect}
        onReconnect={cloud.onReconnect}
        onReconnectStart={cloud.onReconnectStart}
        onReconnectEnd={cloud.onReconnectEnd}
        onEdgeClick={cloud.onEdgeClick}
        onNodeDoubleClick={cloud.onNodeDoubleClick}
        debugPanelOpen={cloud.debugPanelOpen}
        setDebugPanelOpen={cloud.setDebugPanelOpen}
        handleAddIdea={cloud.handleAddIdea}
        handleAddGroup={cloud.handleAddGroup}
        handleGenerateIdeas={cloud.handleGenerateIdeas}
        safeIdeas={cloud.safeIdeas}
      />

      <FeatureIdeaDialogs
        ideas={cloud.ideas}
        groups={cloud.groups}
        safeIdeas={cloud.safeIdeas}
        safeGroups={cloud.safeGroups}
        edges={cloud.edges}
        selectedIdea={cloud.selectedIdea}
        selectedGroup={cloud.selectedGroup}
        selectedEdge={cloud.selectedEdge}
        editDialogOpen={cloud.editDialogOpen}
        groupDialogOpen={cloud.groupDialogOpen}
        viewDialogOpen={cloud.viewDialogOpen}
        edgeDialogOpen={cloud.edgeDialogOpen}
        setSelectedIdea={cloud.setSelectedIdea}
        setSelectedGroup={cloud.setSelectedGroup}
        setSelectedEdge={cloud.setSelectedEdge}
        setEditDialogOpen={cloud.setEditDialogOpen}
        setGroupDialogOpen={cloud.setGroupDialogOpen}
        setViewDialogOpen={cloud.setViewDialogOpen}
        setEdgeDialogOpen={cloud.setEdgeDialogOpen}
        handleSaveIdea={cloud.handleSaveIdea}
        handleDeleteIdea={cloud.handleDeleteIdea}
        handleSaveGroup={cloud.handleSaveGroup}
        handleDeleteGroup={cloud.handleDeleteGroup}
        handleDeleteEdge={cloud.handleDeleteEdge}
        handleSaveEdge={cloud.handleSaveEdge}
      />
    </div>
  )
}
