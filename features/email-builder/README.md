# Email Template Builder

A reusable and extensible email template builder for Next.js applications.

## Features

- Visual drag-and-drop interface for composing email layouts
- Customizable elements (headers, text, images, buttons, dividers, spacers, social links, columns)
- Export to HTML compatible with email clients
- JSON import/export for template sharing and persistence
- Adapter pattern for integrating with multiple email service providers
- Built with React, Redux Toolkit, and TailwindCSS

## Usage

### Basic Usage

```tsx
import { EmailBuilder } from '@/features/email-builder/components/EmailBuilder';

export default function MyPage() {
  const handleSave = (html, templateJson) => {
    // Do something with the generated HTML and template data
    console.log(html, templateJson);
  };

  return (
    <div className="container">
      <EmailBuilder onSave={handleSave} />
    </div>
  );
}
```

### With Provider Integration

```tsx
import { EmailBuilder } from '@/features/email-builder/components/EmailBuilder';
import { EmailProviderFactory } from '@/features/email-builder/providers/EmailProviderFactory';
import { useEffect } from 'react';

export default function MyPage() {
  // Initialize providers
  useEffect(() => {
    EmailProviderFactory.initialize({
      sendgrid: {
        apiKey: process.env.NEXT_PUBLIC_SENDGRID_API_KEY,
        fromEmail: 'example@yourdomain.com',
        fromName: 'Your Company Name'
      },
      // Add other providers as needed
    });
  }, []);

  const handleSave = (html, templateJson) => {
    // Get a specific provider
    const sendgridProvider = EmailProviderFactory.getProvider('sendgrid');
    
    // Save template
    if (sendgridProvider) {
      sendgridProvider.saveTemplate(templateJson)
        .then(savedTemplate => console.log('Template saved:', savedTemplate))
        .catch(err => console.error('Error saving template:', err));
    }
  };

  return (
    <div className="container">
      <EmailBuilder onSave={handleSave} />
    </div>
  );
}
```

## Adding Custom Providers

You can implement your own email provider adapters by extending the `EmailProviderAdapter` class:

```tsx
import { EmailProviderAdapter } from '@/features/email-builder/providers/EmailProviderAdapter';
import { EmailTemplate } from '@/types/emailBuilder';

export class CustomProvider extends EmailProviderAdapter {
  readonly name = 'custom-provider';
  
  constructor(config: any) {
    super();
    // Initialize with your config
  }
  
  async send(template: EmailTemplate, data: Record<string, any>): Promise<any> {
    // Implement sending logic
  }
  
  async getTemplates(): Promise<EmailTemplate[]> {
    // Implement template fetching
  }
  
  async saveTemplate(template: EmailTemplate): Promise<EmailTemplate> {
    // Implement template saving
  }
  
  async deleteTemplate(templateId: string): Promise<void> {
    // Implement template deletion
  }
}

// Register your custom provider
EmailProviderFactory.addProvider(new CustomProvider({
  // Your config
}));
```

## Architecture

The Email Builder follows a modular architecture:

- **Components**: UI components for the builder interface
- **Redux Slice**: State management for templates and elements
- **Providers**: Adapter implementations for email service providers
- **Utils**: Utilities for HTML generation and export
- **Types**: TypeScript types for emails and elements

## License

MIT 