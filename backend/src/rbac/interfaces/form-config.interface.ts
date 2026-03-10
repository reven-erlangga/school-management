export type FormType = 'modal' | 'page' | 'direct';
export type FormStyle = 'form' | 'step';

export type FieldType =
  | 'textfield'
  | 'textarea'
  | 'dropdown'
  | 'checkbox'
  | 'radiobutton'
  | 'date'
  | 'file';

export type FeedbackType =
  | 'success logo'
  | 'error logo'
  | 'alert notification'
  | 'toast message';

export interface FormValidation {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  errorMessage?: string;
}

export interface FormOption {
  label: string;
  value: any;
}

export interface FormContent {
  type: FieldType;
  label?: string;
  placeholder?: string;
  error?: string;
  validation?: FormValidation;
  options?: FormOption[];
  step?: string; // To group fields into steps
  default?: any;
  showIf?: { field: string; value: any };
  column?: 1 | 2 | 3 | 4; // Responsive columns (grid-span)
}

export interface FormCondition {
  status?: 'success' | 'error' | 'warning';
  showAfter?: number;
  feedbackType?: FeedbackType;
  message?: string;
}

export interface FormConfig {
  type: FormType;
  style: FormStyle;
  title?: string;
  subtitle?: string;
  content?: FormContent[];
  condition?: FormCondition;
}

export interface ModuleMeta {
  filter?: any[];
  chart?: any[];
  form?: FormConfig;
  detailConfig?: {
    tabs: { id: string; label: string; icon?: string }[];
    overview: {
      cards: { id: string; label: string; icon: string; color: string }[];
      sections: { title: string; fields: { label: string; key: string }[] }[];
    };
  };
}
