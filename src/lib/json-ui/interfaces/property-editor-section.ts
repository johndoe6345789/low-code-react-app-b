export interface PropertyEditorSectionProps {
  title: string;
  fields: PropertyEditorFieldDefinition[];
  component: UIComponent;
  onChange: (key: string, value: unknown) => void;
}