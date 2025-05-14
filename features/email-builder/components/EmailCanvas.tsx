import { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { addElement, selectElement } from '../emailBuilderSlice';
import { ElementType } from '@/types/emailBuilder';
// @ts-ignore
import { RenderElement } from './RenderElement';

interface EmailCanvasProps {
  onClick: (e: React.MouseEvent) => void;
  readOnly?: boolean;
}

export const EmailCanvas = ({ onClick, readOnly = false }: EmailCanvasProps) => {
  const dispatch = useDispatch();
  // @ts-ignore
  const { currentTemplate, selectedElementId, isDragging } = useSelector(
    (state: RootState) => state.emailBuilder
  );

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'EMAIL_ELEMENT',
    drop: (item: { type: ElementType }, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }

      // Get initial properties based on element type
      const element: any = getDefaultElementProperties(item.type);
      
      // Add element to the template
      dispatch(addElement({ element }));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
    hover: (item, monitor) => {
      // This helps with visual feedback during dragging
      const clientOffset = monitor.getClientOffset();
      if (clientOffset && monitor.isOver({ shallow: true })) {
        // You could calculate position here if needed for previews
      }
    }
  }), [dispatch]);

  const handleElementClick = useCallback((e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    if (!readOnly) {
      dispatch(selectElement(elementId));
    }
  }, [dispatch, readOnly]);

  const getDefaultElementProperties = (type: ElementType) => {
    switch (type) {
      case 'header':
        return {
          type,
          content: { text: 'New Heading', level: 2 },
          styles: {
            color: '#000000',
            'font-family': 'Arial, sans-serif',
            'font-size': '24px',
            'text-align': 'center',
            'margin-bottom': '20px',
          },
        };
      case 'text':
        return {
          type,
          content: { text: 'Add your text here' },
          styles: {
            color: '#000000',
            'font-family': 'Arial, sans-serif',
            'font-size': '16px',
            'line-height': '1.5',
            'margin-bottom': '20px',
          },
        };
      case 'image':
        return {
          type,
          content: {
            src: 'https://via.placeholder.com/600x200',
            alt: 'Placeholder image',
          },
          styles: {
            width: '100%',
            height: 'auto',
            'margin-bottom': '20px',
          },
        };
      case 'button':
        return {
          type,
          content: {
            text: 'Click Me',
            url: '#',
          },
          styles: {
            'background-color': '#007bff',
            color: '#ffffff',
            padding: '10px 20px',
            'border-radius': '4px',
            'text-align': 'center',
            'font-family': 'Arial, sans-serif',
            'font-size': '16px',
            'text-decoration': 'none',
            'margin-bottom': '20px',
            display: 'block',
            'margin-left': 'auto',
            'margin-right': 'auto',
            width: 'fit-content',
          },
        };
      case 'divider':
        return {
          type,
          content: {},
          styles: {
            'border-top': '1px solid #e5e7eb',
            'margin-top': '20px',
            'margin-bottom': '20px',
            width: '100%',
          },
        };
      case 'spacer':
        return {
          type,
          content: { height: 20 },
          styles: {
            height: '20px',
            width: '100%',
          },
        };
      case 'social':
        return {
          type,
          content: {
            networks: [
              { name: 'Facebook', url: '#', icon: 'facebook' },
              { name: 'Twitter', url: '#', icon: 'twitter' },
              { name: 'Instagram', url: '#', icon: 'instagram' },
            ],
          },
          styles: {
            'text-align': 'center',
            'margin-bottom': '20px',
          },
        };
      case 'columns':
        return {
          type,
          content: {
            columns: [
              { elements: [], width: '50%' },
              { elements: [], width: '50%' },
            ],
          },
          styles: {
            display: 'flex',
            'margin-bottom': '20px',
          },
        };
      default:
        return {
          type,
          content: {},
          styles: {},
        };
    }
  };

  return (
    <div 
      ref={dropRef as any}
      className={`flex-1 p-4 overflow-y-auto bg-gray-100 dark:bg-gray-900 transition-colors ${
        isOver && isDragging ? 'bg-accent/20 border-2 border-dashed border-blue-400' : ''
      }`}
      onClick={onClick}
    >
      <div className="mx-auto max-w-[600px] bg-white dark:bg-gray-800 p-6 min-h-[800px] shadow-md">
        {!currentTemplate || currentTemplate.elements.length === 0 ? (
          <div className="flex items-center justify-center h-[800px] text-center text-muted-foreground">
            {readOnly ? (
              <p>No elements in this template</p>
            ) : (
              <div className="p-8 border-2 border-dashed border-gray-300 rounded">
                <p className="mb-2">Drag and drop elements here</p>
                <p className="text-sm opacity-70">Start building your email template by dragging elements from the sidebar</p>
              </div>
            )}
          </div>
        ) : (
          currentTemplate.elements.map((element: any) => (
            <RenderElement
              key={element.id}
              element={element}
              isSelected={element.id === selectedElementId}
              onClick={(e: React.MouseEvent) => handleElementClick(e, element.id)}
              readOnly={readOnly}
            />
          ))
        )}
      </div>
    </div>
  );
}; 