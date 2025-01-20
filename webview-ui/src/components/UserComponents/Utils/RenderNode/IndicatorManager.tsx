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

interface IndicatorManagerProps {
  render: React.ReactElement;
  IndicatorOverlay: React.ComponentType<any>;
}

/**
 * Handles all logic for when to show/hide the overlay tooltip indicator.
 * Fixes issues:
 *  - If user selects a component, other tooltips may still appear when hovered.
 *  - If user’s mouse leaves the last hovered component and now hovers doc body,
 *    the tooltip for that component disappears properly.
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

  const isActive = !!selectedNodeIds?.has(id);
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

  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(displayName);
  const [forceHide, setForceHide] = useState(false);
  const [indicatorPos, setIndicatorPos] = useState({ top: 0, left: 0 });

  const getPos = useCallback((el: HTMLElement) => {
    const INDICATOR_HEIGHT = 32;
    const OFFSET_ABOVE = 8;
    if (!el) return { top: 0, left: 0 };
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top - INDICATOR_HEIGHT - OFFSET_ABOVE,
      left: rect.left,
    };
  }, []);

  const positionIndicator = useCallback(() => {
    if (!dom) return;
    setIndicatorPos(getPos(dom));
  }, [dom, getPos]);

  // Reposition on scroll/resize
  useEffect(() => {
    const container = document.querySelector('.craftjs-renderer');
    if (!container) return;

    const handleUpdate = () => positionIndicator();
    container.addEventListener('scroll', handleUpdate);
    window.addEventListener('resize', handleUpdate);

    return () => {
      container.removeEventListener('scroll', handleUpdate);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [positionIndicator]);

  // Track mouse movement to hide if hoveredNodeIds empty + selectedNodeIds empty
  // but do NOT hide if user is selecting any node or hovering a node.
  useEffect(() => {
    const handleMouseMove = () => {
      if (hoveredNodeIds?.size === 0 && selectedNodeIds?.size === 0) {
        setForceHide(true);
      } else {
        setForceHide(false);
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hoveredNodeIds, selectedNodeIds]);

  // If user leaves doc entirely, also hide
  useEffect(() => {
    const leaveDoc = () => setForceHide(true);
    const enterDoc = () => setForceHide(false);

    document.addEventListener('mouseleave', leaveDoc);
    document.addEventListener('mouseenter', enterDoc);

    return () => {
      document.removeEventListener('mouseleave', leaveDoc);
      document.removeEventListener('mouseenter', enterDoc);
    };
  }, []);

  // Rename logic
  const handleRenameDblClick = () => {
    setRenameValue(displayName);
    setRenaming(true);
  };
  const finalizeRename = () => {
    actions.setCustom(id, (cust: any) => {
      cust.displayName = renameValue || 'Untitled Node';
    });
    setRenaming(false);
  };
  const handleNameKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finalizeRename();
    } else if (e.key === 'Escape') {
      setRenaming(false);
    }
  };

  // Show the indicator if node is not hidden, the user is either hovering or has selected it,
  // there's a valid dom, and we are not forcing hide.
  const showIndicator = !hidden && (isHover || isActive) && dom && !forceHide;

  const handleToggleHidden = (e: MouseEvent) => {
    e.stopPropagation();
    actions.setHidden(id, !hidden);
  };

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    actions.delete(id);
  };

  return (
    <>
      {showIndicator && (
        <IndicatorOverlay
          dom={dom as HTMLElement}
          displayName={displayName as string}
          isHidden={hidden as boolean}
          canMove={moveable as boolean}
          canDelete={deletable as boolean}
          isRenaming={renaming as boolean}
          renameValue={renameValue as string}
          indicatorPos={indicatorPos as { top: number; left: number }}
          onRenameValueChange={(ev: ChangeEvent<HTMLInputElement>) =>
            setRenameValue(ev.target.value)
          }
          onRenameBlur={finalizeRename}
          onRenameKeyDown={handleNameKeyDown}
          onRenameDblClick={handleRenameDblClick}
          onDragRef={(el: HTMLElement | null) => el && connectors.drag(el)}
          onToggleHidden={handleToggleHidden}
          onDelete={handleDelete}
          show={showIndicator as boolean}
        />
      )}
      {render}
    </>
  );
};
