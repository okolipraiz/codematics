import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RootState } from '@/lib/store';
import { updateElement, removeElement } from '../emailBuilderSlice';
import { EmailElement } from '@/types/emailBuilder';

interface PropertiesInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const PropertiesInput = ({ label, value, onChange }: PropertiesInputProps) => (
  <div className="mb-4">
    <Label className="block mb-1">{label}</Label>
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full"
    />
  </div>
);

interface PropertiesPanelProps {
  elementId: string;
}

export const PropertiesPanel = ({ elementId }: PropertiesPanelProps) => {
  const dispatch = useDispatch();
  // @ts-ignore
  const { currentTemplate } = useSelector((state: RootState) => state.emailBuilder);
  const [element, setElement] = useState<EmailElement | null>(null);
  const [activeTab, setActiveTab] = useState('content');
  const [heightValue, setHeightValue] = useState<number>(0);

  useEffect(() => {
    if (currentTemplate) {
      const foundElement = currentTemplate.elements.find((el: any) => el.id === elementId);
      setElement(foundElement || null);
      
      // Initialize height value if this is an image
      if (foundElement && foundElement.type === 'image') {
        // Get height from styles, defaulting to 'auto'
        const currentHeight = foundElement.styles.height;
        if (currentHeight && currentHeight !== 'auto') {
          // Parse numeric value from CSS value (remove 'px', '%', etc.)
          const numericValue = parseInt(currentHeight.replace(/[^0-9]/g, ''));
          setHeightValue(isNaN(numericValue) ? 0 : numericValue);
        } else {
          setHeightValue(0); // Default to auto (0 in our UI)
        }
      }
    }
  }, [currentTemplate, elementId]);

  if (!element) {
    return <div className="w-64 p-4 border-l">No element selected</div>;
  }

  const handleRemoveElement = () => {
    dispatch(removeElement(elementId));
  };

  const handleContentChange = (key: string, value: any) => {
    dispatch(updateElement({
      id: elementId,
      changes: {
        content: {
          ...element.content,
          [key]: value
        }
      }
    }));
  };

  const handleStyleChange = (key: string, value: string) => {
    dispatch(updateElement({
      id: elementId,
      changes: {
        styles: {
          ...element.styles,
          [key]: value
        }
      }
    }));
  };

  const handleImageHeightChange = (value: number) => {
    setHeightValue(value);
    
    if (value === 0) {
      // Set to 'auto' if the slider is at minimum
      handleStyleChange('height', 'auto');
    } else {
      // Otherwise use pixels
      handleStyleChange('height', `${value}px`);
    }
  };

  const handleButtonAlignment = (alignment: string) => {
    // Update multiple properties to ensure proper alignment
    const styleChanges: Record<string, string> = {
      'text-align': alignment,
    };
    
    if (alignment === 'center') {
      styleChanges['margin-left'] = 'auto';
      styleChanges['margin-right'] = 'auto';
      styleChanges['display'] = 'block';
      styleChanges['width'] = 'fit-content';
    } else if (alignment === 'right') {
      styleChanges['margin-left'] = 'auto';
      styleChanges['margin-right'] = '0';
      styleChanges['display'] = 'block';
      styleChanges['width'] = 'fit-content';
    } else if (alignment === 'left') {
      styleChanges['margin-left'] = '0';
      styleChanges['margin-right'] = 'auto';
      styleChanges['display'] = 'block';
      styleChanges['width'] = 'fit-content';
    }
    
    // Apply all style changes in one update
    dispatch(updateElement({
      id: elementId,
      changes: {
        styles: {
          ...element.styles,
          ...styleChanges
        }
      }
    }));
  };

  const renderContentInputs = () => {
    switch (element.type) {
      case 'header':
        return (
          <>
            <PropertiesInput
              label="Text"
              value={element.content.text || ''}
              onChange={(value) => handleContentChange('text', value)}
            />
            <div className="mb-4">
              <Label className="block mb-1">Level</Label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5, 6].map((level) => (
                  <Button
                    key={level}
                    variant={element.content.level === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleContentChange('level', level)}
                  >
                    H{level}
                  </Button>
                ))}
              </div>
            </div>
          </>
        );
      
      case 'text':
        return (
          <div className="mb-4">
            <Label className="block mb-1">Text</Label>
            <textarea
              value={element.content.text || ''}
              onChange={(e) => handleContentChange('text', e.target.value)}
              className="w-full h-32 px-3 py-2 border rounded-md"
            />
          </div>
        );
      
      case 'image':
        return (
          <>
            <PropertiesInput
              label="Image URL"
              value={element.content.src || ''}
              onChange={(value) => handleContentChange('src', value)}
            />
            <PropertiesInput
              label="Alt Text"
              value={element.content.alt || ''}
              onChange={(value) => handleContentChange('alt', value)}
            />
            <PropertiesInput
              label="Link (optional)"
              value={element.content.link || ''}
              onChange={(value) => handleContentChange('link', value)}
            />
            <div className="mb-4">
              <Label className="block mb-1">
                Height {heightValue === 0 ? '(auto)' : `(${heightValue}px)`}
              </Label>
              <input
                type="range"
                min="0"
                max="800"
                step="10"
                value={heightValue}
                onChange={(e) => handleImageHeightChange(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Auto</span>
                <span>800px</span>
              </div>
            </div>
          </>
        );
      
      case 'button':
        return (
          <>
            <PropertiesInput
              label="Button Text"
              value={element.content.text || ''}
              onChange={(value) => handleContentChange('text', value)}
            />
            <PropertiesInput
              label="URL"
              value={element.content.url || ''}
              onChange={(value) => handleContentChange('url', value)}
            />
            <div className="mb-4">
              <Label className="block mb-1">Button Alignment</Label>
              <div className="flex space-x-2">
                {['left', 'center', 'right'].map((align) => (
                  <Button
                    key={align}
                    variant={element.styles['text-align'] === align ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleButtonAlignment(align)}
                  >
                    {align.charAt(0).toUpperCase() + align.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </>
        );
      
      case 'spacer':
        return (
          <div className="mb-4">
            <Label className="block mb-1">Height (px)</Label>
            <Input
              type="number"
              value={element.content.height || 20}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                handleContentChange('height', value);
                handleStyleChange('height', `${value}px`);
              }}
              className="w-full"
            />
          </div>
        );
      
      case 'divider':
        return (
          <p className="text-sm text-muted-foreground">
            Use the style tab to customize the divider.
          </p>
        );
      
      case 'social':
        return (
          <div>
            {element.content.networks && element.content.networks.map((network: any, index: number) => (
              <div key={index} className="mb-4 p-2 border rounded-md">
                <PropertiesInput
                  label="Network Name"
                  value={network.name}
                  onChange={(value) => {
                    const networks = [...element.content.networks];
                    networks[index] = { ...networks[index], name: value };
                    handleContentChange('networks', networks);
                  }}
                />
                <PropertiesInput
                  label="URL"
                  value={network.url}
                  onChange={(value) => {
                    const networks = [...element.content.networks];
                    networks[index] = { ...networks[index], url: value };
                    handleContentChange('networks', networks);
                  }}
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                const networks = [...(element.content.networks || [])];
                networks.push({ name: 'New Network', url: '#', icon: 'link' });
                handleContentChange('networks', networks);
              }}
            >
              Add Network
            </Button>
          </div>
        );
      
      default:
        return <p>No settings available for this element type</p>;
    }
  };

  const renderStyleInputs = () => {
    // Common style properties
    return (
      <>
        {/* Color */}
        {element.type !== 'image' && (
          <PropertiesInput
            label="Text Color"
            value={element.styles.color || '#000000'}
            onChange={(value) => handleStyleChange('color', value)}
          />
        )}

        {/* Font Family */}
        {['header', 'text', 'button'].includes(element.type) && (
          <PropertiesInput
            label="Font Family"
            value={element.styles['font-family'] || 'Arial, sans-serif'}
            onChange={(value) => handleStyleChange('font-family', value)}
          />
        )}

        {/* Font Size */}
        {['header', 'text', 'button'].includes(element.type) && (
          <PropertiesInput
            label="Font Size"
            value={element.styles['font-size'] || '16px'}
            onChange={(value) => handleStyleChange('font-size', value)}
          />
        )}

        {/* Text Align */}
        {['header', 'text', 'social'].includes(element.type) && (
          <div className="mb-4">
            <Label className="block mb-1">Text Align</Label>
            <div className="flex space-x-2">
              {['left', 'center', 'right'].map((align) => (
                <Button
                  key={align}
                  variant={element.styles['text-align'] === align ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStyleChange('text-align', align)}
                >
                  {align.charAt(0).toUpperCase() + align.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Width control for images */}
        {element.type === 'image' && (
          <PropertiesInput
            label="Width"
            value={element.styles.width || '100%'}
            onChange={(value) => handleStyleChange('width', value)}
          />
        )}

        {/* Background Color */}
        {element.type === 'button' && (
          <PropertiesInput
            label="Background Color"
            value={element.styles['background-color'] || '#007bff'}
            onChange={(value) => handleStyleChange('background-color', value)}
          />
        )}

        {/* Margin Bottom */}
        <PropertiesInput
          label="Margin Bottom"
          value={element.styles['margin-bottom'] || '20px'}
          onChange={(value) => handleStyleChange('margin-bottom', value)}
        />

        {/* For dividers */}
        {element.type === 'divider' && (
          <>
            <PropertiesInput
              label="Border Style"
              value={element.styles['border-top'] || '1px solid #e5e7eb'}
              onChange={(value) => handleStyleChange('border-top', value)}
            />
          </>
        )}
      </>
    );
  };

  return (
    <div className="w-64 p-4 border-l overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold capitalize">{element.type}</h2>
        <Button variant="ghost" size="sm" onClick={handleRemoveElement}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
          <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content">
          {renderContentInputs()}
        </TabsContent>
        
        <TabsContent value="style">
          {renderStyleInputs()}
        </TabsContent>
      </Tabs>
    </div>
  );
}; 