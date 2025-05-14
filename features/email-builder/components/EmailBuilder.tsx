import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { RootState } from '@/lib/store';
import { 
  createTemplate, 
  selectElement, 
  setDragging 
} from '../emailBuilderSlice';
import { ElementsSidebar } from './ElementsSidebar';
import { EmailCanvas } from './EmailCanvas';
import { PropertiesPanel } from './PropertiesPanel';
import { ToolBar } from './ToolBar';

interface EmailBuilderProps {
  initialTemplateId?: string;
  onSave?: (html: string, json: any) => void;
  readOnly?: boolean;
}

export const EmailBuilder = ({ 
  initialTemplateId,
  onSave,
  readOnly = false
}: EmailBuilderProps) => {
  const dispatch = useDispatch();
  const { currentTemplate, selectedElementId } = useSelector((state: RootState) => state.emailBuilder);

  useEffect(() => {
    // Create a default template if none exists
    if (!currentTemplate) {
      dispatch(createTemplate({ name: 'New Template' }));
    }
  }, [dispatch, currentTemplate]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    // Deselect when clicking on the canvas background
    if (e.target === e.currentTarget) {
      dispatch(selectElement(null));
    }
  }, [dispatch]);

  const handleDragStart = useCallback(() => {
    dispatch(setDragging(true));
  }, [dispatch]);

  const handleDragEnd = useCallback(() => {
    dispatch(setDragging(false));
  }, [dispatch]);

  if (!currentTemplate) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen">
        <ToolBar readOnly={readOnly} onSave={onSave} />
        
        <div className="flex flex-1 overflow-hidden">
          {!readOnly && (
            <ElementsSidebar 
              onDragStart={handleDragStart} 
              onDragEnd={handleDragEnd} 
            />
          )}
          
          <EmailCanvas 
            onClick={handleCanvasClick} 
            readOnly={readOnly} 
          />
          
          {!readOnly && selectedElementId && (
            <PropertiesPanel elementId={selectedElementId} />
          )}
        </div>
      </div>
    </DndProvider>
  );
}; 