interface DataSourceManagerHeaderCopy {
  title: string;
  description: string;
  addLabel: string;
  menu: {
    kv: string;
    static: string;
  };
}

interface DataSourceManagerHeaderProps {
  copy: DataSourceManagerHeaderCopy;
  onAdd: (type: DataSourceType) => void;
}