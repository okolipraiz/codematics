import { memo } from 'react';
import { EmailElement } from '@/types/emailBuilder';

interface RenderElementProps {
  element: EmailElement;
  isSelected: boolean;
  onClick: (event: React.MouseEvent) => void;
  readOnly?: boolean;
}

export const RenderElement = memo(({ 
  element, 
  isSelected, 
  onClick, 
  readOnly = false 
}: RenderElementProps) => {
  const elementStyles = { 
    ...element.styles,
    ...(isSelected && !readOnly ? { 
      outline: '2px solid #3b82f6', 
      outlineOffset: '2px' 
    } : {})
  };

  const renderElementContent = () => {
    switch (element.type) {
      case 'header':
        const HeadingTag = `h${element.content.level}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag style={elementStyles}>
            {element.content.text}
          </HeadingTag>
        );
      
      case 'text':
        return (
          <p style={elementStyles}>
            {element.content.text}
          </p>
        );
      
      case 'image':
        return (
          <img 
            src={element.content.src} 
            alt={element.content.alt} 
            style={elementStyles} 
          />
        );
      
      case 'button':
        return (
          <a 
            href={element.content.url} 
            style={elementStyles}
            onClick={(e: React.MouseEvent) => {
              if (!readOnly) {
                e.preventDefault();
              }
            }}
          >
            {element.content.text}
          </a>
        );
      
      case 'divider':
        return <hr style={elementStyles} />;
      
      case 'spacer':
        return <div style={elementStyles}></div>;
      
      case 'social':
        return (
          <div style={elementStyles}>
            {element.content.networks && element.content.networks.map((network: {name: string, url: string, icon: string}, index: number) => (
              <a 
                key={index}
                href={network.url}
                style={{
                  margin: '0 8px',
                  textDecoration: 'none',
                  color: '#0000ee',
                }}
                onClick={(e: React.MouseEvent) => {
                  if (!readOnly) {
                    e.preventDefault();
                  }
                }}
              >
                {network.name}
              </a>
            ))}
          </div>
        );
      
      case 'columns':
        return (
          <div style={elementStyles}>
            {element.content.columns && element.content.columns.map((column: {elements: any[], width: string}, index: number) => (
              <div 
                key={index}
                style={{ 
                  flex: column.width ? '0 0 ' + column.width : 1,
                  padding: '0 10px',
                }}
              >
                {/* Columns would need their own nested elements */}
                {column.elements.length === 0 && (
                  <div 
                    style={{ 
                      padding: '20px', 
                      border: '1px dashed #ccc',
                      textAlign: 'center',
                      color: '#888',
                    }}
                  >
                    Empty column
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      
      default:
        return <div>Unknown element type</div>;
    }
  };

  return (
    <div 
      className={`relative transition-all ${!readOnly ? 'cursor-pointer hover:opacity-90' : ''}`}
      onClick={onClick}
    >
      {renderElementContent()}
    </div>
  );
}); 