import { EmailTemplate } from '@/types/emailBuilder';

/**
 * Abstract base class for all email provider adapters
 */
export abstract class EmailProviderAdapter {
  /**
   * Provider name/identifier
   */
  abstract readonly name: string;

  /**
   * Send an email using the provided template and data
   */
  abstract send(template: EmailTemplate, data: Record<string, any>): Promise<any>;

  /**
   * Get all templates from the provider
   */
  abstract getTemplates(): Promise<EmailTemplate[]>;

  /**
   * Save a template to the provider
   */
  abstract saveTemplate(template: EmailTemplate): Promise<EmailTemplate>;

  /**
   * Delete a template from the provider
   */
  abstract deleteTemplate(templateId: string): Promise<void>;
} 