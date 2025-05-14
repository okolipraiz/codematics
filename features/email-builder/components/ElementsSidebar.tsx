import { useMemo } from 'react';
import { useDrag } from 'react-dnd';
import { 
  Heading,
  Type,
  Image as ImageIcon,
  SplitSquareVertical,
  Square,
  ArrowRight,
  Share2,
  Divide
} from 'lucide-react';
import { ElementType } from '@/types/emailBuilder';

interface ElementItemProps {
  type: ElementType;
  label: string;
  icon: React.ReactNode;
  description: string;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const ElementItem = ({ type, label, icon, description, onDragStart, onDragEnd }: ElementItemProps) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'EMAIL_ELEMENT',
    item: () => {
      onDragStart();
      return { type };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: onDragEnd,
  }), [onDragStart, onDragEnd, type]);

  return (
    <div
      ref={dragRef as any}
      className={`flex flex-col p-4 mb-3 border rounded-md cursor-move transition-all ${
        isDragging ? 'opacity-50 bg-accent shadow-lg' : 'hover:bg-accent/10 hover:shadow'
      }`}
    >
      <div className="flex items-center mb-2">
        <div className="mr-3 text-primary">{icon}</div>
        <span className="font-medium">{label}</span>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
};

interface ElementsSidebarProps {
  onDragStart: () => void;
  onDragEnd: () => void;
}

export const ElementsSidebar = ({ onDragStart, onDragEnd }: ElementsSidebarProps) => {
  const elements = useMemo(() => [
    { 
      type: 'header' as const, 
      label: 'Heading', 
      icon: <Heading size={20} />,
      description: 'Add a title or subtitle to your email'
    },
    { 
      type: 'text' as const, 
      label: 'Text', 
      icon: <Type size={20} />,
      description: 'Add paragraph text to your email'
    },
    { 
      type: 'image' as const, 
      label: 'Image', 
      icon: <ImageIcon size={20} />,
      description: 'Insert an image with optional link'
    },
    { 
      type: 'button' as const, 
      label: 'Button', 
      icon: <ArrowRight size={20} />,
      description: 'Add a clickable call-to-action button'
    },
    { 
      type: 'divider' as const, 
      label: 'Divider', 
      icon: <Divide size={20} />,
      description: 'Add a horizontal line to separate content'
    },
    { 
      type: 'spacer' as const, 
      label: 'Spacer', 
      icon: <Square size={20} />,
      description: 'Add vertical space between elements'
    },
    { 
      type: 'social' as const, 
      label: 'Social', 
      icon: <Share2 size={20} />,
      description: 'Add links to your social media profiles'
    },
    // { 
    //   type: 'columns' as const, 
    //   label: 'Columns', 
    //   icon: <SplitSquareVertical size={20} />,
    //   description: 'Create multi-column layouts'
    // },
  ], []);

  return (
    <div className="w-72 p-4 border-r overflow-y-auto bg-background">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-1">Elements</h2>
        <p className="text-sm text-muted-foreground">Drag elements to the canvas</p>
      </div>
      <div className="space-y-1">
        {elements.map((element) => (
          <ElementItem
            key={element.type}
            type={element.type}
            label={element.label}
            icon={element.icon}
            description={element.description}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  );
}; 