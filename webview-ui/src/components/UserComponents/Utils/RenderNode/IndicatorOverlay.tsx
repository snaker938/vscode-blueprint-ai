// webview-ui/src/components/RenderNode/IndicatorOverlay.tsx

import React, {
  MouseEvent,
  KeyboardEvent,
  ChangeEvent,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import ReactDOM from 'react-dom';
import { Tooltip } from '@mui/material';
import {
  VisibilityOff,
  Visibility,
  DeleteOutline,
  OpenWith,
} from '@mui/icons-material';

import './renderNodeStyles.css';

interface OverlayPos {
  top: number;
  left: number;
}

interface IndicatorOverlayProps {
  containerEl: HTMLElement | null;
  dom: HTMLElement | null;
  displayName: string;
  isHidden: boolean;
  canMove: boolean;
  canDelete: boolean;
  isRenaming: boolean;
  renameValue: string;
  indicatorPos: OverlayPos;
  onRenameValueChange(e: ChangeEvent<HTMLInputElement>): void;
  onRenameBlur(): void;
  onRenameKeyDown(e: KeyboardEvent<HTMLInputElement>): void;
  onRenameDblClick(): void;
  onDragRef(el: HTMLSpanElement | null): void;
  onToggleHidden(e: MouseEvent): void;
  onDelete(e: MouseEvent): void;
  show: boolean;
}

export const IndicatorOverlay: React.FC<IndicatorOverlayProps> = ({
  containerEl,
  dom,
  displayName,
  isHidden,
  canMove,
  canDelete,
  isRenaming,
  renameValue,
  indicatorPos,
  onRenameValueChange,
  onRenameBlur,
  onRenameKeyDown,
  onRenameDblClick,
  onDragRef,
  onToggleHidden,
  onDelete,
  show,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Compute style for overlay
  const stylePos = useMemo(
    () => ({
      top: `${indicatorPos.top}px`,
      left: `${indicatorPos.left}px`,
    }),
    [indicatorPos]
  );

  // Update overlayRef position if style changes
  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.style.top = stylePos.top;
      overlayRef.current.style.left = stylePos.left;
    }
  }, [stylePos]);

  // If we can't show or have no container => skip
  if (!show || !containerEl || !dom) return null;

  const overlayElem = (
    <div
      ref={overlayRef}
      className="node-indicator"
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      {isRenaming ? (
        <input
          className="rename-input"
          autoFocus
          value={renameValue}
          onChange={onRenameValueChange}
          onBlur={onRenameBlur}
          onKeyDown={onRenameKeyDown}
        />
      ) : (
        <h2 onDoubleClick={onRenameDblClick}>{displayName}</h2>
      )}

      {canMove && (
        <Tooltip title="Drag to move node" placement="top" arrow>
          <span
            className="icon-button"
            ref={(dragEl) => onDragRef(dragEl)}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <OpenWith />
          </span>
        </Tooltip>
      )}

      <Tooltip
        title={isHidden ? 'Unhide Node' : 'Hide Node'}
        placement="top"
        arrow
      >
        <span className="icon-button" onMouseDown={onToggleHidden}>
          {isHidden ? <Visibility /> : <VisibilityOff />}
        </span>
      </Tooltip>

      {canDelete && (
        <Tooltip title="Delete node" placement="top" arrow>
          <span className="icon-button" onMouseDown={onDelete}>
            <DeleteOutline />
          </span>
        </Tooltip>
      )}
    </div>
  );

  // Portal into .craftjs-renderer or fallback to body
  return ReactDOM.createPortal(overlayElem, containerEl);
};
