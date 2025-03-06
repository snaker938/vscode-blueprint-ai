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
    isHovered,
    isSelected,
    connectors: { drag },
    id,
    // Suppose this is the "name" prop for your component, from the node's data:
    ameString,
  } = useNode((node) => ({
    isHovered: node.events.hovered,
    isSelected: node.events.selected,
    ameString: node.data.props.ameString, // if your prop is named differently, adjust here
  }));

  const { actions } = useEditor();

  // We'll store the Node's underlying DOM here for adding/removing outline classes
  const {
    dom, // The actual DOM element associated with this node
  } = useNode((node) => ({
    dom: node.dom,
  }));

  // Toggle the "selected" CSS class
  useEffect(() => {
    if (!dom) return;
    if (isSelected) {
      dom.classList.add('craft-node-selected');
    } else {
      dom.classList.remove('craft-node-selected');
    }
  }, [dom, isSelected]);

  // Toggle the "hovered" CSS class
  useEffect(() => {
    if (!dom) return;
    if (isHovered) {
      dom.classList.add('craft-node-hovered');
    } else {
      dom.classList.remove('craft-node-hovered');
    }
  }, [dom, isHovered]);

  // Inline editing of the node's name
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
    // Commit changes to the node's ameString prop
    actions.setProp(id, (props: any) => {
      props.ameString = tempName;
    });
    setEditingName(false);
  };

  const handleHide = () => {
    // Hide the node (and its children) without deleting
    actions.setHidden(id, true);
  };

  const handleDelete = () => {
    // Delete the node (and its children)
    actions.delete(id);
  };

  return (
    <div className="craft-node-wrapper">
      {(isSelected || isHovered) && (
        <div className="craft-node-indicator">
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

      {/*
        Render the actual node's contents.
        We do not wrap {render} in any additional element,
        so your original node structure remains intact.
      */}
      {render}
    </div>
  );
};
