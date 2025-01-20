// webview-ui/src/components/RenderNode/index.tsx

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

import DeleteOutline from '@mui/icons-material/DeleteOutline';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import OpenWith from '@mui/icons-material/OpenWith';
import { Tooltip } from '@mui/material';

const INDICATOR_HEIGHT = 32;
const OFFSET_ABOVE = 8;

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

interface RenderNodeProps {
  render: React.ReactElement;
}

/**
 * RenderNode
 * Displays a small indicator above each Node if hovered or selected.
 * Hides the indicator if:
 *  - The user’s mouse leaves every component (hoveredNodeIds is empty).
 *  - And there’s no node selected (selectedNodeIds is empty).
 * Otherwise, if exactly one node is selected, hide the indicator on all others.
 */
export const RenderNode: React.FC<RenderNodeProps> = ({ render }) => {
  const { id } = useNode();
  const { selectedNodeIds, hoveredNodeIds, actions } = useEditor((state) => ({
    selectedNodeIds: state.events.selected,
    hoveredNodeIds: state.events.hovered,
  }));

  const isActive = !!selectedNodeIds?.has(id);
  const isHovered = !!hoveredNodeIds?.has(id);

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

  const indicatorRef = useRef<HTMLDivElement>(null);

  const getIndicatorPos = useCallback((el: HTMLElement) => {
    if (!el) return { top: 0, left: 0 };
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top - INDICATOR_HEIGHT - OFFSET_ABOVE,
      left: rect.left,
    };
  }, []);

  const positionIndicator = useCallback(() => {
    if (!indicatorRef.current || !dom) return;
    const { top, left } = getIndicatorPos(dom);
    indicatorRef.current.style.top = `${top}px`;
    indicatorRef.current.style.left = `${left}px`;
  }, [dom, getIndicatorPos]);

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

  // Mouse tracking for hiding all indicators if no hover + no selection
  useEffect(() => {
    const handleMouseMove = () => {
      // If no hovered nodes and no selected nodes => hide indicator forcibly
      if (hoveredNodeIds?.size === 0 && selectedNodeIds?.size === 0) {
        setForceHide(true);
      } else {
        // If exactly one node is selected, hide all but that node
        if (selectedNodeIds?.size === 1 && !selectedNodeIds.has(id)) {
          setForceHide(true);
        } else {
          setForceHide(false);
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hoveredNodeIds, selectedNodeIds, id]);

  const toggleHidden = (e: MouseEvent) => {
    e.stopPropagation();
    actions.setHidden(id, !hidden);
  };

  const handleRenameDblClick = () => {
    setRenameValue(displayName);
    setRenaming(true);
  };

  const finalizeRename = () => {
    actions.setCustom(id, (custom: any) => {
      custom.displayName = renameValue || 'Untitled Node';
    });
    setRenaming(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finalizeRename();
    } else if (e.key === 'Escape') {
      setRenaming(false);
    }
  };

  const showIndicator = !hidden && (isActive || isHovered) && dom && !forceHide;

  return (
    <>
      {showIndicator &&
        ReactDOM.createPortal(
          <IndicatorWrapper ref={indicatorRef} style={getIndicatorPos(dom)}>
            {renaming ? (
              <NameInput
                autoFocus
                value={renameValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setRenameValue(e.target.value)
                }
                onBlur={finalizeRename}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <h2
                style={{ marginRight: '6px', cursor: 'pointer', fontSize: 12 }}
                onDoubleClick={handleRenameDblClick}
              >
                {displayName}
              </h2>
            )}

            {moveable && (
              <Tooltip title="Drag to move node" placement="top" arrow>
                <IconButtonWrapper
                  ref={(el) => el && connectors.drag(el)}
                  onMouseDown={(ev) => ev.stopPropagation()}
                >
                  <OpenWith />
                </IconButtonWrapper>
              </Tooltip>
            )}

            <Tooltip
              title={hidden ? 'Unhide Node' : 'Hide Node'}
              placement="top"
              arrow
            >
              <IconButtonWrapper onMouseDown={toggleHidden}>
                {hidden ? <Visibility /> : <VisibilityOff />}
              </IconButtonWrapper>
            </Tooltip>

            {deletable && (
              <Tooltip title="Delete node" placement="top" arrow>
                <IconButtonWrapper
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    actions.delete(id);
                  }}
                >
                  <DeleteOutline />
                </IconButtonWrapper>
              </Tooltip>
            )}
          </IndicatorWrapper>,
          document.querySelector('.page-container') || document.body
        )}
      {render}
    </>
  );
};
