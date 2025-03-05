import React, { useState } from 'react';
import { useLayer } from '@craftjs/layers';
import { useEditor, NodeId } from '@craftjs/core';
import { ROOT_NODE } from '@craftjs/utils';
import { useSelectedIds } from './useSelectedIds';
import { ChildLayerItem } from './ChildLayerItem';

export const Layer: React.FC = () => {
  const {
    id,
    depth,
    expanded,
    actions: layerActions,
    connectors: { layer },
  } = useLayer((lyr: any) => ({
    id: lyr.id,
    depth: lyr.depth,
    expanded: lyr.expanded,
  }));

  const { actions, query } = useEditor();
  const node = query.node(id).get();
  const isRoot = id === ROOT_NODE;
  const customName = (node?.data?.custom?.displayName as string) || id;

  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState<string>(customName);

  const childIds: NodeId[] = node?.data?.nodes || [];
  const linkedNodeIds: NodeId[] = Object.values(node?.data?.linkedNodes || {});
  const allChildren: NodeId[] = [...childIds, ...linkedNodeIds];
  const hasChildren = allChildren.length > 0;

  // Use our forced selection array
  const selectedIds = useSelectedIds();

  // Also check node.events.selected for when user selected from the canvas
  const nodeEventSel = node?.events?.selected;
  const isSelected = selectedIds.includes(id) || nodeEventSel;

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    // Prevent drag or other default events from stealing the selection
    e.preventDefault();
    e.stopPropagation();
    if (isSelected) {
      actions.selectNode([]);
    } else {
      actions.selectNode([id]);
    }
  }

  function handleDoubleClick(e: React.MouseEvent<HTMLSpanElement>) {
    e.stopPropagation();
    setEditingName(true);
  }

  function handleNameSave() {
    actions.setCustom(id, (custom: Record<string, any>) => {
      custom.displayName = tempName;
    });
    setEditingName(false);
  }

  return (
    <div
      ref={(elem) => {
        if (elem) layer(elem);
      }}
      style={{
        background: isSelected ? '#fff' : '#f8f8f5',
        border: isSelected ? '2px solid #615dfa' : '1px solid #e0e0df',
        borderRadius: 8,
        marginBottom: 8,
        marginLeft: (depth ?? 0) * 16,
        padding: 12,
        boxShadow: isSelected ? '0 2px 10px rgba(0,0,0,0.15)' : 'none',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        userSelect: 'none', // further ensure no accidental text selection
      }}
      // Switch from onClick to onMouseDown so we hold selection after mouse release
      onMouseDown={handleMouseDown}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {!editingName ? (
          <span
            style={{
              flex: 1,
              fontWeight: 500,
              fontSize: '0.95rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            onDoubleClick={handleDoubleClick}
          >
            {tempName}
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
          {hasChildren && (
            <button
              style={{
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: 4,
                padding: '2px 6px',
                cursor: 'pointer',
              }}
              onMouseDown={(evt) => {
                evt.stopPropagation();
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
                borderRadius: 4,
                padding: '2px 6px',
                cursor: 'pointer',
              }}
              onMouseDown={(evt) => {
                evt.stopPropagation();
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

      {expanded &&
        allChildren.map((cid) => (
          <ChildLayerItem key={cid} nodeId={cid} depth={(depth ?? 0) + 1} />
        ))}
    </div>
  );
};
