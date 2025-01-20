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
 * Very inefficient approach:
 * 1) If this node is ROOT_NODE and the editor says the root node is hovered,
 *    we check mousemove bounding box. If user is physically outside the root,
 *    we locally hide the tooltip. But if the root is selected, keep the tooltip visible.
 * 2) If the node is hidden or not hovered/selected => no overlay.
 * 3) This ensures the tooltip only disappears if the user is not inside root's box and not selecting it.
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

  // Basic states
  const isSelected = !!selectedNodeIds?.has(id);
  const isHover = !!hoveredNodeIds?.has(id);

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

  // For rename
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(displayName);

  // Overlay position
  const [indicatorPos, setIndicatorPos] = useState({ top: 0, left: 0 });

  // If root is hovered, we forcibly hide if physically outside bounding box, unless it's selected
  const [forceHideRoot, setForceHideRoot] = useState(false);

  // container for absolute positioning
  const containerEl =
    (document.querySelector('.craftjs-renderer') as HTMLElement) ||
    document.body;

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

  // Basic show condition: not hidden, has dom, hovered or selected
  let showOverlay = !hidden && dom && (isHover || isSelected);

  // If root node, also factor in 'forceHideRoot'
  const isRoot = id === ROOT_NODE;
  if (isRoot && forceHideRoot && !isSelected) {
    // If forcibly hidden and not selected => don't show overlay
    showOverlay = false;
  }

  // Recalc position on hovered/selected changes
  useEffect(() => {
    updatePosition();
  }, [isHover, isSelected, updatePosition]);

  // Recalc if container changes scroll/resize
  useEffect(() => {
    if (!containerEl) return;
    const onPos = () => {
      if (showOverlay) updatePosition();
    };
    containerEl.addEventListener('scroll', onPos);
    window.addEventListener('resize', onPos);
    return () => {
      containerEl.removeEventListener('scroll', onPos);
      window.removeEventListener('resize', onPos);
    };
  }, [containerEl, showOverlay, updatePosition]);

  // If node is root => set up bounding box checks
  useEffect(() => {
    if (!isRoot) return;

    // Mousemove approach
    const handleMouseMove = (ev: globalThis.MouseEvent) => {
      // If craft says root is hovered & user not selecting it => bounding check
      if (!isSelected && hoveredNodeIds?.has(ROOT_NODE)) {
        if (dom) {
          const rect = dom.getBoundingClientRect();
          const inside =
            ev.clientX >= rect.left &&
            ev.clientX <= rect.right &&
            ev.clientY >= rect.top &&
            ev.clientY <= rect.bottom;
          if (!inside) {
            setForceHideRoot(true);
          } else {
            setForceHideRoot(false);
          }
        }
      } else {
        // If not hovered or is selected => no forced hide
        setForceHideRoot(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isRoot, dom, isSelected, hoveredNodeIds]);

  // rename
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
