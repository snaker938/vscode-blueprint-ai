import React from 'react';
import { useNode } from '@craftjs/core';

/**
 * Craft.js sometimes types `node.related` as a boolean.
 * Otherwise, it's a Record<string, React.ElementType>.
 *
 * This union type extends the string-index map but also
 * lets us have an optional `propertyPanel`.
 */
type NodeRelatedWithPanel =
  | boolean
  | (Record<string, React.ElementType> & {
      propertyPanel?: React.ElementType;
    });

interface ComponentPropertiesBarProps {
  nodeId: string;
}

/**
 * A type guard that checks if `val` is an object
 * (i.e., not `boolean`) and thus may have `propertyPanel`.
 */
function hasPropertyPanel(val: NodeRelatedWithPanel): val is Record<
  string,
  React.ElementType
> & {
  propertyPanel?: React.ElementType;
} {
  // Return true if val is NOT boolean, meaning it's the object shape
  return typeof val === 'object' && val !== null;
}

/**
 * Container for property sections/items.
 */
export const ComponentPropertiesBar: React.FC<ComponentPropertiesBarProps> = ({
  nodeId,
}) => {
  // Use nodeId so it's not flagged as unused
  React.useEffect(() => {
    console.log(`Properties bar is loaded for node: ${nodeId}`);
  }, [nodeId]);

  const { related } = useNode((node) => ({
    // Cast node.related into our union type
    related: node.related as NodeRelatedWithPanel,
  }));

  /**
   * 1. Use our custom type guard: hasPropertyPanel(related).
   *    If true, TypeScript knows `related` is the object type
   *    and might have `propertyPanel`.
   * 2. Then safely check for the propertyPanel before rendering.
   */
  if (hasPropertyPanel(related) && related.propertyPanel) {
    return <>{React.createElement(related.propertyPanel)}</>;
  }

  return (
    <div style={{ padding: '10px', fontSize: '14px', color: '#666' }}>
      <p>No properties for this node.</p>
    </div>
  );
};
