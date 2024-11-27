// // SelectedFeatureSketch.tsx

// import React, { useRef, useState, useEffect } from 'react';
// import { Stage, Layer, Line, Rect, Ellipse, Transformer } from 'react-konva';
// import {
//   Text,
//   PrimaryButton,
//   IconButton,
//   Slider,
//   Stack,
//   Dropdown,
//   Spinner,
// } from '@fluentui/react';
// // import { useNavigate } from 'react-router-dom';
// import './SelectedFeatureSketch.css';

// const SelectedFeatureSketch: React.FC = () => {
//   const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
//   const [lineWidth, setLineWidth] = useState(5);
//   const [lineColor, setLineColor] = useState('#000000');
//   const [lines, setLines] = useState<any[]>([]);
//   const [shapes, setShapes] = useState<any[]>([]);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [shapeType, setShapeType] = useState<'rectangle' | 'ellipse'>(
//     'rectangle'
//   );
//   const [loading, setLoading] = useState(false);
//   const [selectedId, setSelectedId] = useState<string | null>(null);
//   const [isCursorVisible, setIsCursorVisible] = useState(false);
//   const [undoStack, setUndoStack] = useState<{ lines: any[]; shapes: any[] }[]>(
//     []
//   );
//   const [redoStack, setRedoStack] = useState<{ lines: any[]; shapes: any[] }[]>(
//     []
//   );

//   const stageRef = useRef<any>(null);
//   const cursorLayerRef = useRef<any>(null);
//   const cursorRef = useRef<any>(null);
//   const transformerRef = useRef<any>(null);
//   const navigate = useNavigate();

//   const saveState = () => {
//     setUndoStack((prev) => [
//       ...prev,
//       { lines: [...lines], shapes: [...shapes] },
//     ]);
//     setRedoStack([]);
//   };

//   const undo = () => {
//     if (undoStack.length === 0) return;
//     const lastState = undoStack[undoStack.length - 1];
//     setRedoStack((prev) => [
//       ...prev,
//       { lines: [...lines], shapes: [...shapes] },
//     ]);
//     setLines(lastState.lines);
//     setShapes(lastState.shapes);
//     setUndoStack((prev) => prev.slice(0, -1));
//     setSelectedId(null);
//   };

//   const redo = () => {
//     if (redoStack.length === 0) return;
//     const nextState = redoStack[redoStack.length - 1];
//     setUndoStack((prev) => [
//       ...prev,
//       { lines: [...lines], shapes: [...shapes] },
//     ]);
//     setLines(nextState.lines);
//     setShapes(nextState.shapes);
//     setRedoStack((prev) => prev.slice(0, -1));
//     setSelectedId(null);
//   };

//   // const handleMouseDown = (e: any) => {
//   //   if (tool === 'pen' || tool === 'eraser') {
//   //     saveState();
//   //     setIsDrawing(true);
//   //     const pos = stageRef.current.getPointerPosition();
//   //     if (pos) {
//   //       setLines((prevLines) => [
//   //         ...prevLines,
//   //         {
//   //           tool,
//   //           points: [pos.x, pos.y],
//   //           stroke: tool === 'eraser' ? '#ffffff' : lineColor,
//   //           strokeWidth: lineWidth,
//   //         },
//   //       ]);
//   //     }
//   //   }
//   // };

//   const handleMouseDown = (e: any) => {
//     const clickedOnShape = shapes.some((shape) => {
//       const shapeNode = stageRef.current.findOne(`#${shape.id}`);
//       if (shapeNode) {
//         return shapeNode
//           .getClientRect()
//           .containsPoint(stageRef.current.getPointerPosition());
//       }
//       return false;
//     });

//     if (clickedOnShape) {
//       setIsDrawing(false); // Prevent drawing when clicking inside a shape
//       return;
//     }

//     if (tool === 'pen' || tool === 'eraser') {
//       saveState();
//       setIsDrawing(true);
//       const pos = stageRef.current.getPointerPosition();
//       if (pos) {
//         setLines((prevLines) => [
//           ...prevLines,
//           {
//             tool,
//             points: [pos.x, pos.y],
//             stroke: tool === 'eraser' ? '#ffffff' : lineColor,
//             strokeWidth: lineWidth,
//           },
//         ]);
//       }
//     }
//   };

//   const handleMouseMove = () => {
//     const stage = stageRef.current;
//     const point = stage.getPointerPosition();
//     if (point && cursorRef.current) {
//       cursorRef.current.position({
//         x: point.x,
//         y: point.y,
//       });
//       cursorLayerRef.current.batchDraw();
//     }

//     if (!isDrawing || lines.length === 0) {
//       return;
//     }

//     if (point) {
//       setLines((prevLines) => {
//         const lastLine = { ...prevLines[prevLines.length - 1] };
//         lastLine.points = lastLine.points.concat([point.x, point.y]);
//         const newLines = prevLines.slice(0, -1).concat(lastLine);
//         return newLines;
//       });
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDrawing(false);
//   };

//   const handleAddShape = () => {
//     saveState();
//     const stageWidth = stageRef.current.width();
//     const stageHeight = stageRef.current.height();

//     const position = {
//       x: stageWidth / 2,
//       y: stageHeight / 2,
//     };

//     const newShape =
//       shapeType === 'rectangle'
//         ? {
//             id: `rect-${shapes.length + 1}`,
//             type: 'rectangle',
//             x: position.x - 50,
//             y: position.y - 25,
//             width: 100,
//             height: 50,
//             fill: 'transparent',
//             stroke: lineColor,
//             strokeWidth: lineWidth,
//             draggable: true,
//             rotation: 0,
//           }
//         : {
//             id: `ellipse-${shapes.length + 1}`,
//             type: 'ellipse',
//             x: position.x,
//             y: position.y,
//             radiusX: 50,
//             radiusY: 25,
//             fill: 'transparent',
//             stroke: lineColor,
//             strokeWidth: lineWidth,
//             draggable: true,
//             rotation: 0,
//           };

//     setShapes((prevShapes) => [...prevShapes, newShape]);
//     setSelectedId(newShape.id);
//   };

//   const clearCanvas = () => {
//     saveState();
//     setLines([]);
//     setShapes([]);
//     setSelectedId(null);
//   };

//   const handleGenerateClick = () => {
//     setLoading(true);

//     setTimeout(() => {
//       setLoading(false);
//       navigate('/editing-interface');
//     }, 3000);
//   };

//   const handleSelect = (e: any) => {
//     if (
//       e.target === stageRef.current.getStage() ||
//       e.target === stageRef.current
//     ) {
//       setSelectedId(null);
//     }
//   };

//   const handleShapeClick = (e: any, id: string) => {
//     e.cancelBubble = true;
//     setSelectedId(id);
//   };

//   const handleTransformEnd = (e: any) => {
//     const node = e.target;
//     const id = node.id();

//     const scaleX = node.scaleX();
//     const scaleY = node.scaleY();
//     const rotation = node.rotation();

//     node.scaleX(1);
//     node.scaleY(1);
//     node.rotation(0);

//     setShapes((prevShapes) =>
//       prevShapes.map((shape) => {
//         if (shape.id === id) {
//           if (shape.type === 'rectangle') {
//             return {
//               ...shape,
//               x: node.x(),
//               y: node.y(),
//               width: shape.width * scaleX,
//               height: shape.height * scaleY,
//               rotation: rotation,
//             };
//           } else if (shape.type === 'ellipse') {
//             return {
//               ...shape,
//               x: node.x(),
//               y: node.y(),
//               radiusX: shape.radiusX * scaleX,
//               radiusY: shape.radiusY * scaleY,
//               rotation: rotation,
//             };
//           }
//         }
//         return shape;
//       })
//     );
//   };

//   const getCursor = () => {
//     if (tool === 'pen' || tool === 'eraser') {
//       return 'none';
//     } else {
//       return 'default';
//     }
//   };

//   useEffect(() => {
//     const stage = stageRef.current;
//     const tr = transformerRef.current;

//     if (tr) {
//       if (selectedId) {
//         const selectedNode = stage.findOne(`#${selectedId}`);
//         if (selectedNode) {
//           tr.nodes([selectedNode]);
//           tr.getLayer().batchDraw();
//         }
//       } else {
//         tr.nodes([]);
//         tr.getLayer().batchDraw();
//       }
//     }
//   }, [selectedId, shapes]);

//   const handleMouseEnter = () => {
//     setIsCursorVisible(true);
//   };

//   const handleMouseLeave = () => {
//     setIsCursorVisible(false);
//     setIsDrawing(false);
//   };

//   return (
//     <div className="selected-feature-sketch-container">
//       <Text variant="xLarge" className="header-text">
//         Draw Your Sketch
//       </Text>
//       <Text variant="mediumPlus" className="subheader-text">
//         Create a sketch to convert into a design.
//       </Text>

//       <div className="toolbar">
//         <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign="center">
//           <IconButton
//             iconProps={{ iconName: 'Brush' }}
//             title="Pen Tool"
//             onClick={() => setTool('pen')}
//             className={`icon-button ${tool === 'pen' ? 'selected-tool' : ''}`}
//           />
//           <IconButton
//             iconProps={{ iconName: 'EraseTool' }}
//             title="Eraser"
//             onClick={() => setTool('eraser')}
//             className={`icon-button ${
//               tool === 'eraser' ? 'selected-tool' : ''
//             }`}
//           />
//           <div className="color-picker">
//             <input
//               type="color"
//               value={lineColor}
//               onChange={(e) => setLineColor(e.target.value)}
//             />
//           </div>
//           <div className="line-width-slider">
//             <Slider
//               label="Brush Size"
//               min={1}
//               max={30}
//               step={1}
//               value={lineWidth}
//               onChange={(value) => setLineWidth(value)}
//               showValue={false}
//             />
//           </div>
//           <Dropdown
//             selectedKey={shapeType}
//             options={[
//               { key: 'rectangle', text: 'Rectangle' },
//               { key: 'ellipse', text: 'Ellipse' },
//             ]}
//             onChange={(event, option) =>
//               setShapeType(option?.key as 'rectangle' | 'ellipse')
//             }
//             className="shape-dropdown"
//           />
//           <IconButton
//             iconProps={{ iconName: 'Add' }}
//             title="Add Shape"
//             onClick={handleAddShape}
//           />
//           <IconButton
//             iconProps={{ iconName: 'Undo' }}
//             title="Undo"
//             onClick={undo}
//             disabled={undoStack.length === 0}
//           />
//           <IconButton
//             iconProps={{ iconName: 'Redo' }}
//             title="Redo"
//             onClick={redo}
//             disabled={redoStack.length === 0}
//           />
//           <IconButton
//             iconProps={{ iconName: 'Delete' }}
//             title="Clear Canvas"
//             onClick={clearCanvas}
//           />
//         </Stack>
//       </div>

//       <div
//         className="canvas-container"
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//       >
//         <Stage
//           width={800}
//           height={500}
//           className="sketch-stage"
//           ref={stageRef}
//           onMouseDown={(e) => {
//             handleSelect(e);
//             handleMouseDown(e);
//           }}
//           onMousemove={handleMouseMove}
//           onMouseup={handleMouseUp}
//           style={{ cursor: getCursor() }}
//         >
//           <Layer>
//             {lines.map((line, i) => (
//               <Line
//                 key={i}
//                 points={line.points}
//                 stroke={line.stroke}
//                 strokeWidth={line.strokeWidth}
//                 lineCap="round"
//                 lineJoin="round"
//                 globalCompositeOperation={
//                   line.tool === 'eraser' ? 'destination-out' : 'source-over'
//                 }
//               />
//             ))}
//             {shapes.map((shape) => (
//               <React.Fragment key={shape.id}>
//                 {shape.type === 'rectangle' && (
//                   <Rect
//                     id={shape.id}
//                     {...shape}
//                     onClick={(e) => handleShapeClick(e, shape.id)}
//                     onTap={(e) => handleShapeClick(e, shape.id)}
//                     onTransformEnd={handleTransformEnd}
//                     draggable
//                     onDragEnd={(e) => {
//                       const node = e.target;
//                       setShapes((prevShapes) =>
//                         prevShapes.map((s) =>
//                           s.id === shape.id
//                             ? { ...s, x: node.x(), y: node.y() }
//                             : s
//                         )
//                       );
//                     }}
//                     onMouseEnter={(e) => {
//                       const container = e.target.getStage().container();
//                       container.style.cursor = 'move';
//                     }}
//                     onMouseLeave={(e) => {
//                       const container = e.target.getStage().container();
//                       container.style.cursor = getCursor();
//                     }}
//                   />
//                 )}
//                 {shape.type === 'ellipse' && (
//                   <Ellipse
//                     id={shape.id}
//                     {...shape}
//                     onClick={(e) => handleShapeClick(e, shape.id)}
//                     onTap={(e) => handleShapeClick(e, shape.id)}
//                     onTransformEnd={handleTransformEnd}
//                     draggable
//                     onDragEnd={(e) => {
//                       const node = e.target;
//                       setShapes((prevShapes) =>
//                         prevShapes.map((s) =>
//                           s.id === shape.id
//                             ? { ...s, x: node.x(), y: node.y() }
//                             : s
//                         )
//                       );
//                     }}
//                     onMouseEnter={(e) => {
//                       const container = e.target.getStage().container();
//                       container.style.cursor = 'move';
//                     }}
//                     onMouseLeave={(e) => {
//                       const container = e.target.getStage().container();
//                       container.style.cursor = getCursor();
//                     }}
//                   />
//                 )}
//               </React.Fragment>
//             ))}
//             <Transformer
//               ref={transformerRef}
//               boundBoxFunc={(oldBox, newBox) => newBox}
//             />
//           </Layer>
//           <Layer ref={cursorLayerRef} listening={false}>
//             {(tool === 'pen' || tool === 'eraser') && isCursorVisible && (
//               <Ellipse
//                 ref={cursorRef}
//                 x={0}
//                 y={0}
//                 radiusX={lineWidth / 2}
//                 radiusY={lineWidth / 2}
//                 stroke="#000000"
//                 strokeWidth={1}
//                 fill="rgba(0,0,0,0.1)"
//                 listening={false}
//               />
//             )}
//           </Layer>
//         </Stage>
//       </div>

//       <div className="generate-button-section">
//         <PrimaryButton
//           onClick={handleGenerateClick}
//           disabled={loading}
//           className="generate-button"
//         >
//           {loading ? 'Generating...' : 'Generate'}
//         </PrimaryButton>
//       </div>

//       {loading && (
//         <div className="loading-section">
//           <Spinner label="Processing your sketch..." />
//         </div>
//       )}
//     </div>
//   );
// };

// export default SelectedFeatureSketch;
