import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Save, 
  Download, 
  Upload, 
  Trash2, 
  Copy,
  FileCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RootState } from '@/lib/store';
import { 
  createTemplate, 
  updateTemplate, 
  importTemplate,
  selectTemplate 
} from '../emailBuilderSlice';
// @ts-ignore
import { EmailExporter } from '../utils/EmailExporter';
import { toast } from 'sonner';

interface ToolBarProps {
  readOnly?: boolean;
  onSave?: (html: string, json: any) => void;
}

export const ToolBar = ({ readOnly = false, onSave }: ToolBarProps) => {
  const dispatch = useDispatch();
  // @ts-ignore
  const { currentTemplate } = useSelector((state: RootState) => state.emailBuilder);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportHtml = () => {
    if (!currentTemplate) return;
    
    const html = EmailExporter.generateHtml(currentTemplate);
    
    // If onSave callback provided, use it
    if (onSave) {
      onSave(html, currentTemplate);
      return;
    }
    
    // Otherwise download as a file
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTemplate.name.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    if (!currentTemplate) return;
    
    const json = JSON.stringify(currentTemplate, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTemplate.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const validateEmailTemplate = (template: any): boolean => {
    return (
      template &&
      typeof template === 'object' &&
      typeof template.name === 'string' &&
      Array.isArray(template.elements)
    );
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (event.target?.result) {
          const json = JSON.parse(event.target.result as string);
          
          // Basic validation
          if (!validateEmailTemplate(json)) {
            toast.success("Invalid template format");
            return;
          }
          
          // Import the template
          dispatch(importTemplate(json));
          
          // Select the newly imported template
          // A slight delay ensures the template is in the store
          setTimeout(() => {
            if (json.id) {
              dispatch(selectTemplate(json.id));
              toast.success(`Template "${json.name}" imported successfully`);
            }
          }, 100);
          
          // Clear the input value to allow importing the same file again
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      } catch (error) {
        console.error('Error importing template:', error);
        toast.success("Failed to parse template file");
      }
    };
    reader.onerror = () => {
      toast.success("Error reading file");
    };
    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCreateTemplate = () => {
    if (newTemplateName.trim() === '') return;
    
    dispatch(createTemplate({ name: newTemplateName }));
    setNewTemplateName('');
    setIsCreateDialogOpen(false);
  };

  const handleUpdateTemplateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentTemplate) return;
    
    dispatch(updateTemplate({ name: e.target.value }));
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <Label htmlFor="template-name" className="sr-only">Template name</Label>
        <Input
          id="template-name"
          value={currentTemplate?.name || ''}
          onChange={handleUpdateTemplateName}
          className="max-w-[200px]"
          placeholder="Template Name"
          disabled={readOnly}
        />
        
        {!readOnly && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">New Template</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription>
                  Enter a name for your new template
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="new-template-name">Template Name</Label>
                <Input
                  id="new-template-name"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <DialogFooter>
                <Button onClick={handleCreateTemplate}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {!readOnly && (
          <>
            <Button variant="outline" size="sm" onClick={handleExportJson}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleExportHtml}>
              <FileCode className="h-4 w-4 mr-2" />
              Export HTML
            </Button>
            
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleImportJson}
                style={{ display: 'none' }}
                aria-label="Import JSON template"
              />
              <Button variant="outline" size="sm" onClick={triggerFileInput}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              {/* {importError && (
                <div className="text-xs text-red-500 mt-1">{importError}</div>
              )}
              {importSuccess && (
                <div className="text-xs text-green-500 mt-1">{importSuccess}</div>
              )} */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 