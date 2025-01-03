export enum FieldType {
  Slider = "slider",
  Text = "text",
  Number = "number",
  Select = "select",
  Boolean = "boolean",
}

export interface Field {
  name: string;
  label: string;
  scale?: number;
  options?: { label: string; value: string }[];
  type: FieldType;
  step?: number;
  full?:boolean;
  reverse?:boolean;
}

export interface Section {
  label: string;
  className?: string;
  fields: Field[];
}

export interface TabItem {
  label: string;
  sections: Section[];
}

export interface InputProps {
  name: string;
  placeholder?: string;
  label?: string;
  type?: FieldType;
  isRequired?: boolean;
  scale?: number;
  options?: { label: string; value: string }[];
  step?: number;
  className?: string;
  reverse?:boolean;
}
