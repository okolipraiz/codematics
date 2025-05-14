# Codematics - Email Template Builder

A modern email template builder with drag-and-drop functionality, live preview, and integration with popular email service providers.

## 🚀 Features

- Drag-and-drop email builder interface
- Live preview of email templates
- Integration with multiple email providers (Mailgun, SendGrid)
- Responsive email templates
- Component-based architecture
- TypeScript support
- Modern UI with Tailwind CSS and Shadcn
- Light and Dark mode

## 📁 Project Structure

```
codematics/
├── components/
│   └── ui/
│       ├── button.tsx
│       └── dialog.tsx
├── features/
│   └── email-builder/
│       ├── components/
│       │   └── EmailBuilder.tsx
│       └── providers/
│           └── EmailProviderFactory.ts
├── pages/
│   ├── api/
│   │   └── saveEmail.ts
│   └── email-builder.tsx
└── types/
    └── emailBuilder.ts
```

## 💻 Core Components

### EmailBuilder Component
The main component that handles the drag-and-drop functionality and template building:

```typescript
<EmailBuilder onSave={(html, template) => void} />
```

### Email Elements
Supported email elements include:
- Headers (H1-H6)
- Text blocks
- Images
- Buttons
- Dividers
- Spacers
- Social media links
- Column layouts

### Provider Integration
The project supports multiple email service providers through the `EmailProviderFactory`:

```typescript
EmailProviderFactory.initialize({
  mailgun: {
    apiKey: process.env.MAILGUN_PRIVATE_API_KEY,
    domain: "your-domain.com"
  },
});
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

```plaintext
MAILGUN_PRIVATE_API_KEY=your-mailgun-key
MAILGUN_DOMAIN=your-domain.com
```

## 📦 API Endpoints/Custom Server

### POST /api/saveEmail
Saves an email template to the configured provider.

Request body:
```json
{
  "name": "Template Name",
  "template": "<html>...</html>",
  "description": "Optional description"
}
```

## 🏗️ Type Definitions

### EmailTemplate
```typescript
interface EmailTemplate {
  id: string;
  name: string;
  elements: EmailElement[];
  createdAt: string;
  updatedAt: string;
  subject?: string;
  description?: string;
}
```

### EmailElement
```typescript
interface EmailElement {
  id: string;
  type: ElementType;
  content: any;
  styles: Record<string, string>;
}
```

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local which is cloned from the .env.example`

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000/email-builder](http://localhost:3000/email-builder)

## 🛠️ Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- Mailgun.js
- SendGrid API
- React
- shadcn/ui components

## 📝 Development Notes

- All API keys should be kept secure and never committed to version control
- Email templates are saved using the Mailgun Templates API
- The project uses TypeScript for type safety
- UI components are built using shadcn/ui and Tailwind CSS
- The email builder supports responsive design principles

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 🤔 Trade-offs and Limitations

### Current Limitations
- Only supports Mailgun and SendGrid as email providers
- Template versioning is not supported
- No built-in analytics for email performance
- Limited email testing capabilities
- No A/B testing support
- Basic template preview without mobile device simulation
- No automatic responsive image handling

### Technical Trade-offs
1. **Frontend Performance**
   - Using client-side rendering for the builder interface
   - Pros: Better editing experience, real-time preview
   - Cons: Larger initial bundle size

2. **Email Provider Integration**
   - Using provider-specific APIs instead of a unified email API
   - Pros: Direct access to provider features
   - Cons: More maintenance when adding new providers

3. **Template Storage**
   - Storing templates directly with email providers
   - Pros: No additional database needed
   - Cons: Limited template management capabilities

### Future Improvements

#### Near-term Ideas
- [ ] Add template categories and tags
- [ ] Implement template duplication
- [ ] Add mobile preview mode
- [ ] Support more email providers (Amazon SES, PostMark)
- [ ] Add template version history

#### Long-term Vision
1. **Advanced Features**
   - Email performance analytics
   - A/B testing capabilities
   - Dynamic content blocks
   - Personalization tokens
   - Template sharing and collaboration

2. **Technical Enhancements**
   - Server-side image optimization
   - Automated email testing across clients
   - Template validation and accessibility checks
   - Built-in spam score checking
   - Integration with popular CMS platforms

3. **Developer Experience**
   - CLI tool for template management
   - Custom component development kit
   - Better TypeScript type inference
   - Template export/import functionality

4. **Enterprise Features**
   - Team collaboration tools
   - Role-based access control
   - Template approval workflows
   - Brand asset management
   - Custom CSS injection

#### Performance Optimization Ideas
- Implement template caching
- Add lazy loading for builder components
- Optimize preview rendering
- Implement worker threads for heavy operations
- Add service worker for offline capabilities

#### Security Enhancements
- Add rate limiting for API endpoints
- Implement template sanitization
- Add audit logs for template changes
- Enhance API key rotation mechanism

#### Quick Video Demo
- https://www.loom.com/share/35c5b0797509482b9c4f779f8869c50a?sid=a086106e-1600-4fb0-acd1-e310d755e769