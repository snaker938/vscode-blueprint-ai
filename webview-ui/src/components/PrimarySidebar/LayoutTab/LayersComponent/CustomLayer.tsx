import React, { useState } from 'react';
import { useLayer } from '@craftjs/layers';
import { useEditor, NodeId, EditorState } from '@craftjs/core';
import { ROOT_NODE } from '@craftjs/utils';

interface ChildLayerItemProps {
  nodeId: NodeId;
  depth: number;
}

/**
 * A component to render each child layer item.
 * Assumes that state.events.selected is a Set<string> in your CraftJS version.
 */
const ChildLayerItem: React.FC<ChildLayerItemProps> = ({ nodeId, depth }) => {
  const { actions, query } = useEditor();
  const node = query.node(nodeId).get();

  const displayName: string =
    (node?.data?.custom?.displayName as string) || nodeId;
  const isRoot: boolean = nodeId === ROOT_NODE;

  // For local expand/collapse logic
  const [expanded, setExpanded] = useState<boolean>(false);

  // Rename logic
  const [editingName, setEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(displayName);

  // Identify child nodes
  const childNodeIds: NodeId[] = node?.data?.nodes || [];
  const linkedNodeIds: NodeId[] = Object.values(node?.data?.linkedNodes || {});
  const allChildren: NodeId[] = [...childNodeIds, ...linkedNodeIds];
  const hasChildren: boolean = allChildren.length > 0;

  // Read selection from the editor state
  const selectedSet = useEditor((state: EditorState) => state.events.selected);
  const isSelected: boolean =
    !!selectedSet && selectedSet instanceof Set && selectedSet.has(nodeId);

  const handleSelect = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isSelected) {
      actions.selectNode(undefined);
    } else {
      actions.selectNode(nodeId);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setEditingName(true);
  };

  const handleNameSave = () => {
    actions.setCustom(nodeId, (custom: Record<string, any>) => {
      custom.displayName = tempName;
    });
    setEditingName(false);
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!isRoot) {
      actions.delete(nodeId);
    }
  };

  return (
    <div
      style={{
        background: isSelected ? '#ffffff' : '#f8f8f5',
        border: isSelected ? '2px solid #615dfa' : '1px solid #e0e0df',
        borderRadius: '8px',
        marginBottom: '8px',
        marginLeft: depth * 16,
        padding: '12px',
        boxShadow: isSelected ? '0 2px 10px rgba(0,0,0,0.15)' : 'none',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
      onClick={handleSelect}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {!editingName ? (
          <span
            style={{
              fontWeight: 500,
              fontSize: '0.95rem',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            onDoubleClick={handleDoubleClick}
          >
            {displayName}
          </span>
        ) : (
          <input
            autoFocus
            style={{
              flex: 1,
              fontSize: '0.95rem',
              marginRight: 6,
              borderRadius: 4,
              border: '1px solid #bbb',
              padding: '2px 4px',
            }}
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleNameSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNameSave();
            }}
          />
        )}

        <div style={{ display: 'flex', gap: 6 }}>
          {hasChildren && !isRoot && (
            <button
              style={{
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '2px 6px',
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? '−' : '+'}
            </button>
          )}
          {!isRoot && (
            <button
              style={{
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '2px 6px',
                cursor: 'pointer',
              }}
              onClick={handleDelete}
            >
              🗑
            </button>
          )}
        </div>
      </div>

      {expanded &&
        allChildren.map((childId) => (
          <ChildLayerItem key={childId} nodeId={childId} depth={depth + 1} />
        ))}
    </div>
  );
};

export const Layer: React.FC = () => {
  // Removed "selected" from the collector because we won't use it here
  const {
    id,
    depth,
    expanded,
    actions: layerActions,
    connectors: { layer, layerHeader },
  } = useLayer((lyr: any) => ({
    id: lyr.id,
    depth: lyr.depth,
    expanded: lyr.expanded,
  }));

  const { actions, query } = useEditor();
  const nodeData = query.node(id).get();
  const isRoot: boolean = id === ROOT_NODE;
  const displayName: string =
    (nodeData?.data?.custom?.displayName as string) || id;

  // Local rename state
  const [editingName, setEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(displayName);

  // Gather child nodes
  const childNodeIds: NodeId[] = nodeData?.data?.nodes || [];
  const linkedNodeIds: NodeId[] = Object.values(
    nodeData?.data?.linkedNodes || {}
  );
  const allChildren: NodeId[] = [...childNodeIds, ...linkedNodeIds];
  const hasChildren: boolean = allChildren.length > 0;

  // Check if this node is selected by reading from the set
  const selectedSet = useEditor((state: EditorState) => state.events.selected);
  const isSelected: boolean =
    !!selectedSet && selectedSet instanceof Set && selectedSet.has(id);

  const handleSelect = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isSelected) {
      actions.selectNode(undefined);
    } else {
      actions.selectNode(id);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setEditingName(true);
  };

  const handleNameSave = () => {
    actions.setCustom(id, (custom: Record<string, any>) => {
      custom.displayName = tempName;
    });
    setEditingName(false);
  };

  return (
    <div
      ref={(el) => {
        if (el) layer(el);
      }}
      style={{
        background: isSelected ? '#ffffff' : '#f8f8f5',
        border: isSelected ? '2px solid #615dfa' : '1px solid #e0e0df',
        borderRadius: '8px',
        marginBottom: '8px',
        marginLeft: (depth ?? 0) * 16,
        padding: '12px',
        boxShadow: isSelected ? '0 2px 10px rgba(0,0,0,0.15)' : 'none',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
      onClick={handleSelect}
    >
      <div
        ref={(el) => {
          if (el) layerHeader(el);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {!editingName ? (
          <span
            style={{
              fontWeight: 500,
              fontSize: '0.95rem',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            onDoubleClick={handleDoubleClick}
          >
            {displayName}
          </span>
        ) : (
          <input
            autoFocus
            style={{
              flex: 1,
              fontSize: '0.95rem',
              marginRight: 6,
              borderRadius: 4,
              border: '1px solid #bbb',
              padding: '2px 4px',
            }}
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleNameSave}
            onKeyDown={(evt) => {
              if (evt.key === 'Enter') handleNameSave();
            }}
          />
        )}

        <div style={{ display: 'flex', gap: 6 }}>
          {/* If root or no children, skip expand/collapse */}
          {hasChildren && !isRoot && (
            <button
              style={{
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '2px 6px',
                cursor: 'pointer',
              }}
              onClick={(evt) => {
                evt.stopPropagation();
                layerActions.toggleLayer();
              }}
            >
              {expanded ? '−' : '+'}
            </button>
          )}
          {!isRoot && (
            <button
              style={{
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '2px 6px',
                cursor: 'pointer',
              }}
              onClick={(evt) => {
                evt.stopPropagation();
                actions.delete(id);
              }}
            >
              🗑
            </button>
          )}
        </div>
      </div>

      {/* If expanded, forcibly show child layers */}
      {expanded &&
        allChildren.map((childId) => (
          <ChildLayerItem
            key={childId}
            nodeId={childId}
            depth={(depth ?? 0) + 1}
          />
        ))}
    </div>
  );
};
