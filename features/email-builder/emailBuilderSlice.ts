import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
// @ts-ignore
import { EmailElement, EmailTemplate } from '@/types/emailBuilder';

interface EmailBuilderState {
  templates: EmailTemplate[];
  currentTemplate: EmailTemplate | null;
  selectedElementId: string | null;
  isDragging: boolean;
}

const initialState: EmailBuilderState = {
  templates: [],
  currentTemplate: null,
  selectedElementId: null,
  isDragging: false,
};

export const emailBuilderSlice = createSlice({
  name: 'emailBuilder',
  initialState,
  reducers: {
    createTemplate: (state, action: PayloadAction<{ name: string }>) => {
      const newTemplate: EmailTemplate = {
        id: uuidv4(),
        name: action.payload.name,
        elements: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      state.templates.push(newTemplate);
      state.currentTemplate = newTemplate;
    },
    
    updateTemplate: (state, action: PayloadAction<Partial<EmailTemplate>>) => {
      if (!state.currentTemplate) return;
      
      state.currentTemplate = {
        ...state.currentTemplate,
        ...action.payload,
        updatedAt: new Date().toISOString(),
      };
      
      // Update in templates array
      const index = state.templates.findIndex((t: EmailTemplate) => t.id === state.currentTemplate?.id);
      if (index !== -1) {
        state.templates[index] = state.currentTemplate;
      }
    },
    
    selectTemplate: (state, action: PayloadAction<string>) => {
      const template = state.templates.find((t: EmailTemplate) => t.id === action.payload);
      if (template) {
        state.currentTemplate = template;
        state.selectedElementId = null;
      }
    },
    
    deleteTemplate: (state, action: PayloadAction<string>) => {
      state.templates = state.templates.filter((t: EmailTemplate) => t.id !== action.payload);
      if (state.currentTemplate?.id === action.payload) {
        state.currentTemplate = state.templates[0] || null;
      }
    },
    
    addElement: (state, action: PayloadAction<{ element: Omit<EmailElement, 'id'>, index?: number }>) => {
      if (!state.currentTemplate) return;
      
      const newElement = {
        id: uuidv4(),
        ...action.payload.element,
      };
      
      if (typeof action.payload.index === 'number') {
        state.currentTemplate.elements.splice(action.payload.index, 0, newElement);
      } else {
        state.currentTemplate.elements.push(newElement);
      }
      
      state.currentTemplate.updatedAt = new Date().toISOString();
      
      // Update in templates array
      const index = state.templates.findIndex((t: EmailTemplate) => t.id === state.currentTemplate?.id);
      if (index !== -1) {
        state.templates[index] = state.currentTemplate;
      }
    },
    
    updateElement: (state, action: PayloadAction<{ id: string, changes: Partial<EmailElement> }>) => {
      if (!state.currentTemplate) return;
      
      const elementIndex = state.currentTemplate.elements.findIndex((e: EmailElement) => e.id === action.payload.id);
      if (elementIndex !== -1) {
        state.currentTemplate.elements[elementIndex] = {
          ...state.currentTemplate.elements[elementIndex],
          ...action.payload.changes,
        };
        
        state.currentTemplate.updatedAt = new Date().toISOString();
        
        // Update in templates array
        const index = state.templates.findIndex((t: EmailTemplate) => t.id === state.currentTemplate?.id);
        if (index !== -1) {
          state.templates[index] = state.currentTemplate;
        }
      }
    },
    
    removeElement: (state, action: PayloadAction<string>) => {
      if (!state.currentTemplate) return;
      
      state.currentTemplate.elements = state.currentTemplate.elements.filter((e: EmailElement) => e.id !== action.payload);
      if (state.selectedElementId === action.payload) {
        state.selectedElementId = null;
      }
      
      state.currentTemplate.updatedAt = new Date().toISOString();
      
      // Update in templates array
      const index = state.templates.findIndex((t: EmailTemplate) => t.id === state.currentTemplate?.id);
      if (index !== -1) {
        state.templates[index] = state.currentTemplate;
      }
    },
    
    reorderElements: (state, action: PayloadAction<{ sourceIndex: number, destinationIndex: number }>) => {
      if (!state.currentTemplate) return;
      
      const { sourceIndex, destinationIndex } = action.payload;
      const element = state.currentTemplate.elements[sourceIndex];
      
      state.currentTemplate.elements.splice(sourceIndex, 1);
      state.currentTemplate.elements.splice(destinationIndex, 0, element);
      
      state.currentTemplate.updatedAt = new Date().toISOString();
      
      // Update in templates array
      const index = state.templates.findIndex((t: EmailTemplate) => t.id === state.currentTemplate?.id);
      if (index !== -1) {
        state.templates[index] = state.currentTemplate;
      }
    },
    
    selectElement: (state, action: PayloadAction<string | null>) => {
      state.selectedElementId = action.payload;
    },
    
    setDragging: (state, action: PayloadAction<boolean>) => {
      state.isDragging = action.payload;
    },
    
    importTemplate: (state, action: PayloadAction<EmailTemplate>) => {
      // Generate a new ID for the imported template to avoid conflicts
      const newId = uuidv4();
      const now = new Date().toISOString();
      
      // Create a clean template object with proper structure
      const importedTemplate: EmailTemplate = {
        id: newId,
        name: action.payload.name,
        elements: Array.isArray(action.payload.elements) 
          ? action.payload.elements.map((element: any) => ({
              ...element,
              // Generate new IDs for each element to avoid conflicts
              id: uuidv4()
            }))
          : [],
        createdAt: now,
        updatedAt: now,
        subject: action.payload.subject || action.payload.name,
        description: action.payload.description || '',
      };
      
      // Add the template to state
      state.templates.push(importedTemplate);
      
      // Set as current template
      state.currentTemplate = importedTemplate;
      state.selectedElementId = null;
    },
  },
});

export const {
  createTemplate,
  updateTemplate,
  selectTemplate,
  deleteTemplate,
  addElement,
  updateElement,
  removeElement,
  reorderElements,
  selectElement,
  setDragging,
  importTemplate,
} = emailBuilderSlice.actions;

export default emailBuilderSlice.reducer; 