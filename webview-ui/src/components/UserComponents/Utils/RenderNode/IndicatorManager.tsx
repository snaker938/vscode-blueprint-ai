// webview-ui/src/components/RenderNode/IndicatorManager.tsx

import React, {
  useState,
  useEffect,
  useCallback,
  KeyboardEvent,
  ChangeEvent,
  MouseEvent,
} from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { ROOT_NODE } from '@craftjs/utils';

interface IndicatorManagerProps {
  render: React.ReactElement;
  IndicatorOverlay: React.ComponentType<any>;
}

/**
 * Extremely "inefficient" fix to forcibly hide root node's tooltip:
 * 1) Listen to mousemove globally.
 * 2) If this node is root and it's hovered by CraftJS, but the mouse coords
 *    are not inside root's bounding box => set `forceHideRoot = true`.
 * 3) Then `showOverlay = false` if `forceHideRoot` is true.
 * 4) We do not rely on craftjs' actions.hover(null) or setNodeEvent; we do a local override.
 */
export const IndicatorManager: React.FC<IndicatorManagerProps> = ({
  render,
  IndicatorOverlay,
}) => {
  const { id } = useNode();
  const { selectedNodeIds, hoveredNodeIds, actions } = useEditor((state) => ({
    selectedNodeIds: state.events.selected,
    hoveredNodeIds: state.events.hovered,
  }));

  // Node data
  const { connectors, dom, hidden, moveable, deletable, displayName } = useNode(
    (node) => ({
      dom: node.dom,
      hidden: node.data.hidden,
      moveable: true,
      deletable: true,
      displayName:
        (node.data.custom && node.data.custom.displayName) ||
        node.data.displayName,
    })
  );

  // Basic states
  const isSelected = !!selectedNodeIds?.has(id);
  const isHover = !!hoveredNodeIds?.has(id);

  // We'll locally override the "hover" overlay for the root if the user is physically outside
  const [forceHideRoot, setForceHideRoot] = useState(false);

  // Rename states
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(displayName);

  const [indicatorPos, setIndicatorPos] = useState({ top: 0, left: 0 });

  // The container for absolute positioning
  const containerEl =
    (document.querySelector('.craftjs-renderer') as HTMLElement) ||
    document.body;

  // Recompute overlay position
  const updatePosition = useCallback(() => {
    if (!dom || !containerEl) return;
    const rect = dom.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();

    const INDICATOR_HEIGHT = 32;
    const OFFSET_ABOVE = 8;

    const top =
      rect.top -
      containerRect.top -
      INDICATOR_HEIGHT -
      OFFSET_ABOVE +
      containerEl.scrollTop;
    const left = rect.left - containerRect.left + containerEl.scrollLeft;

    setIndicatorPos({ top, left });
  }, [dom, containerEl]);

  // Show if not hidden, node has a dom, and is either hovered or selected,
  // plus we do not forcibly hide root:
  const isRoot = id === ROOT_NODE;
  const showOverlay =
    !hidden && dom && (isHover || isSelected) && !(isRoot && forceHideRoot);

  // Poll if root hovered => bounding check => if user outside => forceHide
  useEffect(() => {
    if (!isRoot) return;

    const onMouseMove = (e: globalThis.MouseEvent) => {
      if (!dom) return;
      const rootIsHovered = hoveredNodeIds?.has(ROOT_NODE);
      if (!rootIsHovered) {
        // If craftjs says root not hovered, remove local override
        setForceHideRoot(false);
        return;
      }
      // If root is hovered, check bounding box
      const rect = dom.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!inside) {
        // Force local hide
        setForceHideRoot(true);
      } else {
        // If user is inside => show
        setForceHideRoot(false);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [isRoot, dom, hoveredNodeIds]);

  // Recompute position if hovered/selected changes
  useEffect(() => {
    updatePosition();
  }, [isHover, isSelected, updatePosition]);

  // Reposition on container scroll / window resize
  useEffect(() => {
    if (!containerEl) return;
    const doPos = () => {
      if (showOverlay) updatePosition();
    };
    containerEl.addEventListener('scroll', doPos);
    window.addEventListener('resize', doPos);
    return () => {
      containerEl.removeEventListener('scroll', doPos);
      window.removeEventListener('resize', doPos);
    };
  }, [containerEl, showOverlay, updatePosition]);

  // rename logic
  const onRenameDblClick = () => {
    setRenameValue(displayName);
    setRenaming(true);
  };
  const finalizeRename = () => {
    actions.setCustom(id, (cust: any) => {
      cust.displayName = renameValue || 'Untitled Node';
    });
    setRenaming(false);
  };
  const onRenameValueChange = (e: ChangeEvent<HTMLInputElement>) =>
    setRenameValue(e.target.value);
  const onRenameBlur = finalizeRename;
  const onRenameKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finalizeRename();
    } else if (e.key === 'Escape') {
      setRenaming(false);
    }
  };

  // hide/unhide
  const onToggleHidden = (e: MouseEvent) => {
    e.stopPropagation();
    actions.setHidden(id, !hidden);
  };
  // delete
  const onDelete = (e: MouseEvent) => {
    e.stopPropagation();
    actions.delete(id);
  };

  return (
    <>
      {showOverlay && (
        <IndicatorOverlay
          containerEl={containerEl}
          dom={dom as HTMLElement}
          displayName={displayName}
          isHidden={hidden}
          canMove={moveable}
          canDelete={deletable}
          isRenaming={renaming}
          renameValue={renameValue}
          indicatorPos={indicatorPos}
          onRenameValueChange={onRenameValueChange}
          onRenameBlur={onRenameBlur}
          onRenameKeyDown={onRenameKeyDown}
          onRenameDblClick={onRenameDblClick}
          onDragRef={(el: HTMLElement | null) => el && connectors.drag(el)}
          onToggleHidden={onToggleHidden}
          onDelete={onDelete}
          show={showOverlay}
        />
      )}
      {render}
    </>
  );
};
