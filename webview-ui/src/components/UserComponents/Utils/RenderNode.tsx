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
  const {
    isSelected,
    connectors: { connect, drag },
    id,
    ameString,
  } = useNode((node) => ({
    // We’re not using Craft’s hovered state since we’re handling hover manually
    isSelected: node.events.selected,
    ameString: node.data.props.ameString,
  }));

  const { actions } = useEditor();

  // Access the underlying DOM for adding outline classes
  const { dom } = useNode((node) => ({
    dom: node.dom,
  }));

  // Apply/remove the "selected" class
  useEffect(() => {
    if (!dom) return;
    if (isSelected) {
      dom.classList.add('craft-node-selected');
    } else {
      dom.classList.remove('craft-node-selected');
    }
  }, [dom, isSelected]);

  // Use local state for hover
  const [manualHovered, setManualHovered] = useState(false);

  // Apply/remove the "hovered" class based on our manual hover state
  useEffect(() => {
    if (!dom) return;
    if (manualHovered) {
      dom.classList.add('craft-node-hovered');
    } else {
      dom.classList.remove('craft-node-hovered');
    }
  }, [dom, manualHovered]);

  // Inline editing state for the node’s name
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(ameString);

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

  // --- Manual hover handlers using local state ---
  const handleWrapperMouseEnter = () => {
    setManualHovered(true);
  };

  const handleWrapperMouseLeave = (e: React.MouseEvent) => {
    const related = e.relatedTarget as HTMLElement | null;
    if (
      !related ||
      (!related.closest('.craft-node-indicator') &&
        !related.closest('.craft-node-wrapper'))
    ) {
      setManualHovered(false);
    }
  };

  const handleIndicatorMouseEnter = () => {
    setManualHovered(true);
  };

  const handleIndicatorMouseLeave = (e: React.MouseEvent) => {
    const related = e.relatedTarget as HTMLElement | null;
    if (
      !related ||
      (!related.closest('.craft-node-indicator') &&
        !related.closest('.craft-node-wrapper'))
    ) {
      setManualHovered(false);
    }
  };

  return (
    <div
      className="craft-node-wrapper"
      ref={(ref) => ref && connect(ref)}
      onMouseEnter={handleWrapperMouseEnter}
      onMouseLeave={handleWrapperMouseLeave}
    >
      {(isSelected || manualHovered) && (
        <div
          className="craft-node-indicator"
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
