import { EmailTemplate, EmailElement } from '@/types/emailBuilder';
// @ts-ignore
import DOMPurify from 'dompurify';

export class EmailExporter {
  /**
   * Generate email-safe HTML from the email template
   */
  static generateHtml(template: EmailTemplate): string {
    const elements = template.elements.map(element => this.renderElementToHtml(element)).join('\n');
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${template.name}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      color: #333333;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      max-width: 100%;
      outline: none;
      text-decoration: none;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    a {
      text-decoration: none;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; width: 100%; background-color: #f7f7f7;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0; padding: 0; background-color: #f7f7f7;">
    <tr>
      <td style="padding: 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 5px; overflow: hidden;">
          <tr>
            <td style="padding: 20px;">
              ${elements}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
  }

  /**
   * Convert a single element to HTML
   */
  private static renderElementToHtml(element: EmailElement): string {
    // Convert style object to inline style string
    const styleString = Object.entries(element.styles)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ');
    
    switch (element.type) {
      case 'header': {
        const level = element.content.level || 2;
        const sanitizedText = DOMPurify.sanitize(element.content.text);
        return `<h${level} style="${styleString}">${sanitizedText}</h${level}>`;
      }
      
      case 'text': {
        const sanitizedText = DOMPurify.sanitize(element.content.text);
        return `<p style="${styleString}">${sanitizedText}</p>`;
      }
      
      case 'image': {
        const sanitizedSrc = DOMPurify.sanitize(element.content.src);
        const sanitizedAlt = DOMPurify.sanitize(element.content.alt);
        
        if (element.content.link) {
          const sanitizedLink = DOMPurify.sanitize(element.content.link);
          return `<a href="${sanitizedLink}"><img src="${sanitizedSrc}" alt="${sanitizedAlt}" style="${styleString}"></a>`;
        }
        
        return `<img src="${sanitizedSrc}" alt="${sanitizedAlt}" style="${styleString}">`;
      }
      
      case 'button': {
        const sanitizedText = DOMPurify.sanitize(element.content.text);
        const sanitizedUrl = DOMPurify.sanitize(element.content.url);
        
        return `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
  <tr>
    <td style="${styleString}">
      <a href="${sanitizedUrl}" style="${styleString}">${sanitizedText}</a>
    </td>
  </tr>
</table>
`;
      }
      
      case 'divider': {
        return `<hr style="${styleString}">`;
      }
      
      case 'spacer': {
        return `<div style="${styleString}">&nbsp;</div>`;
      }
      
      case 'social': {
        const networks = element.content.networks || [];
        const socialLinks = networks.map((network: any) => {
          const sanitizedUrl = DOMPurify.sanitize(network.url);
          const sanitizedName = DOMPurify.sanitize(network.name);
          
          return `<a href="${sanitizedUrl}" style="margin: 0 8px; text-decoration: none; color: #0000ee;">${sanitizedName}</a>`;
        }).join('');
        
        return `<div style="${styleString}">${socialLinks}</div>`;
      }
      
      case 'columns': {
        const columns = element.content.columns || [];
        const columnHtml = columns.map((column: any) => {
          // For simplicity, we're not recursively rendering elements in columns
          // In a real implementation, you would call this.renderElementToHtml for each element
          return `
<td valign="top" style="width: ${column.width}; padding: 0 10px;">
  ${column.elements.length === 0 ? 
    `<div style="padding: 20px; border: 1px dashed #ccc; text-align: center; color: #888;">Empty column</div>` : 
    column.elements.map((el: any) => this.renderElementToHtml(el)).join('\n')
  }
</td>`;
        }).join('');
        
        return `
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="${styleString}">
  <tr>
    ${columnHtml}
  </tr>
</table>
`;
      }
      
      default:
        return '';
    }
  }

  /**
   * Generate plain text version of the email
   */
  static generatePlainText(template: EmailTemplate): string {
    // This would use html-to-text to convert elements to plain text
    // For brevity, we're not implementing this fully
    return `${template.name}\n\nThis is a plain text version of the email.`;
  }
} 