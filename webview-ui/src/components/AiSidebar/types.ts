// AiSidebar/types.ts
export interface AiSidebarProps {
  /**
   * Name of the currently selected element on the CraftJS editing canvas.
   * If provided, we display a "Referencing ____" note.
   */
  selectedElementName?: string;

  /**
   * Optional callbacks for when the user clicks the "suggested features" buttons.
   */
  onConvertScreenshot?: () => void;
  onGenerateDesign?: () => void;

  /**
   * (Optional) Handler for submitting or sending the AI request, e.g. "Chat with Blueprint AI".
   */
  onSubmitChat?: (message: string) => void;
}
