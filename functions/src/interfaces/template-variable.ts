export interface TemplateVariable {
    id: string;
    name: string;
    value: string;
    key: string;
  }
  
  export interface TemplateVariableIndex {
    [key: string]: TemplateVariable;
  }
  