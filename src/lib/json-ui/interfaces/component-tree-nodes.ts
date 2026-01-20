export interface ComponentTreeNodesProps {
  components: UIComponent[];
  depth?: number;
  expandedIds: Set<string>;
  selectedId: string | null;
  hoveredId: string | null;
  draggedOverId: string | null;
  dropPosition: 'before' | 'after' | 'inside' | null;
  onSelect: (id: string) => void;
  onHover: (id: string) => void;
  onHoverEnd: () => void;
  onDragStart: (id: string, e: React.DragEvent) => void;
  onDragOver: (id: string, e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (id: string, e: React.DragEvent) => void;
  onToggleExpand: (id: string) => void;
}