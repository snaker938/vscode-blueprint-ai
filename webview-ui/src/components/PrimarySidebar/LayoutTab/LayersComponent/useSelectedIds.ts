import { useEditor, NodeId, EditorState } from '@craftjs/core';

/**
 * Convert the Set of selected NodeIds into an array.
 * This forces React to see new references each time,
 * and allows .includes(...) checks to work.
 */
export function useSelectedIds(): NodeId[] {
  const selected = useEditor((state: EditorState) => state.events.selected);
  if (selected instanceof Set) {
    return Array.from(selected) as NodeId[];
  }
  return [];
}
