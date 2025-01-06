// import { FC, useState, useRef, useCallback } from 'react';
// import { Stage, Layer, Rect, Ellipse, Text } from 'react-konva';
// import { IconButton, Button, Label, Slider } from '@fluentui/react';
// import './SelectedFeatureSketch.css';

// import { SwatchColorPicker } from '@fluentui/react/lib/SwatchColorPicker';

// /**
//  * @interface IColorCell
//  * @description Represents a single color option in the SwatchColorPicker.
//  * @property {string} id - A unique identifier for the color cell.
//  * @property {string} color - The hex code of the color.
//  * @property {string} [label] - An optional label for the color.
//  * @property {number} [index] - An optional index for ordering the color cells.
//  */
// interface IColorCell {
//   id: string;
//   color: string;
//   label?: string;
//   index?: number;
// }

// /**
//  * @constant {IColorCell[]} colors
//  * @description An array of color cells representing the available colors for the shapes.
//  * Each color can be selected through the UI and applied to a shape.
//  * @property {string} id - A unique identifier for the color.
//  * @property {string} color - The hex code of the color.
//  */
// const colors: IColorCell[] = [
//   { id: 'black', color: '#000000' },
//   { id: 'blue', color: '#0078d4' },
//   { id: 'red', color: '#e81123' },
//   { id: 'green', color: '#107c10' },
//   { id: 'yellow', color: '#ffb900' },
//   { id: 'purple', color: '#5c2d91' },
//   { id: 'gray', color: '#8a8886' },
//   { id: 'white', color: '#ffffff' },
// ];

// /**
//  * @typedef {object} SketchShape
//  * @property {string} id - Unique ID for the shape.
//  * @property {'rect' | 'ellipse' | 'text'} type - The type of shape.
//  * @property {number} x - The x-position on the canvas.
//  * @property {number} y - The y-position on the canvas.
//  * @property {number} width - The width of the shape (not applicable to text, text uses fontSize).
//  * @property {number} height - The height of the shape.
//  * @property {string} borderColor - The border (stroke) color of the shape.
//  * @property {number} strokeWidth - The thickness of the shape's border (stroke).
//  * @property {string} [textValue] - The text content if the shape is of type 'text'.
//  * @property {number} [fontSize] - The font size if the shape is text.
//  * @property {number} rotation - Rotation angle in degrees.
//  * @property {boolean} visible - Whether the shape is visible.
//  * @property {string} name - A name for the shape (used in layers).
//  * @description Represents the data structure for each shape object on the Stage.
//  */
// interface SketchShape {
//   id: string;
//   type: 'rect' | 'ellipse' | 'text';
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   borderColor: string;
//   strokeWidth: number;
//   textValue?: string;
//   fontSize?: number;
//   rotation: number;
//   visible: boolean;
//   name: string;
// }

// /**
//  * @typedef {object} LayerNode
//  * @property {string} id - Unique ID of the shape/layer node.
//  * @property {string} name - Name of the shape/layer node, can be edited by the user.
//  * @property {'rect'|'ellipse'|'text'} type - Type of the shape node.
//  * @property {boolean} visible - Whether this shape node is visible.
//  * @property {LayerNode[]} children - Any child nodes fully contained by this shape.
//  * @description Represents a single node in the hierarchical layers panel.
//  */
// interface LayerNode {
//   id: string;
//   name: string;
//   type: 'rect' | 'ellipse' | 'text';
//   visible: boolean;
//   children: LayerNode[];
// }

// /**
//  * @typedef {object} UndoRedoAction
//  * @property {string} type - The type of action, e.g., 'add', 'edit', 'transform', 'delete', etc.
//  * @property {Partial<SketchShape>} payload - Information needed to undo or redo the action.
//  */
// interface UndoRedoAction {
//   type: string;
//   payload: Partial<SketchShape> & {
//     prevState?: SketchShape;
//     newState?: SketchShape;
//   };
// }

// interface SelectedFeatureSketchProps {
//   /**
//    * @description An optional array of initial shapes to load onto the canvas when the component mounts.
//    * If not provided, the canvas will start empty.
//    */
//   initialShapes?: SketchShape[];

//   /**
//    * @description The width of the canvas stage. Defaults to 800 if not provided.
//    */
//   width?: number;

//   /**
//    * @description The height of the canvas stage. Defaults to 600 if not provided.
//    */
//   height?: number;

//   /**
//    * @description A callback function that is called whenever the shapes on the canvas change (e.g., shape added, moved, resized).
//    * It receives the updated array of shapes as an argument.
//    */
//   onShapesChange?: (shapes: SketchShape[]) => void;

//   /**
//    * @description The initial color to use for newly created shapes.
//    * Defaults to black if not provided.
//    */
//   initialColor?: string;

//   /**
//    * @description The initial font size to use for newly created text shapes.
//    * Defaults to 16 if not provided.
//    */
//   initialFontSize?: number;

//   /**
//    * @description The initial thickness (e.g. stroke width) to apply to shapes that support it.
//    * Defaults to 2 if not provided.
//    */
//   initialThickness?: number;
// }

// /**
//  * @function SelectedFeatureSketch
//  * @description The main component that renders the entire UI: a layers sidebar, a main canvas area, and a top toolbar.
//  * It manages state for the currently selected shape, the list of all shapes, their hierarchy, and the undo/redo stacks.
//  * @param {SelectedFeatureSketchProps} props - The component props.
//  * @returns {JSX.Element} The rendered SelectedFeatureSketch component.
//  */
// export const SelectedFeatureSketch: FC<SelectedFeatureSketchProps> = (
//   props
// ) => {
//   /**
//    * State Declarations:
//    *
//    * shapes: An array of all the shapes currently placed on the canvas.
//    *         Each shape includes properties like id, type, coordinates,
//    *         dimensions, borderColor, rotation, visibility, and name.
//    *
//    * selectedShapeId: The ID of the currently selected shape. If null, no shape is selected.
//    *
//    * currentColor: The currently selected color to apply to new or selected shapes.
//    *
//    * currentFontSize: The currently selected font size for new or selected text shapes.
//    *
//    * currentThickness: The currently selected thickness (e.g. stroke width) for shapes that support it.
//    *
//    * layerStructure: The hierarchical representation of shapes in layers. This structure shows
//    *                 parent-child relationships where shapes contained within another shape are its children.
//    *
//    * undoStack: A stack of actions that have been performed, for use in undo operations.
//    *
//    * redoStack: A stack of actions that have been undone, for use in redo operations.
//    */
//   const [shapes, setShapes] = useState<SketchShape[]>([]);
//   const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
//   const [currentColor, setCurrentColor] = useState<string>('#000000');
//   const [currentFontSize, setCurrentFontSize] = useState<number>(16);
//   const [currentThickness, setCurrentThickness] = useState<number>(2);
//   const [layerStructure, setLayerStructure] = useState<LayerNode[]>([]);
//   const [undoStack, setUndoStack] = useState<UndoRedoAction[]>([]);
//   const [redoStack, setRedoStack] = useState<UndoRedoAction[]>([]);

//   /**
//    * @ref {React.RefObject<any>} stageRef
//    * @description A reference to the Konva Stage component, used for measurements and coordinate transformations.
//    */
//   const stageRef = useRef<any>(null);

//   /**
//    * @function updateLayerStructure
//    * @description Rebuilds the layerStructure array based on current shapes and their containment.
//    * @returns {void}
//    */
//   const updateLayerStructure = useCallback((): void => {
//     // Intended: Determine which shapes contain others, build tree, and store in layerStructure state.
//   }, []);

//   /**
//    * @function addRectangle
//    * @description Adds a new rectangle shape to the canvas.
//    * @param {number} x - The x-position where the rectangle should be placed.
//    * @param {number} y - The y-position where the rectangle should be placed.
//    * @returns {void}
//    */
//   const addRectangle = useCallback(
//     (x: number, y: number): void => {
//       // Create a unique ID for the shape
//       const newShape: SketchShape = {
//         id: 'shape_' + Date.now().toString(),
//         type: 'rect',
//         x,
//         y,
//         width: 100,
//         height: 100,
//         borderColor: currentColor,
//         rotation: 0,
//         visible: true,
//         name: `Rectangle ${shapes.length + 1}`,
//         strokeWidth: currentThickness,
//       };

//       // Add the new rectangle to the shapes array
//       setShapes((prev) => {
//         const updatedShapes = [...prev, newShape];
//         // Push undo action for adding this shape
//         setUndoStack((prevUndo) => [
//           ...prevUndo,
//           { type: 'add', payload: { newState: newShape } },
//         ]);
//         // Clear the redo stack since we performed a new action
//         setRedoStack([]);
//         // If there's a callback for shapes change, call it
//         props.onShapesChange?.(updatedShapes);
//         return updatedShapes;
//       });

//       // Update the layer structure after adding the shape
//       updateLayerStructure();
//     },
//     [
//       currentColor,
//       currentThickness,
//       shapes,
//       props,
//       setShapes,
//       setUndoStack,
//       setRedoStack,
//       updateLayerStructure,
//     ]
//   );

//   /**
//    * @function addEllipse
//    * @description Adds a new ellipse shape to the canvas.
//    * @param {number} x - The x-position where the ellipse should be placed.
//    * @param {number} y - The y-position where the ellipse should be placed.
//    * @returns {void}
//    */
//   const addEllipse = useCallback(
//     (x: number, y: number): void => {
//       // Create a unique ID for the shape
//       const newShape: SketchShape = {
//         id: 'shape_' + Date.now().toString(),
//         type: 'ellipse',
//         x,
//         y,
//         width: 100,
//         height: 100,
//         borderColor: currentColor,
//         rotation: 0,
//         visible: true,
//         name: `Ellipse ${shapes.length + 1}`,
//         strokeWidth: currentThickness,
//       };

//       // Add the new ellipse to the shapes array
//       setShapes((prev) => {
//         const updatedShapes = [...prev, newShape];
//         // Push undo action for adding this shape
//         setUndoStack((prevUndo) => [
//           ...prevUndo,
//           { type: 'add', payload: { newState: newShape } },
//         ]);
//         // Clear the redo stack since we performed a new action
//         setRedoStack([]);
//         // If there's a callback for shapes change, call it
//         props.onShapesChange?.(updatedShapes);
//         return updatedShapes;
//       });

//       // Update the layer structure after adding the shape
//       updateLayerStructure();
//     },
//     [
//       currentColor,
//       currentThickness,
//       shapes,
//       props,
//       setShapes,
//       setUndoStack,
//       setRedoStack,
//       updateLayerStructure,
//     ]
//   );

//   /**
//    * @function addText
//    * @description Adds a new text shape to the canvas.
//    * @param {number} x - The x-position where the text should be placed.
//    * @param {number} y - The y-position where the text should be placed.
//    * @param {string} initialText - The initial text content.
//    * @returns {void}
//    */
//   const addText = useCallback(
//     (x: number, y: number, initialText: string): void => {
//       // Create a unique ID for the shape
//       // For text, if you want it outlined, use borderColor as stroke and strokeWidth.
//       // If you prefer filled text, you could treat borderColor as fillColor or handle text differently.
//       // Here, we'll treat it as outlined text for consistency.
//       const newShape: SketchShape = {
//         id: 'shape_' + Date.now().toString(),
//         type: 'text',
//         x,
//         y,
//         width: 0, // Not used for text
//         height: 0, // Not used for text
//         borderColor: currentColor,
//         rotation: 0,
//         visible: true,
//         name: `Text ${shapes.length + 1}`,
//         textValue: initialText,
//         fontSize: currentFontSize,
//         strokeWidth: currentThickness,
//       };

//       // Add the new text shape to the shapes array
//       setShapes((prev) => {
//         const updatedShapes = [...prev, newShape];
//         // Push undo action for adding this shape
//         setUndoStack((prevUndo) => [
//           ...prevUndo,
//           { type: 'add', payload: { newState: newShape } },
//         ]);
//         // Clear the redo stack since we performed a new action
//         setRedoStack([]);
//         // If there's a callback for shapes change, call it
//         props.onShapesChange?.(updatedShapes);
//         return updatedShapes;
//       });

//       // Update the layer structure after adding the shape
//       updateLayerStructure();
//     },
//     [
//       currentColor,
//       currentFontSize,
//       currentThickness,
//       shapes,
//       props,
//       setShapes,
//       setUndoStack,
//       setRedoStack,
//       updateLayerStructure,
//     ]
//   );

//   /**
//    * @function selectShape
//    * @description Selects a shape given its ID, highlighting it and enabling transformation handles.
//    * @param {string | null} shapeId - The ID of the shape to select, or null to clear selection.
//    * @returns {void}
//    */
//   const selectShape = useCallback(
//     (shapeId: string | null): void => {
//       // If a shapeId is provided, select that shape; if null, clear selection
//       setSelectedShapeId(shapeId);
//       // Selecting a shape might also involve updating UI or enabling transform handles,
//       // but here we assume the presence of a Konva.Transformer elsewhere in the code that
//       // appears when selectedShapeId is set.
//     },
//     [setSelectedShapeId]
//   );

//   /**
//    * @function transformShape
//    * @description Applies a transformation (move, rotate, resize) to a shape.
//    * @param {string} shapeId - The ID of the shape to transform.
//    * @param {Partial<SketchShape>} updates - The properties to update, such as x, y, width, height, rotation.
//    * @returns {void}
//    */
//   const transformShape = useCallback(
//     (shapeId: string, updates: Partial<SketchShape>): void => {
//       setShapes((prevShapes) => {
//         const index = prevShapes.findIndex((s) => s.id === shapeId);
//         if (index === -1) return prevShapes;

//         const oldShape = prevShapes[index];
//         const newShape = { ...oldShape, ...updates };
//         const updatedShapes = [...prevShapes];
//         updatedShapes[index] = newShape;

//         // Push undo action for transform
//         setUndoStack((prevUndo) => [
//           ...prevUndo,
//           {
//             type: 'transform',
//             payload: { prevState: oldShape, newState: newShape },
//           },
//         ]);
//         // Clear redo stack on new action
//         setRedoStack([]);
//         // Callback if available
//         props.onShapesChange?.(updatedShapes);

//         // Update layer structure after transform
//         updateLayerStructure();
//         return updatedShapes;
//       });
//     },
//     [props, setShapes, setUndoStack, setRedoStack, updateLayerStructure]
//   );

//   /**
//    * @function editShapeText
//    * @description Edits the text content of a text shape.
//    * @param {string} shapeId - The ID of the text shape to edit.
//    * @param {string} newText - The new text content.
//    * @returns {void}
//    */
//   const editShapeText = useCallback(
//     (shapeId: string, newText: string): void => {
//       setShapes((prevShapes) => {
//         const index = prevShapes.findIndex(
//           (s) => s.id === shapeId && s.type === 'text'
//         );
//         if (index === -1) return prevShapes;

//         const oldShape = prevShapes[index];
//         const newShape = { ...oldShape, textValue: newText };
//         const updatedShapes = [...prevShapes];
//         updatedShapes[index] = newShape;

//         // Push undo action for editing text
//         setUndoStack((prevUndo) => [
//           ...prevUndo,
//           {
//             type: 'edit',
//             payload: { prevState: oldShape, newState: newShape },
//           },
//         ]);
//         // Clear redo stack on new action
//         setRedoStack([]);
//         // Callback if available
//         props.onShapesChange?.(updatedShapes);

//         // Update layer structure after text edit
//         updateLayerStructure();
//         return updatedShapes;
//       });
//     },
//     [props, setShapes, setUndoStack, setRedoStack, updateLayerStructure]
//   );

//   /**
//    * @function changeShapeColor
//    * @description Changes the border color of a given shape.
//    * @param {string} shapeId - The ID of the shape to recolor.
//    * @param {string} newColor - The new color to apply.
//    * @returns {void}
//    */
//   const changeShapeColor = useCallback(
//     (shapeId: string, newColor: string): void => {
//       setShapes((prevShapes) => {
//         const index = prevShapes.findIndex((s) => s.id === shapeId);
//         if (index === -1) return prevShapes;

//         const oldShape = prevShapes[index];
//         const newShape = { ...oldShape, strokeColor: newColor };
//         const updatedShapes = [...prevShapes];
//         updatedShapes[index] = newShape;

//         // Push undo action for color change
//         setUndoStack((prevUndo) => [
//           ...prevUndo,
//           {
//             type: 'color',
//             payload: { prevState: oldShape, newState: newShape },
//           },
//         ]);
//         // Clear redo stack on new action
//         setRedoStack([]);
//         // Callback if available
//         props.onShapesChange?.(updatedShapes);

//         // Update layer structure after color change
//         updateLayerStructure();
//         return updatedShapes;
//       });
//     },
//     [props, setShapes, setUndoStack, setRedoStack, updateLayerStructure]
//   );

//   /**
//    * @function changeShapeFontSize
//    * @description Changes the font size of a text shape.
//    * @param {string} shapeId - The ID of the text shape to resize.
//    * @param {number} newFontSize - The new font size.
//    * @returns {void}
//    */
//   const changeShapeFontSize = useCallback(
//     (shapeId: string, newFontSize: number): void => {
//       setShapes((prevShapes) => {
//         const index = prevShapes.findIndex(
//           (s) => s.id === shapeId && s.type === 'text'
//         );
//         if (index === -1) return prevShapes;

//         const oldShape = prevShapes[index];
//         const newShape = { ...oldShape, fontSize: newFontSize };
//         const updatedShapes = [...prevShapes];
//         updatedShapes[index] = newShape;

//         // Push undo action for font size change
//         setUndoStack((prevUndo) => [
//           ...prevUndo,
//           {
//             type: 'fontSize',
//             payload: { prevState: oldShape, newState: newShape },
//           },
//         ]);
//         // Clear redo stack on new action
//         setRedoStack([]);
//         // Callback if available
//         props.onShapesChange?.(updatedShapes);

//         // Update layer structure after font size change
//         updateLayerStructure();
//         return updatedShapes;
//       });
//     },
//     [props, setShapes, setUndoStack, setRedoStack, updateLayerStructure]
//   );

//   /**
//    * @function changeShapeThickness
//    * @description Changes the thickness (e.g. stroke width) of a shape.
//    * @param {string} shapeId - The ID of the shape to update.
//    * @param {number} newThickness - The new thickness value.
//    * @returns {void}
//    */
//   const changeShapeThickness = useCallback(
//     (shapeId: string, newThickness: number): void => {
//       // For shapes that support thickness (rect, ellipse), we now rely on strokeWidth.
//       setShapes((prevShapes) => {
//         const index = prevShapes.findIndex(
//           (s) => s.id === shapeId && (s.type === 'rect' || s.type === 'ellipse')
//         );
//         if (index === -1) return prevShapes;

//         const oldShape = prevShapes[index];
//         const newShape = { ...oldShape, strokeWidth: newThickness };
//         const updatedShapes = [...prevShapes];
//         updatedShapes[index] = newShape;

//         // Push undo action for thickness change
//         setUndoStack((prevUndo) => [
//           ...prevUndo,
//           {
//             type: 'thickness',
//             payload: { prevState: oldShape, newState: newShape },
//           },
//         ]);
//         // Clear redo stack on new action
//         setRedoStack([]);
//         // Callback if available
//         props.onShapesChange?.(updatedShapes);

//         // Update layer structure after thickness change
//         updateLayerStructure();
//         return updatedShapes;
//       });
//     },
//     [props, setShapes, setUndoStack, setRedoStack, updateLayerStructure]
//   );

//   /**
//    * @function undo
//    * @description Undoes the last action performed, if any.
//    * @returns {void}
//    */
//   const undo = useCallback((): void => {
//     setUndoStack((prevUndo) => {
//       if (prevUndo.length === 0) return prevUndo;

//       const action = prevUndo[prevUndo.length - 1];
//       const newUndo = prevUndo.slice(0, -1);

//       // Apply inverse changes based on action type
//       setShapes((prevShapes) => {
//         let updatedShapes = prevShapes;
//         if (action.type === 'add' && action.payload.newState) {
//           // Undo 'add': remove the newly added shape
//           updatedShapes = prevShapes.filter(
//             (s) => s.id !== action.payload.newState?.id
//           );
//         } else if (
//           (action.type === 'transform' ||
//             action.type === 'edit' ||
//             action.type === 'color' ||
//             action.type === 'fontSize' ||
//             action.type === 'thickness') &&
//           action.payload.prevState
//         ) {
//           // Undo these: revert to prevState
//           updatedShapes = prevShapes.map((s) =>
//             s.id === action.payload.prevState?.id
//               ? action.payload.prevState!
//               : s
//           );
//         }
//         // If there's a callback for shapes change, call it
//         props.onShapesChange?.(updatedShapes);
//         updateLayerStructure();
//         return updatedShapes;
//       });

//       // Push this action onto redoStack
//       setRedoStack((prevRedo) => [...prevRedo, action]);

//       return newUndo;
//     });
//   }, [props, updateLayerStructure, setShapes, setUndoStack, setRedoStack]);

//   /**
//    * @function redo
//    * @description Redoes the last undone action, if any.
//    * @returns {void}
//    */
//   const redo = useCallback((): void => {
//     setRedoStack((prevRedo) => {
//       if (prevRedo.length === 0) return prevRedo;

//       const action = prevRedo[prevRedo.length - 1];
//       const newRedo = prevRedo.slice(0, -1);

//       // Re-apply changes
//       setShapes((prevShapes) => {
//         let updatedShapes = prevShapes;
//         if (action.type === 'add' && action.payload.newState) {
//           // Redo 'add': add the shape again
//           updatedShapes = [...prevShapes, action.payload.newState];
//         } else if (
//           (action.type === 'transform' ||
//             action.type === 'edit' ||
//             action.type === 'color' ||
//             action.type === 'fontSize' ||
//             action.type === 'thickness') &&
//           action.payload.newState
//         ) {
//           // Redo these: apply newState
//           updatedShapes = prevShapes.map((s) =>
//             s.id === action.payload.newState?.id ? action.payload.newState! : s
//           );
//         }
//         // If there's a callback for shapes change, call it
//         props.onShapesChange?.(updatedShapes);
//         updateLayerStructure();
//         return updatedShapes;
//       });

//       // Push this action onto undoStack
//       setUndoStack((prevUndo) => [...prevUndo, action]);

//       return newRedo;
//     });
//   }, [props, updateLayerStructure, setShapes, setUndoStack, setRedoStack]);

//   /**
//    * @function determineParentChildRelationships
//    * @description Determines which shapes are fully contained by others to establish parent-child relationships.
//    * @returns {void}
//    */
//   const determineParentChildRelationships = useCallback((): void => {
//     // To determine parent-child relationships, we can consider the bounding boxes of each shape.
//     // A shape A is considered a parent of shape B if the bounding box of B is fully contained within A's bounding box.
//     // For rectangles and ellipses, we have x, y, width, and height.
//     // For ellipses, x,y is center and width/height are the full width/height, so bounding box is straightforward.
//     // For text, we must guess bounding box based on text length and fontSize.
//     // In this example, we will make a simplifying assumption:
//     //   For text, approximate the bounding box as:
//     //   width = (textValue?.length ?? 1) * (fontSize ?? 16) * 0.6
//     //   height = fontSize ?? 16
//     // Rotation is ignored for simplicity, considering only axis-aligned bounding boxes.

//     function getBoundingBox(shape: SketchShape) {
//       let left: number;
//       let top: number;
//       let right: number;
//       let bottom: number;

//       if (shape.type === 'rect') {
//         left = shape.x;
//         top = shape.y;
//         right = shape.x + shape.width;
//         bottom = shape.y + shape.height;
//       } else if (shape.type === 'ellipse') {
//         // For ellipse, x,y is the center, width/height are total
//         left = shape.x - shape.width / 2;
//         top = shape.y - shape.height / 2;
//         right = shape.x + shape.width / 2;
//         bottom = shape.y + shape.height / 2;
//       } else {
//         // 'text'
//         const length = shape.textValue ? shape.textValue.length : 1;
//         const fontSize = shape.fontSize ?? 16;
//         const textWidth = length * fontSize * 0.6;
//         const textHeight = fontSize;
//         left = shape.x;
//         top = shape.y;
//         right = shape.x + textWidth;
//         bottom = shape.y + textHeight;
//       }

//       return { left, top, right, bottom };
//     }

//     function isContained(
//       inner: { left: number; top: number; right: number; bottom: number },
//       outer: { left: number; top: number; right: number; bottom: number }
//     ) {
//       return (
//         inner.left >= outer.left &&
//         inner.right <= outer.right &&
//         inner.top >= outer.top &&
//         inner.bottom <= outer.bottom
//       );
//     }

//     // First, compute bounding boxes for all shapes
//     const boundingBoxes = shapes.map((s) => ({
//       shape: s,
//       box: getBoundingBox(s),
//     }));

//     // We will build a hierarchy by determining which shapes are parents of which.
//     // A shape with no parent is a root node. A shape fully inside another is a child.
//     // If multiple shapes contain a shape, choose the one that fits it best. For simplicity, choose the first found.

//     // Determine parent for each shape
//     const parentMap = new Map<string, string | null>(); // shapeId -> parentId
//     shapes.forEach((shape) => parentMap.set(shape.id, null));

//     for (let i = 0; i < boundingBoxes.length; i++) {
//       for (let j = 0; j < boundingBoxes.length; j++) {
//         if (i === j) continue;
//         const inner = boundingBoxes[i];
//         const outer = boundingBoxes[j];

//         // Check if inner is contained by outer
//         if (isContained(inner.box, outer.box)) {
//           // If already has a parent, we could choose the one that is smallest or just skip.
//           // We'll just set the first found parent for simplicity.
//           if (parentMap.get(inner.shape.id) === null) {
//             parentMap.set(inner.shape.id, outer.shape.id);
//           } else {
//             // If multiple containments are found,
//             // you might want a rule to choose the best parent.
//             // For now, do nothing and stick with the first found parent.
//           }
//         }
//       }
//     }

//     // Now we have a parent map. Let's build the layerStructure (tree).
//     function createNode(shape: SketchShape): LayerNode {
//       return {
//         id: shape.id,
//         name: shape.name,
//         type: shape.type,
//         visible: shape.visible,
//         children: [],
//       };
//     }

//     const nodeMap = new Map<string, LayerNode>();
//     shapes.forEach((s) => nodeMap.set(s.id, createNode(s)));

//     // Build hierarchy by adding children to their parents
//     const roots: LayerNode[] = [];
//     nodeMap.forEach((node, id) => {
//       const parentId = parentMap.get(id);
//       if (parentId && nodeMap.has(parentId)) {
//         nodeMap.get(parentId)!.children.push(node);
//       } else {
//         // no parent, this is a root
//         roots.push(node);
//       }
//     });

//     // Update layerStructure state
//     setLayerStructure(roots);
//   }, [shapes, setLayerStructure]);

//   /**
//    * @function determineOverlaps
//    * @description Calculates overlaps between shapes for display in the layers panel (e.g., highlighting or showing overlap percentage).
//    * @returns {void}
//    */
//   const determineOverlaps = useCallback((): void => {
//     // Overlaps can be determined by checking the intersection areas of axis-aligned bounding boxes.
//     // Similar to determineParentChildRelationships, we'll compute bounding boxes for each shape.
//     // For every pair of shapes, we find the overlap area (if any).
//     // We'll then store the total overlap area per shape, and reflect it in the layerStructure nodes.

//     function getBoundingBox(shape: SketchShape) {
//       let left: number;
//       let top: number;
//       let right: number;
//       let bottom: number;

//       if (shape.type === 'rect') {
//         left = shape.x;
//         top = shape.y;
//         right = shape.x + shape.width;
//         bottom = shape.y + shape.height;
//       } else if (shape.type === 'ellipse') {
//         // For ellipse, x,y is the center, width/height are total
//         left = shape.x - shape.width / 2;
//         top = shape.y - shape.height / 2;
//         right = shape.x + shape.width / 2;
//         bottom = shape.y + shape.height / 2;
//       } else {
//         // 'text'
//         const length = shape.textValue ? shape.textValue.length : 1;
//         const fontSize = shape.fontSize ?? 16;
//         const textWidth = length * fontSize * 0.6;
//         const textHeight = fontSize;
//         left = shape.x;
//         top = shape.y;
//         right = shape.x + textWidth;
//         bottom = shape.y + textHeight;
//       }

//       return { left, top, right, bottom };
//     }

//     function intersectionArea(
//       a: { left: number; top: number; right: number; bottom: number },
//       b: { left: number; top: number; right: number; bottom: number }
//     ) {
//       const interLeft = Math.max(a.left, b.left);
//       const interTop = Math.max(a.top, b.top);
//       const interRight = Math.min(a.right, b.right);
//       const interBottom = Math.min(a.bottom, b.bottom);

//       if (interRight > interLeft && interBottom > interTop) {
//         return (interRight - interLeft) * (interBottom - interTop);
//       }
//       return 0;
//     }

//     const boundingBoxes = shapes.map((s) => ({
//       shape: s,
//       box: getBoundingBox(s),
//     }));

//     // We'll compute total overlap area per shape
//     const overlapMap = new Map<string, number>();
//     shapes.forEach((s) => overlapMap.set(s.id, 0));

//     for (let i = 0; i < boundingBoxes.length; i++) {
//       for (let j = i + 1; j < boundingBoxes.length; j++) {
//         const area = intersectionArea(
//           boundingBoxes[i].box,
//           boundingBoxes[j].box
//         );
//         if (area > 0) {
//           // Add this area to both shapes' overlap totals
//           overlapMap.set(
//             boundingBoxes[i].shape.id,
//             overlapMap.get(boundingBoxes[i].shape.id)! + area
//           );
//           overlapMap.set(
//             boundingBoxes[j].shape.id,
//             overlapMap.get(boundingBoxes[j].shape.id)! + area
//           );
//         }
//       }
//     }

//     // Now we have overlap areas per shape. We should reflect this in the layerStructure.
//     // We'll do so by rebuilding the layerStructure with overlap info.
//     // If we want to display overlap info in the layers panel, we might, for example, rename the node to include overlap area.
//     // Or if we want a dedicated field, we could store it in the node. For now, let's append overlap info to node name.

//     function rebuildLayerStructureWithOverlap(nodes: LayerNode[]): LayerNode[] {
//       return nodes.map((node) => {
//         const overlapArea = overlapMap.get(node.id) ?? 0;
//         const newName = `${node.name} (overlap: ${overlapArea})`;
//         return {
//           ...node,
//           name: newName,
//           children: rebuildLayerStructureWithOverlap(node.children),
//         };
//       });
//     }

//     setLayerStructure((prev) => rebuildLayerStructureWithOverlap(prev));
//   }, [shapes, setLayerStructure]);

//   /**
//    * @function renameLayerNode
//    * @description Renames a shape in the layer structure.
//    * @param {string} nodeId - The ID of the layer node to rename.
//    * @param {string} newName - The new name for the node.
//    * @returns {void}
//    */
//   const renameLayerNode = useCallback(
//     (nodeId: string, newName: string): void => {
//       // Find the shape with the given nodeId and update its name
//       setShapes((prevShapes) => {
//         const index = prevShapes.findIndex((s) => s.id === nodeId);
//         if (index === -1) return prevShapes;

//         const oldShape = prevShapes[index];
//         const newShape = { ...oldShape, name: newName };
//         const updatedShapes = [...prevShapes];
//         updatedShapes[index] = newShape;

//         // Since renaming does not affect shape geometry or visibility,
//         // we can treat this like an 'edit' action.
//         setUndoStack((prevUndo) => [
//           ...prevUndo,
//           {
//             type: 'edit',
//             payload: { prevState: oldShape, newState: newShape },
//           },
//         ]);
//         // Clear the redo stack on a new action
//         setRedoStack([]);

//         // If there's a callback for shapes change, call it
//         props.onShapesChange?.(updatedShapes);

//         // Update the layer structure after renaming
//         updateLayerStructure();

//         return updatedShapes;
//       });
//     },
//     [props, setShapes, setUndoStack, setRedoStack, updateLayerStructure]
//   );

//   /**
//    * @function selectLayerNode
//    * @description Selects a shape from the layers panel. This will also select it on the canvas.
//    * @param {string} nodeId - The ID of the layer node (shape) to select.
//    * @returns {void}
//    */
//   const selectLayerNode = useCallback(
//     (nodeId: string): void => {
//       // We assume nodeId corresponds directly to a shape's id.
//       // Just select the shape with the given id.
//       selectShape(nodeId);
//     },
//     [selectShape]
//   );

//   /**
//    * @function toggleVisibility
//    * @description Toggles the visibility of a layer node (shape) and all its children if needed.
//    * @param {string} nodeId - The ID of the node to toggle.
//    * @returns {void}
//    */
//   const toggleVisibility = useCallback(
//     (nodeId: string): void => {
//       // We need to toggle the visibility of the specified node and all its descendants.
//       // To do this, we first need to find the node in layerStructure, gather all descendant IDs,
//       // and then update the shapes accordingly.

//       function findNode(nodes: LayerNode[], id: string): LayerNode | null {
//         for (const n of nodes) {
//           if (n.id === id) return n;
//           const child = findNode(n.children, id);
//           if (child) return child;
//         }
//         return null;
//       }

//       function getDescendantIds(node: LayerNode): string[] {
//         let ids = [node.id];
//         for (const child of node.children) {
//           ids = ids.concat(getDescendantIds(child));
//         }
//         return ids;
//       }

//       const node = findNode(layerStructure, nodeId);
//       if (!node) return;

//       const allIds = getDescendantIds(node);

//       setShapes((prevShapes) => {
//         // Toggle visibility of all these shapes
//         return prevShapes.map((s) => {
//           if (allIds.includes(s.id)) {
//             return { ...s, visible: !s.visible };
//           }
//           return s;
//         });
//       });

//       // After updating shapes, rebuild the layer structure to reflect changes
//       updateLayerStructure();
//     },
//     [layerStructure, updateLayerStructure, setShapes]
//   );

//   return (
//     <div className="app-container">
//       {/* Sidebar Section */}
//       <div className="sidebar-container">
//         <h2 className="sidebar-title">Layers</h2>
//         <div className="sidebar-content">
//           {layerStructure.map((node) => (
//             <div key={node.id} className="sidebar-node">
//               <Button
//                 className="visibility-button"
//                 onClick={() => toggleVisibility(node.id)}
//               >
//                 {node.visible ? '👁️' : '🚫'}
//               </Button>
//               <span
//                 className="layer-name clickable"
//                 onClick={() => selectLayerNode(node.id)}
//               >
//                 {node.name}
//               </span>
//               <IconButton
//                 iconProps={{ iconName: 'Edit' }}
//                 title="Rename Layer"
//                 className="rename-button"
//                 onClick={() => {
//                   const newName = prompt('Enter new name:', node.name);
//                   if (newName) {
//                     renameLayerNode(node.id, newName);
//                   }
//                 }}
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main Canvas and Toolbar Section */}
//       <div className="main-container">
//         <div className="toolbar">
//           <div className="toolbar-section">
//             <Label className="toolbar-label">History</Label>
//             <IconButton
//               iconProps={{ iconName: 'Undo' }}
//               title="Undo"
//               className={`toolbar-button ${
//                 undoStack.length === 0 ? 'disabled' : ''
//               }`}
//               onClick={undo}
//               disabled={undoStack.length === 0}
//             />
//             <IconButton
//               iconProps={{ iconName: 'Redo' }}
//               title="Redo"
//               className={`toolbar-button ${
//                 redoStack.length === 0 ? 'disabled' : ''
//               }`}
//               onClick={redo}
//               disabled={redoStack.length === 0}
//             />
//           </div>

//           <div className="toolbar-section">
//             <Label className="toolbar-label">Add Components</Label>
//             <Button
//               className="toolbar-button"
//               onClick={() => {
//                 const pos = stageRef.current?.getPointerPosition() || {
//                   x: 100,
//                   y: 100,
//                 };
//                 addRectangle(pos.x, pos.y);
//               }}
//             >
//               Rectangle
//             </Button>
//             <Button
//               className="toolbar-button"
//               onClick={() => {
//                 const pos = stageRef.current?.getPointerPosition() || {
//                   x: 150,
//                   y: 150,
//                 };
//                 addEllipse(pos.x, pos.y);
//               }}
//             >
//               Ellipse
//             </Button>
//             <Button
//               className="toolbar-button"
//               onClick={() => {
//                 const pos = stageRef.current?.getPointerPosition() || {
//                   x: 200,
//                   y: 200,
//                 };
//                 addText(pos.x, pos.y, 'Sample');
//               }}
//             >
//               Text
//             </Button>
//           </div>

//           <div className="toolbar-section">
//             <Label className="toolbar-label">Color</Label>
//             <SwatchColorPicker
//               className="color-picker"
//               columnCount={4}
//               colorCells={colors}
//               onChange={(_, color) => {
//                 const newColor = typeof color === 'string' ? color : '#000000';
//                 setCurrentColor(newColor);
//                 if (selectedShapeId) {
//                   changeShapeColor(selectedShapeId, newColor);
//                 }
//               }}
//             />
//           </div>

//           {(() => {
//             // Thickness or Font-size/Editing UI
//             const shape = shapes.find((s) => s.id === selectedShapeId);

//             if (!shape) {
//               // No shape selected: thickness for future shapes
//               return (
//                 <div className="toolbar-section">
//                   <Label className="toolbar-label">
//                     Future Shape Thickness
//                   </Label>
//                   <input
//                     type="number"
//                     className="thickness-input"
//                     placeholder="Thickness"
//                     value={currentThickness}
//                     onChange={(e) => {
//                       const val = parseInt(e.target.value, 10);
//                       if (!isNaN(val)) setCurrentThickness(val);
//                     }}
//                   />
//                 </div>
//               );
//             } else {
//               // A shape is selected
//               if (shape.type === 'rect' || shape.type === 'ellipse') {
//                 // Show thickness slider for this shape
//                 return (
//                   <div className="toolbar-section">
//                     <Label className="toolbar-label">Border Thickness</Label>
//                     <Slider
//                       className="thickness-slider"
//                       min={1}
//                       max={20}
//                       value={shape.strokeWidth}
//                       onChange={(val) => {
//                         if (typeof val === 'number') {
//                           changeShapeThickness(shape.id, val);
//                         }
//                       }}
//                       showValue
//                     />
//                   </div>
//                 );
//               }

//               // If text is selected, show font size and edit text field
//               if (shape.type === 'text') {
//                 return (
//                   <div className="toolbar-section text-edit-section">
//                     <Label className="toolbar-label">Font Size</Label>
//                     <Slider
//                       className="font-size-slider"
//                       min={8}
//                       max={72}
//                       value={shape.fontSize || 16}
//                       onChange={(val) => {
//                         if (typeof val === 'number') {
//                           setCurrentFontSize(val);
//                           changeShapeFontSize(shape.id, val);
//                         }
//                       }}
//                       showValue
//                     />

//                     <Label className="toolbar-label">Edit Text</Label>
//                     <input
//                       type="text"
//                       className="text-input"
//                       value={shape.textValue || ''}
//                       onChange={(e) => {
//                         editShapeText(shape.id, e.target.value);
//                       }}
//                     />
//                   </div>
//                 );
//               }

//               return null;
//             }
//           })()}
//         </div>

//         <div className="canvas-container">
//           <Stage
//             ref={stageRef}
//             width={props.width ?? 800}
//             height={props.height ?? 600}
//             className="canvas-stage"
//           >
//             <Layer>
//               {shapes.map((shape) => {
//                 if (shape.type === 'rect') {
//                   return (
//                     <Rect
//                       key={shape.id}
//                       x={shape.x}
//                       y={shape.y}
//                       width={shape.width}
//                       height={shape.height}
//                       stroke={shape.borderColor}
//                       strokeWidth={shape.strokeWidth}
//                       rotation={shape.rotation}
//                       visible={shape.visible}
//                       onClick={() => selectShape(shape.id)}
//                       draggable
//                       onDragEnd={(e) => {
//                         transformShape(shape.id, {
//                           x: e.target.x(),
//                           y: e.target.y(),
//                         });
//                       }}
//                     />
//                   );
//                 }

//                 if (shape.type === 'ellipse') {
//                   return (
//                     <Ellipse
//                       key={shape.id}
//                       x={shape.x}
//                       y={shape.y}
//                       radiusX={shape.width / 2}
//                       radiusY={shape.height / 2}
//                       stroke={shape.borderColor}
//                       strokeWidth={shape.strokeWidth}
//                       rotation={shape.rotation}
//                       visible={shape.visible}
//                       onClick={() => selectShape(shape.id)}
//                       draggable
//                       onDragEnd={(e) => {
//                         transformShape(shape.id, {
//                           x: e.target.x(),
//                           y: e.target.y(),
//                         });
//                       }}
//                     />
//                   );
//                 }

//                 if (shape.type === 'text') {
//                   return (
//                     <Text
//                       key={shape.id}
//                       x={shape.x}
//                       y={shape.y}
//                       text={shape.textValue || ''}
//                       fontSize={shape.fontSize}
//                       stroke={shape.borderColor}
//                       strokeWidth={shape.strokeWidth}
//                       rotation={shape.rotation}
//                       visible={shape.visible}
//                       onClick={() => selectShape(shape.id)}
//                       draggable
//                       onDragEnd={(e) => {
//                         transformShape(shape.id, {
//                           x: e.target.x(),
//                           y: e.target.y(),
//                         });
//                       }}
//                     />
//                   );
//                 }

//                 return null;
//               })}
//             </Layer>
//           </Stage>
//         </div>
//       </div>
//     </div>
//   );
// };
