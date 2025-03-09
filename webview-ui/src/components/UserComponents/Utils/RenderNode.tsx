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
    connectors: { drag },
    id,
    ameString,
    isRootContainer,
    dom,
  } = useNode((node) => ({
    isSelected: node.events.selected,
    ameString: node.data.props.ameString,
    isRootContainer: node.data.custom?.isRootContainer,
    dom: node.dom,
  }));

  const { actions } = useEditor();

  const [manualHovered, setManualHovered] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(ameString);

  useEffect(() => {
    if (!dom || isRootContainer) return;
    if (isSelected) {
      dom.classList.add('craft-node-selected');
    } else {
      dom.classList.remove('craft-node-selected');
    }
  }, [dom, isSelected, isRootContainer]);

  useEffect(() => {
    if (!dom || isRootContainer) return;
    if (manualHovered) {
      dom.classList.add('craft-node-hovered');
    } else {
      dom.classList.remove('craft-node-hovered');
    }
  }, [dom, manualHovered, isRootContainer]);

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

  const handleWrapperMouseEnter = () => {
    setManualHovered(true);
  };

  const handleWrapperMouseLeave = (e: React.MouseEvent) => {
    const related = e.relatedTarget as HTMLElement | null;
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

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Only select if NOT the root container
    if (!isRootContainer) {
      actions.selectNode([id]);
    }
  };

  // Root container: do nothing on click/hover/etc.
  if (isRootContainer) {
    return <>{render}</>;
  }

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

      {render}
    </div>
  );
};
