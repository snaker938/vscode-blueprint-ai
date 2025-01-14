import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  MouseEvent,
  KeyboardEvent,
  ChangeEvent,
} from 'react';
import ReactDOM from 'react-dom';
import { useNode, useEditor } from '@craftjs/core';
import styled from 'styled-components';

// Material UI icons
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import OpenWith from '@mui/icons-material/OpenWith';
import { Tooltip } from '@mui/material';

const IndicatorDiv = styled.div`
  position: fixed;
  height: 32px;
  margin-top: -31px;
  font-size: 12px;
  line-height: 12px;
  background-color: #0072ee;
  color: #fff;
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 0 6px;
  z-index: 9999;

  /* Avoid text selection highlight on double-click rename */
  user-select: none;

  /* A small drop shadow for clarity */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  svg {
    fill: #fff;
    width: 18px;
    height: 18px;
  }
`;

const IconBtn = styled.span`
  padding: 0 6px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  cursor: pointer;

  & + & {
    margin-left: 8px;
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

interface RenderNodeProps {
  render: React.ReactElement;
}

/**
 * RenderNode
 * - Uses actions.setHidden(...) from the official Craft.js API to hide/unhide a node
 * - Double-click rename via actions.setCustom(...)
 * - Has MUI icons + tooltips
 */
export const RenderNode: React.FC<RenderNodeProps> = ({ render }) => {
  // Grab nodeId from useNode()
  const { id } = useNode();

  // From the editor, get the set of selected node IDs
  const { selectedNodeIds, actions } = useEditor((state) => ({
    selectedNodeIds: state.events.selected,
  }));

  // Check if this node is currently "active" (selected)
  const isActive = !!selectedNodeIds && selectedNodeIds.has(id);

  // Collect data from this node
  const { connectors, dom, hidden, isHover, moveable, deletable, displayName } =
    useNode((node) => ({
      dom: node.dom,
      hidden: node.data.hidden,
      isHover: node.events.hovered,
      // For simplicity, we just define these as always true
      moveable: true,
      deletable: true,
      // Fallback if custom.displayName not set
      displayName:
        (node.data.custom && node.data.custom.displayName) ||
        node.data.displayName,
    }));

  // State for rename
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(displayName);

  // Ref for indicator div
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Positioning logic for the indicator
  const getPos = useCallback((el: HTMLElement) => {
    if (!el) return { top: '0px', left: '0px' };
    const { top, left, bottom } = el.getBoundingClientRect();
    return {
      top: `${top > 0 ? top : bottom}px`,
      left: `${left}px`,
    };
  }, []);

  const handleScroll = useCallback(() => {
    if (!indicatorRef.current || !dom) return;
    const { top, left } = getPos(dom);
    indicatorRef.current.style.top = top;
    indicatorRef.current.style.left = left;
  }, [dom, getPos]);

  useEffect(() => {
    const container = document.querySelector('.craftjs-renderer');
    if (!container) return;
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Toggle hidden/unhidden
  const toggleHidden = (e: MouseEvent) => {
    e.stopPropagation();
    actions.setHidden(id, !hidden);
  };

  // Rename logic
  const handleNameDoubleClick = () => {
    setRenameValue(displayName);
    setIsRenaming(true);
  };

  const commitNameChange = () => {
    actions.setCustom(id, (cust: any) => {
      cust.displayName = renameValue || 'Untitled Node';
    });
    setIsRenaming(false);
  };

  const handleNameKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitNameChange();
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
    }
  };

  const handleNameBlur = () => {
    commitNameChange();
  };

  // Show indicator if node is not hidden and is either hovered or active
  const showIndicator = !hidden && (isHover || isActive) && dom;

  return (
    <>
      {showIndicator
        ? ReactDOM.createPortal(
            <IndicatorDiv ref={indicatorRef} style={getPos(dom)}>
              {isRenaming ? (
                <NameInput
                  autoFocus
                  value={renameValue}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setRenameValue(e.target.value)
                  }
                  onBlur={handleNameBlur}
                  onKeyDown={handleNameKeyDown}
                />
              ) : (
                <h2
                  style={{ marginRight: '6px', cursor: 'pointer' }}
                  onDoubleClick={handleNameDoubleClick}
                >
                  {displayName}
                </h2>
              )}

              {moveable && (
                <Tooltip title="Drag to move node" arrow>
                  <IconBtn
                    ref={(refEl) => {
                      if (refEl) connectors.drag(refEl);
                    }}
                  >
                    <OpenWith />
                  </IconBtn>
                </Tooltip>
              )}

              <Tooltip title={hidden ? 'Unhide Node' : 'Hide Node'} arrow>
                <IconBtn onMouseDown={toggleHidden}>
                  {hidden ? <Visibility /> : <VisibilityOff />}
                </IconBtn>
              </Tooltip>

              {deletable && (
                <Tooltip title="Delete node" arrow>
                  <IconBtn
                    onMouseDown={(e: MouseEvent) => {
                      e.stopPropagation();
                      actions.delete(id);
                    }}
                  >
                    <DeleteOutline />
                  </IconBtn>
                </Tooltip>
              )}
            </IndicatorDiv>,
            document.querySelector('.page-container') || document.body
          )
        : null}

      {render}
    </>
  );
};
