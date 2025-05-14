import { EmailBuilder } from '@/features/email-builder/components/EmailBuilder';
import { EmailProviderFactory } from '@/features/email-builder/providers/EmailProviderFactory';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function EmailBuilderPage() {
  const [html, setHtml] = useState<string>('');
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  
  // Initialize email providers on component mount
  useEffect(() => {
    EmailProviderFactory.initialize({
      sendgrid: {
        apiKey:
          process.env.NEXT_PUBLIC_SENDGRID_API_KEY || "YOUR_SENDGRID_API_KEY",
        fromEmail: "example@yourdomain.com",
        fromName: "Your Name",
      },
      mailgun: {
        apiKey:
          process.env.NEXT_PUBLIC_MAILGUN_API_KEY || "",
        domain: "okolipraiz.com",
        fromEmail: "example@yourdomain.com",
        fromName: "Your Name",
      },
    });
  }, []);


  const handleSave = async (generatedHtml: string, templateJson: any) => {
    setHtml(generatedHtml);
    setIsPreviewOpen(true);

    try {
      const response = await fetch("/api/saveEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: templateJson.name || "New Template",
          template: generatedHtml,
        }),
      });

     const data = await response.json();

     if (!response.ok) {
       toast.error(data.details || data.message || "Failed to save template");
       console.error("Template save error:", data);
       return;
     }

      console.log("Template saved successfully to Mailgun");
      toast.success("Template saved successfully to Mailgun");
    } catch (error: any) {
      toast.error(`${ error?.details}`);
      console.error("Failed to save template:", error);
    }
  };
  
  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Email Template Builder</h1>
        <p className="text-muted-foreground">
          Drag and drop elements to create beautiful email templates
        </p>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <EmailBuilder onSave={handleSave} />
      </div>
      
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[800px] w-full h-[80vh] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
            <DialogDescription>
              This is how your email will look when sent
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto mt-4 border rounded-md">
            <iframe
              srcDoc={html}
              title="Email Preview"
              width="100%"
              height="100%"
              style={{ minHeight: '500px', border: 'none' }}
            />
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsPreviewOpen(false)}>Close Preview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 