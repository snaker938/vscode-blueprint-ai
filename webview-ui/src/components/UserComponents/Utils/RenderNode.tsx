import React, { useEffect, useState } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { IconButton } from '@mui/material';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import './RenderNode.css';

interface RenderNodeProps {
  render: React.ReactNode;
}

export const RenderNode: React.FC<RenderNodeProps> = ({ render }) => {
  // Collect all node-related data in a single `useNode` call
  const {
    isSelected,
    connectors: { connect, drag },
    id,
    ameString,
    isRootContainer,
    dom,
  } = useNode((node) => ({
    // We’re not using Craft’s hovered state since we handle hover manually
    isSelected: node.events.selected,
    ameString: node.data.props.ameString,
    // Flag to detect if this is our “root container”
    isRootContainer: node.data.custom?.isRootContainer,
    dom: node.dom,
  }));

  const { actions } = useEditor();

  // Manual hover state
  const [manualHovered, setManualHovered] = useState(false);

  // Inline editing state for the node’s ameString
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(ameString);

  /**
   * 1) Update the DOM class for selection.
   */
  useEffect(() => {
    if (!dom || isRootContainer) return;
    if (isSelected) {
      dom.classList.add('craft-node-selected');
    } else {
      dom.classList.remove('craft-node-selected');
    }
  }, [dom, isSelected, isRootContainer]);

  /**
   * 2) Update the DOM class for hover.
   */
  useEffect(() => {
    if (!dom || isRootContainer) return;
    if (manualHovered) {
      dom.classList.add('craft-node-hovered');
    } else {
      dom.classList.remove('craft-node-hovered');
    }
  }, [dom, manualHovered, isRootContainer]);

  // Handlers for name editing
  const handleNameDoubleClick = () => {
    setTempName(ameString);
    setEditingName(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(e.target.value);
  };

  const handleNameBlur = () => {
    actions.setProp(id, (props: any) => {
      props.ameString = tempName;
    });
    setEditingName(false);
  };

  const handleHide = () => {
    actions.setHidden(id, true);
  };

  const handleDelete = () => {
    actions.delete(id);
  };

  /**
   * HOVER logic:
   * We attach `data-node-id={id}` to ensure we only remain hovered
   * if the mouse is still inside *this* node’s wrapper/indicator.
   */
  const handleWrapperMouseEnter = () => {
    setManualHovered(true);
  };

  const handleWrapperMouseLeave = (e: React.MouseEvent) => {
    const related = e.relatedTarget as HTMLElement | null;
    // Unhover if the related target is not in the same node's wrapper/indicator
    if (!related || !related.closest(`[data-node-id="${id}"]`)) {
      setManualHovered(false);
    }
  };

  const handleIndicatorMouseEnter = () => {
    setManualHovered(true);
  };

  const handleIndicatorMouseLeave = (e: React.MouseEvent) => {
    const related = e.relatedTarget as HTMLElement | null;
    if (!related || !related.closest(`[data-node-id="${id}"]`)) {
      setManualHovered(false);
    }
  };

  /**
   * SINGLE-SELECTION logic:
   * Clicking on this node will select ONLY this node,
   * ignoring multiple selection.
   */
  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isRootContainer) {
      // Force single-node selection
      actions.selectNode([id]);
    }
  };

  // If this is our root container, we connect here:
  if (isRootContainer) {
    return <div ref={(ref) => ref && connect(ref)}>{render}</div>;
  }

  // Otherwise, wrap the rendered node for custom hover/selection UI.
  return (
    <div
      className="craft-node-wrapper"
      data-node-id={id}
      onMouseEnter={handleWrapperMouseEnter}
      onMouseLeave={handleWrapperMouseLeave}
      onClick={handleNodeClick}
    >
      {(isSelected || manualHovered) && (
        <div
          className="craft-node-indicator"
          data-node-id={id}
          onMouseEnter={handleIndicatorMouseEnter}
          onMouseLeave={handleIndicatorMouseLeave}
        >
          {editingName ? (
            <input
              className="craft-name-input"
              value={tempName}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              autoFocus
            />
          ) : (
            <span className="craft-name" onDoubleClick={handleNameDoubleClick}>
              {ameString}
            </span>
          )}

          {/* Drag handle */}
          <IconButton
            size="small"
            className="drag-handle"
            component="div"
            ref={(instance: HTMLDivElement | null) =>
              instance && drag(instance)
            }
            title="Drag this component"
          >
            <OpenWithIcon fontSize="inherit" />
          </IconButton>

          {/* Hide */}
          <IconButton
            size="small"
            onClick={handleHide}
            title="Hide this component"
          >
            <VisibilityOffIcon fontSize="inherit" />
          </IconButton>

          {/* Delete */}
          <IconButton
            size="small"
            onClick={handleDelete}
            title="Delete this component"
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </div>
      )}

      {/* Render the node’s actual contents */}
      {render}
    </div>
  );
};
