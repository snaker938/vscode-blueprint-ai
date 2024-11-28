// import React, { useState, useRef, useEffect } from 'react';
// import { Stage, Layer, Rect, Ellipse, Transformer } from 'react-konva';
// import {
//   DefaultButton,
//   PrimaryButton,
//   IconButton,
//   Spinner,
//   Text,
// } from '@fluentui/react';
// // import { SketchPicker } from 'react-color';
// import './SelectedFeatureSketch.css';

// interface ShapeProps {
//   id: string;
//   type: 'rect' | 'ellipse';
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   stroke: string;
//   strokeWidth: number;
//   rotation: number;
// }

// const SketchCanvas: React.FC = () => {
//   const [shapes, setShapes] = useState<ShapeProps[]>([]);
//   const [selectedId, setSelectedId] = useState<string | null>(null);
//   const [shapeType, setShapeType] = useState<'rect' | 'ellipse'>('rect');
//   // const [color, setColor] = useState<string>('#000000');
//   const [thickness, setThickness] = useState<number>(2);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [history, setHistory] = useState<ShapeProps[][]>([]);
//   const [historyStep, setHistoryStep] = useState<number>(0);
//   const stageRef = useRef<any>(null);
//   const layerRef = useRef<any>(null);

//   useEffect(() => {
//     updateHistory(shapes);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const addShape = () => {
//     const newShape: ShapeProps = {
//       id: `${shapes.length + 1}`,
//       type: shapeType,
//       x: 50,
//       y: 50,
//       width: 100,
//       height: 100,
//       stroke: color,
//       strokeWidth: thickness,
//       rotation: 0,
//     };
//     const newShapes = [...shapes, newShape];
//     setShapes(newShapes);
//     updateHistory(newShapes);
//   };

//   const handleSelect = (id: string) => {
//     setSelectedId(id);
//   };

//   const handleTransform = (node: any, shape: ShapeProps) => {
//     const scaleX = node.scaleX();
//     const scaleY = node.scaleY();
//     node.scaleX(1);
//     node.scaleY(1);
//     const updatedShapes = shapes.map((s) => {
//       if (s.id === shape.id) {
//         return {
//           ...s,
//           x: node.x(),
//           y: node.y(),
//           rotation: node.rotation(),
//           width: Math.max(5, node.width() * scaleX),
//           height: Math.max(5, node.height() * scaleY),
//         };
//       }
//       return s;
//     });
//     setShapes(updatedShapes);
//     updateHistory(updatedShapes);
//   };

//   const updateHistory = (newShapes: ShapeProps[]) => {
//     const newHist = history.slice(0, historyStep);
//     setHistory([...newHist, newShapes]);
//     setHistoryStep(newHist.length + 1);
//   };

//   const handleUndo = () => {
//     if (historyStep > 1) {
//       setShapes(history[historyStep - 2]);
//       setHistoryStep(historyStep - 1);
//     }
//   };

//   const handleRedo = () => {
//     if (historyStep < history.length) {
//       setShapes(history[historyStep]);
//       setHistoryStep(historyStep + 1);
//     }
//   };

//   const handleGenerateClick = () => {
//     setLoading(true);
//     // Simulate processing
//     setTimeout(() => {
//       const shapesArray = shapes.map((shape) => ({
//         type: shape.type,
//         x: shape.x,
//         y: shape.y,
//         width: shape.width,
//         height: shape.height,
//         rotation: shape.rotation,
//         stroke: shape.stroke,
//         strokeWidth: shape.strokeWidth,
//       }));
//       console.log('2D Array of shapes:', shapesArray);

//       const descriptions = shapesArray.map((shape) => {
//         return `A component, ${shape.type} of thickness ${shape.strokeWidth} and colour ${shape.stroke}`;
//       });
//       console.log('English descriptions:', descriptions.join('; '));

//       setLoading(false);
//     }, 1000);
//   };

//   const handleDeselect = (e: any) => {
//     const clickedOnEmpty = e.target === e.target.getStage();
//     if (clickedOnEmpty) {
//       setSelectedId(null);
//     }
//   };

//   return (
//     <div className="sketch-canvas-container">
//       <Text variant="xLarge" className="heading">
//         Draw your sketch
//       </Text>
//       <Text variant="mediumPlus" className="subheading">
//         Create a sketch to convert it into a design
//       </Text>
//       <div className="toolbar">
//         <DefaultButton
//           text="Rectangle"
//           onClick={() => setShapeType('rect')}
//           className={shapeType === 'rect' ? 'active-button' : ''}
//         />
//         <DefaultButton
//           text="Ellipse"
//           onClick={() => setShapeType('ellipse')}
//           className={shapeType === 'ellipse' ? 'active-button' : ''}
//         />
//         <IconButton
//           iconProps={{ iconName: 'Add' }}
//           title="Add Shape"
//           onClick={addShape}
//         />
//         <IconButton
//           iconProps={{ iconName: 'Undo' }}
//           title="Undo"
//           onClick={handleUndo}
//           disabled={historyStep <= 1}
//         />
//         <IconButton
//           iconProps={{ iconName: 'Redo' }}
//           title="Redo"
//           onClick={handleRedo}
//           disabled={historyStep >= history.length}
//         />
//         <div className="color-picker"></div>
//         <div className="thickness-input">
//           <Text>Thickness:</Text>
//           <input
//             type="number"
//             min={1}
//             max={10}
//             value={thickness}
//             onChange={(e) => setThickness(parseInt(e.target.value))}
//           />
//         </div>
//       </div>
//       <div className="canvas-container">
//         <Stage
//           width={800}
//           height={600}
//           onMouseDown={handleDeselect}
//           ref={stageRef}
//         >
//           <Layer ref={layerRef}>
//             {shapes.map((shape) => {
//               const isSelected = shape.id === selectedId;
//               return (
//                 <React.Fragment key={shape.id}>
//                   {shape.type === 'rect' && (
//                     <Rect
//                       id={shape.id}
//                       x={shape.x}
//                       y={shape.y}
//                       width={shape.width}
//                       height={shape.height}
//                       fill="transparent"
//                       stroke={shape.stroke}
//                       strokeWidth={shape.strokeWidth}
//                       rotation={shape.rotation}
//                       draggable
//                       onClick={() => handleSelect(shape.id)}
//                       onTap={() => handleSelect(shape.id)}
//                       onTransformEnd={(e) => {
//                         const node = e.target;
//                         handleTransform(node, shape);
//                       }}
//                       onDragEnd={(e) => {
//                         const node = e.target;
//                         const updatedShapes = shapes.map((s) => {
//                           if (s.id === shape.id) {
//                             return {
//                               ...s,
//                               x: node.x(),
//                               y: node.y(),
//                             };
//                           }
//                           return s;
//                         });
//                         setShapes(updatedShapes);
//                         updateHistory(updatedShapes);
//                       }}
//                     />
//                   )}
//                   {shape.type === 'ellipse' && (
//                     <Ellipse
//                       id={shape.id}
//                       x={shape.x}
//                       y={shape.y}
//                       radiusX={shape.width / 2}
//                       radiusY={shape.height / 2}
//                       fill="transparent"
//                       stroke={shape.stroke}
//                       strokeWidth={shape.strokeWidth}
//                       rotation={shape.rotation}
//                       draggable
//                       onClick={() => handleSelect(shape.id)}
//                       onTap={() => handleSelect(shape.id)}
//                       onTransformEnd={(e) => {
//                         const node = e.target;
//                         handleTransform(node, shape);
//                       }}
//                       onDragEnd={(e) => {
//                         const node = e.target;
//                         const updatedShapes = shapes.map((s) => {
//                           if (s.id === shape.id) {
//                             return {
//                               ...s,
//                               x: node.x(),
//                               y: node.y(),
//                             };
//                           }
//                           return s;
//                         });
//                         setShapes(updatedShapes);
//                         updateHistory(updatedShapes);
//                       }}
//                     />
//                   )}
//                   {isSelected && (
//                     <Transformer
//                       nodes={[stageRef.current.findOne(`#${shape.id}`)]}
//                       rotateEnabled={true}
//                       enabledAnchors={[
//                         'top-left',
//                         'top-right',
//                         'bottom-left',
//                         'bottom-right',
//                       ]}
//                     />
//                   )}
//                 </React.Fragment>
//               );
//             })}
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

// export default SketchCanvas;
