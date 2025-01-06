/**
 * The AI output typically looks like:
 *
 * {
 *   "layout": {
 *     "type": "Container",
 *     "props": { ... },
 *     "children": [
 *       { "type": "Heading", "props": {...}, "children": [...] },
 *       ...
 *     ]
 *   }
 * }
 *
 * Where each node has:
 *   type: string;      // e.g. "Button", "Container", ...
 *   props?: object;    // e.g. style, text, color, data, etc.
 *   children?: AiNode[];
 */
interface AiNode {
  type: string;
  props?: Record<string, any>;
  children?: AiNode[];
}

/**
 * The top-level AI response: { layout: AiNode }
 */
interface AiResponse {
  layout: AiNode;
}

/**
 * CraftSerializedTree is the shape recognized by CraftJS's query.deserialize(...) or <Frame data={...} />
 * Example:
 * {
 *   "rootNodeId": "node-1",
 *   "nodes": {
 *     "node-1": {
 *       type: { resolvedName: "Container" },
 *       displayName: "Container",
 *       props: {...},
 *       parent: "ROOT",
 *       children: ["node-2", "node-3"],
 *       isCanvas: false,
 *       custom: {},
 *       hidden: false,
 *       linkedNodes: {}
 *     },
 *     ...
 *   }
 * }
 */
export interface CraftSerializedTree {
  rootNodeId: string;
  nodes: Record<string, CraftNode>;
}

/**
 * One node in the CraftJS serialized tree
 */
interface CraftNode {
  type: {
    resolvedName: string; // e.g. "Container", "Button", etc.
  };
  displayName: string;
  props: Record<string, any>;
  parent: string; // "ROOT" or another node ID
  children: string[];
  isCanvas: boolean;
  custom: Record<string, any>;
  hidden: boolean;
  linkedNodes: Record<string, any>;
}

/**
 * parseAiOutput: Convert the AI's JSON string into a CraftJS-serialized tree.
 * @param aiString The raw JSON string from AI
 * @returns A CraftSerializedTree or null if parsing fails
 */
export function parseAiOutput(aiString: string): CraftSerializedTree | null {
  let parsed: AiResponse;
  try {
    parsed = JSON.parse(aiString);
  } catch (err) {
    console.error('parseAiOutput: Failed to parse AI output as JSON:', err);
    return null;
  }

  if (!parsed.layout) {
    console.error("parseAiOutput: Missing 'layout' root in the AI output");
    return null;
  }

  // We'll store all nodes in a map keyed by nodeId
  const nodes: Record<string, CraftNode> = {};

  // We'll produce incremental IDs for each node
  let nodeIdCounter = 1;
  function generateId() {
    return `node-${nodeIdCounter++}`;
  }

  /**
   * convertAiNodeToCraft:
   * Recursively convert an AiNode into a CraftJS node + children
   * @param aiNode One node from the AI layout
   * @param parentId The parent craft node ID, or "ROOT" if none
   * @returns The newly created node ID
   */
  function convertAiNodeToCraft(aiNode: AiNode, parentId: string): string {
    // Generate an ID
    const nodeId = generateId();

    // Construct the base craft node
    const craftNode: CraftNode = {
      type: { resolvedName: aiNode.type },
      displayName: aiNode.type,
      props: aiNode.props || {},
      parent: parentId,
      children: [],
      isCanvas: false, // If you want, you can set to true for certain "Container" nodes
      custom: {},
      hidden: false,
      linkedNodes: {},
    };

    // If the node has children, recursively convert them
    if (Array.isArray(aiNode.children)) {
      for (const child of aiNode.children) {
        const childId = convertAiNodeToCraft(child, nodeId);
        craftNode.children.push(childId);
      }
    }

    // Add this node to the map
    nodes[nodeId] = craftNode;
    return nodeId;
  }

  // 1) Convert the root node with parent = "ROOT"
  const rootId = convertAiNodeToCraft(parsed.layout, 'ROOT');

  // 2) Build final structure
  const serialized: CraftSerializedTree = {
    rootNodeId: rootId,
    nodes,
  };

  return serialized;
}
