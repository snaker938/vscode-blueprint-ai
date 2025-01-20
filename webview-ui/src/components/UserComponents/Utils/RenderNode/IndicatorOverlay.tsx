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
import styled from 'styled-components';
import { Tooltip } from '@mui/material';

import DeleteOutline from '@mui/icons-material/DeleteOutline';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import OpenWith from '@mui/icons-material/OpenWith';

const INDICATOR_HEIGHT = 32;

const IndicatorWrapper = styled.div`
  position: fixed;
  height: ${INDICATOR_HEIGHT}px;
  font-size: 12px;
  line-height: 1;
  background-color: #0072ee;
  color: #fff;
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 0 6px;
  z-index: 9999;
  user-select: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  svg {
    fill: #fff;
    width: 18px;
    height: 18px;
  }
`;

const NameInput = styled.input`
  width: 110px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #ccc;
  color: #fff;
  font-size: 12px;
  margin-right: 4px;
  outline: none;
  &:focus {
    border-color: #fff;
  }
`;

const IconButtonWrapper = styled.span`
  display: flex;
  align-items: center;
  padding: 0 6px;
  cursor: pointer;
  & + & {
    margin-left: 8px;
  }
  svg {
    opacity: 0.9;
  }
`;

interface IndicatorOverlayProps {
  dom: HTMLElement | null;
  displayName: string;
  isHidden: boolean;
  canMove: boolean;
  canDelete: boolean;
  isRenaming: boolean;
  renameValue: string;
  indicatorPos: { top: number; left: number };
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
  const indicatorRef = useRef<HTMLDivElement>(null);

  const stylePos = useMemo(
    () => ({
      top: `${indicatorPos.top}px`,
      left: `${indicatorPos.left}px`,
    }),
    [indicatorPos.top, indicatorPos.left]
  );

  useEffect(() => {
    if (!indicatorRef.current) return;
    indicatorRef.current.style.top = stylePos.top;
    indicatorRef.current.style.left = stylePos.left;
  }, [stylePos]);

  if (!show || !dom) return null;

  return ReactDOM.createPortal(
    <IndicatorWrapper ref={indicatorRef} style={stylePos}>
      {isRenaming ? (
        <NameInput
          autoFocus
          value={renameValue}
          onChange={onRenameValueChange}
          onBlur={onRenameBlur}
          onKeyDown={onRenameKeyDown}
        />
      ) : (
        <h2
          style={{ marginRight: '6px', cursor: 'pointer', fontSize: 12 }}
          onDoubleClick={onRenameDblClick}
        >
          {displayName}
        </h2>
      )}

      {canMove && (
        <Tooltip title="Drag to move node" placement="top" arrow>
          <IconButtonWrapper
            ref={onDragRef}
            onMouseDown={(ev) => ev.stopPropagation()}
          >
            <OpenWith />
          </IconButtonWrapper>
        </Tooltip>
      )}

      <Tooltip
        title={isHidden ? 'Unhide Node' : 'Hide Node'}
        placement="top"
        arrow
      >
        <IconButtonWrapper onMouseDown={onToggleHidden}>
          {isHidden ? <Visibility /> : <VisibilityOff />}
        </IconButtonWrapper>
      </Tooltip>

      {canDelete && (
        <Tooltip title="Delete node" placement="top" arrow>
          <IconButtonWrapper onMouseDown={onDelete}>
            <DeleteOutline />
          </IconButtonWrapper>
        </Tooltip>
      )}
    </IndicatorWrapper>,
    document.querySelector('.page-container') || document.body
  );
};
