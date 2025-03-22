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
    isHovered,
    connectors: { drag, connect },
    id,
    ameString,
    isRootContainer,
    dom,
  } = useNode((node) => ({
    isSelected: node.events.selected,
    isHovered: node.events.hovered,
    ameString: node.data.props.ameString,
    isRootContainer: node.data.custom?.isRootContainer,
    dom: node.dom,
  }));

  const { actions } = useEditor();

  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(ameString);

  // Add or remove styling class for selected node
  useEffect(() => {
    if (!dom || isRootContainer) return;
    if (isSelected) {
      dom.classList.add('craft-node-selected');
    } else {
      dom.classList.remove('craft-node-selected');
    }
  }, [dom, isSelected, isRootContainer]);

  // Add or remove styling class for hovered node
  useEffect(() => {
    if (!dom || isRootContainer) return;
    if (isHovered) {
      dom.classList.add('craft-node-hovered');
    } else {
      dom.classList.remove('craft-node-hovered');
    }
  }, [dom, isHovered, isRootContainer]);

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
      ref={(ref) => {
        // Connect this div to hover, but *not* drag
        // (drag is connected to the IconButton below)
        if (ref) connect(ref);
      }}
      onClick={handleNodeClick}
    >
      {/* Show indicator only if hovered or selected */}
      {(isHovered || isSelected) && (
        <div className="craft-node-indicator" data-node-id={id}>
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

          {/* Drag handle (only the icon button is draggable) */}
          <IconButton
            size="small"
            className="drag-handle"
            component="div"
            ref={(dragRef) => {
              if (dragRef) drag(dragRef);
            }}
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
