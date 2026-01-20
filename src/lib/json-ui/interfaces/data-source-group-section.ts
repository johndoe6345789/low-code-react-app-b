export interface DataSourceGroupSectionProps {
  icon: ReactNode;
  label: string;
  dataSources: DataSource[];
  getDependents: (id: string) => string[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}