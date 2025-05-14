export interface EmailTemplate {
  id: string;
  name: string;
  elements: EmailElement[];
  createdAt: string;
  updatedAt: string;
  subject?: string;
  description?: string;
}

export type ElementType = 
  | 'header'
  | 'text'
  | 'image'
  | 'button'
  | 'divider'
  | 'spacer'
  | 'social'
  | 'columns';

export interface EmailElement {
  id: string;
  type: ElementType;
  content: any;
  styles: Record<string, string>;
}

export interface HeaderElement extends EmailElement {
  type: 'header';
  content: {
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
  };
}

export interface TextElement extends EmailElement {
  type: 'text';
  content: {
    text: string;
  };
}

export interface ImageElement extends EmailElement {
  type: 'image';
  content: {
    src: string;
    alt: string;
    link?: string;
  };
}

export interface ButtonElement extends EmailElement {
  type: 'button';
  content: {
    text: string;
    url: string;
  };
}

export interface DividerElement extends EmailElement {
  type: 'divider';
  content: {};
}

export interface SpacerElement extends EmailElement {
  type: 'spacer';
  content: {
    height: number;
  };
}

export interface SocialElement extends EmailElement {
  type: 'social';
  content: {
    networks: Array<{
      name: string;
      url: string;
      icon: string;
    }>;
  };
}

export interface ColumnsElement extends EmailElement {
  type: 'columns';
  content: {
    columns: Array<{
      elements: EmailElement[];
      width: string;
    }>;
  };
}

export interface EmailProvider {
  name: string;
  send: (template: EmailTemplate, data: any) => Promise<any>;
  getTemplates: () => Promise<EmailTemplate[]>;
  saveTemplate: (template: EmailTemplate) => Promise<EmailTemplate>;
  deleteTemplate: (templateId: string) => Promise<void>;
}

export interface EmailBuilderConfig {
  providers: EmailProvider[];
  defaultProvider?: string;
} 