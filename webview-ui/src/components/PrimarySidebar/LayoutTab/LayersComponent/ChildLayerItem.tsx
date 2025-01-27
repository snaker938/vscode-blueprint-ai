import React, { useState } from 'react';
import { useEditor, NodeId } from '@craftjs/core';
import { ROOT_NODE } from '@craftjs/utils';
import { useSelectedIds } from './useSelectedIds';

interface ChildLayerItemProps {
  nodeId: NodeId;
  depth: number;
}

export const ChildLayerItem: React.FC<ChildLayerItemProps> = ({
  nodeId,
  depth,
}) => {
  const { actions, query } = useEditor();
  const node = query.node(nodeId).get();
  const isRoot = nodeId === ROOT_NODE;
  const displayName = (node?.data?.custom?.displayName as string) || nodeId;

  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(displayName);

  const childIds = node?.data?.nodes || [];
  const linkedNodeIds = Object.values(node?.data?.linkedNodes || {});
  const allChildren: NodeId[] = [...childIds, ...linkedNodeIds];
  const hasChildren = allChildren.length > 0;

  const [localExpanded, setLocalExpanded] = useState<boolean>(false);

  const selectedIds = useSelectedIds();
  const isSelected = selectedIds.includes(nodeId);

  function handleSelect(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    if (isSelected) {
      actions.selectNode([]);
    } else {
      actions.selectNode([nodeId]);
    }
  }

  function handleDoubleClick(e: React.MouseEvent<HTMLSpanElement>) {
    e.stopPropagation();
    setEditingName(true);
  }

  function handleNameSave() {
    actions.setCustom(nodeId, (custom) => {
      custom.displayName = tempName;
    });
    setEditingName(false);
  }

  function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (!isRoot) actions.delete(nodeId);
  }

  return (
    <div
      style={{
        background: isSelected ? '#fff' : '#f8f8f5',
        border: isSelected ? '2px solid #615dfa' : '1px solid #e0e0df',
        borderRadius: 8,
        marginLeft: depth * 16,
        marginBottom: 8,
        padding: 12,
        boxShadow: isSelected ? '0 2px 10px rgba(0,0,0,0.15)' : 'none',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
      onClick={handleSelect}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
            onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
          />
        )}

        <div style={{ display: 'flex', gap: 6 }}>
          {hasChildren && (
            <button
              style={{
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: 4,
                padding: '2px 6px',
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.stopPropagation();
                setLocalExpanded(!localExpanded);
              }}
            >
              {localExpanded ? '−' : '+'}
            </button>
          )}
          {!isRoot && (
            <button
              style={{
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: 4,
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

      {localExpanded &&
        allChildren.map((cid) => (
          <ChildLayerItem key={cid} nodeId={cid} depth={depth + 1} />
        ))}
    </div>
  );
};
