import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import { ReactNode } from 'react';

interface EditThread {
    id: string;
    sourceText: string;
    activeText: string;
    variants: string[];
    archived: string[];
    status: 'open' | 'approved';
}
interface VisualEditElement {
    component: string;
    tag: string;
    className: string;
    textContent: string;
    selector: string;
    styles: Record<string, string>;
}
interface VisualEditRequest {
    id: string;
    prompt: string;
    element: VisualEditElement;
    status: 'pending' | 'applied';
    createdAt: string;
}
type Mode = 'off' | 'text' | 'visual';
interface EditModeContextType {
    mode: Mode;
    isEditing: boolean;
    isVisualMode: boolean;
    toggleTextMode: () => void;
    toggleVisualMode: () => void;
    threads: Record<string, EditThread>;
    activePopupId: string | null;
    openPopup: (id: string, sourceText: string) => void;
    closePopup: () => void;
    addVariant: (id: string, text: string) => void;
    swapVariant: (id: string, variantIndex: number) => void;
    swapSource: (id: string) => void;
    approveThread: (id: string) => void;
    reopenThread: (id: string) => void;
    removeVariant: (id: string, variantIndex: number) => void;
    getActiveText: (id: string, sourceText: string) => string;
    pendingCount: number;
    approvedCount: number;
    visualEdits: VisualEditRequest[];
    addVisualEdit: (edit: {
        prompt: string;
        element: VisualEditElement;
    }) => void;
    removeVisualEdit: (id: string) => void;
    updateVisualEdit: (id: string, prompt: string) => void;
    saveAll: () => Promise<boolean>;
}
interface EditModeProviderProps {
    children: ReactNode;
    /** URL prefix for API calls (e.g. "/stape-website"). Defaults to "" */
    basePath?: string;
    /** API endpoint path. Defaults to "/api/save-draft" */
    apiPath?: string;
}
declare function EditModeProvider({ children, basePath, apiPath }: EditModeProviderProps): react_jsx_runtime.JSX.Element;
declare function useEditMode(): EditModeContextType;

interface Props {
    id: string;
    children: string;
}
declare function EditableText({ id, children }: Props): react_jsx_runtime.JSX.Element;

declare function EditToolbar(): react_jsx_runtime.JSX.Element | null;

declare function VisualEditPicker(): react.ReactPortal | null;

export { EditModeProvider, type EditModeProviderProps, type EditThread, EditToolbar, EditableText, type VisualEditElement, VisualEditPicker, type VisualEditRequest, useEditMode };
