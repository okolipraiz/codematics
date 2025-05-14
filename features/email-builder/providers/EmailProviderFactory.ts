import { EmailProviderAdapter } from './EmailProviderAdapter';
import { SendGridAdapter } from './SendGridAdapter';
import { MailgunAdapter } from './MailgunAdapter';

interface ProviderConfig {
  [key: string]: any;
}

interface ProviderConfigs {
  sendgrid?: {
    apiKey: string;
    fromEmail: string;
    fromName?: string;
  };
  mailgun?: {
    apiKey: string;
    domain: string;
    fromEmail: string;
    fromName?: string;
    region?: 'us' | 'eu';
  };
  // Add other providers here
}

/**
 * Factory for creating email provider adapters
 */
export class EmailProviderFactory {
  private static providers: Map<string, EmailProviderAdapter> = new Map();
  
  /**
   * Initialize the factory with provider configurations
   */
  static initialize(configs: ProviderConfigs): void {
    // Clear existing providers
    this.providers.clear();
    
    // Create provider instances based on configs
    if (configs.sendgrid) {
      this.providers.set('sendgrid', new SendGridAdapter(configs.sendgrid));
    }
    
    if (configs.mailgun) {
      this.providers.set('mailgun', new MailgunAdapter(configs.mailgun));
    }
    
    // Add more providers as needed
  }
  
  /**
   * Get a provider by name
   */
  static getProvider(name: string): EmailProviderAdapter | undefined {
    return this.providers.get(name);
  }
  
  /**
   * Get all available providers
   */
  static getAllProviders(): EmailProviderAdapter[] {
    return Array.from(this.providers.values());
  }
  
  /**
   * Add a custom provider
   */
  static addProvider(provider: EmailProviderAdapter): void {
    this.providers.set(provider.name, provider);
  }
} 