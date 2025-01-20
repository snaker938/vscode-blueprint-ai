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

export const IndicatorManager: React.FC<IndicatorManagerProps> = ({
  render,
  IndicatorOverlay,
}) => {
  const { id } = useNode();
  const { selectedNodeIds, hoveredNodeIds, actions } = useEditor((state) => ({
    selectedNodeIds: state.events.selected,
    hoveredNodeIds: state.events.hovered,
  }));

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

  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(displayName);

  const [indicatorPos, setIndicatorPos] = useState({ top: 0, left: 0 });

  // We'll position the overlay inside .craftjs-renderer
  const containerEl =
    (document.querySelector('.craftjs-renderer') as HTMLElement) ||
    document.body;

  const updatePosition = useCallback(() => {
    if (!dom) return;
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

  useEffect(() => {
    updatePosition();
  }, [isHover, isSelected, updatePosition]);

  // Reposition on container scroll / resize
  useEffect(() => {
    const handleReposition = () => updatePosition();
    containerEl.addEventListener('scroll', handleReposition);
    window.addEventListener('resize', handleReposition);

    return () => {
      containerEl.removeEventListener('scroll', handleReposition);
      window.removeEventListener('resize', handleReposition);
    };
  }, [containerEl, updatePosition]);

  // Show overlay if not hidden, node is hovered or selected, and we have DOM
  const showOverlay = !hidden && (isSelected || isHover) && dom;

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

  const onToggleHidden = (e: MouseEvent) => {
    e.stopPropagation();
    actions.setHidden(id, !hidden);
  };
  const onDelete = (e: MouseEvent) => {
    e.stopPropagation();
    actions.delete(id);
  };

  return (
    <>
      {showOverlay && (
        <IndicatorOverlay
          containerEl={containerEl}
          dom={dom}
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
