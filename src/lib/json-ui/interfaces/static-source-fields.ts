export interface StaticSourceFieldsProps {
  editingSource: DataSource;
  label: string;
  placeholder: string;
  onUpdateField: <K extends keyof DataSource>(field: K, value: DataSource[K]) => void;
};