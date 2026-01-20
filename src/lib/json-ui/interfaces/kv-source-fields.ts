export interface KvSourceFieldsProps {
  editingSource: DataSource;
  copy: KvSourceFieldsCopy;
  onUpdateField: <K extends keyof DataSource>(field: K, value: DataSource[K]) => void;
}