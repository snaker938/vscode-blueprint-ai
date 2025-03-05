import React, { useEffect } from 'react';
import { useNode } from '@craftjs/core';
import './RenderNode.css';

interface RenderNodeProps {
  render: React.ReactNode;
}

// RenderNode.tsx
export const RenderNode: React.FC<RenderNodeProps> = ({ render }) => {
  const { isHovered, isSelected, dom } = useNode((node) => ({
    isHovered: node.events.hovered,
    isSelected: node.events.selected,
    dom: node.dom,
  }));

  useEffect(() => {
    if (!dom) return;
    if (isSelected) {
      dom.classList.add('craft-node-selected');
    } else {
      dom.classList.remove('craft-node-selected');
    }
  }, [dom, isSelected]);

  useEffect(() => {
    if (!dom) return;
    if (isHovered) {
      dom.classList.add('craft-node-hovered');
    } else {
      dom.classList.remove('craft-node-hovered');
    }
  }, [dom, isHovered]);

  return <>{render}</>; // no extra div wrapping
};

// ------------------------------------------------------------

// import { FC, ReactNode, useEffect, useRef, useCallback, useState } from 'react';
// import ReactDOM from 'react-dom';
// import { useNode } from '@craftjs/core';
// import './RenderNode.css';

// interface RenderNodeProps {
//   /**
//    * The rendered children (the node’s element).
//    */
//   render: ReactNode;
// }

// /**
//  * RenderNode wraps a component and shows:
//  *   - a red dotted outline if it's hovered or selected
//  *   - a floating label with its name, displayed via a React Portal
//  */
// export const RenderNode: FC<RenderNodeProps> = ({ render }) => {
//   /**
//    * 1) Grab node info from Craft.js
//    */
//   const {
//     connectors: { connect },
//     isHovered,
//     isSelected,
//     nodeName,
//     dom,
//   } = useNode((node) => ({
//     connectors: (node as any).connectors,
//     isHovered: node.events.hovered,
//     isSelected: node.events.selected,
//     nodeName:
//       node.data.custom?.displayName || node.data.displayName || 'No-Name',
//     dom: node.dom,
//   }));

//   /**
//    * 2) Add or remove a "selected" class for the dotted red outline
//    */
//   useEffect(() => {
//     if (!dom) return;
//     if (isHovered || isSelected) {
//       dom.classList.add('component-selected');
//     } else {
//       dom.classList.remove('component-selected');
//     }
//   }, [dom, isHovered, isSelected]);

//   /**
//    * 3) Compute the floating label's absolute position.
//    *    We place it 10px directly above the top edge of the node,
//    *    aligned with its left edge.
//    */
//   const [labelPos, setLabelPos] = useState({ top: '0px', left: '0px' });
//   const labelRef = useRef<HTMLDivElement | null>(null);

//   const getLabelPosition = useCallback(() => {
//     if (!dom) return { top: '0px', left: '0px' };

//     const rect = dom.getBoundingClientRect();
//     // We'll offset by 10px upwards, no horizontal offset
//     const verticalOffset = 10;

//     const outTop = rect.top + window.scrollY - verticalOffset;
//     const outLeft = rect.left + window.scrollX;

//     return {
//       top: `${outTop}px`,
//       left: `${outLeft}px`,
//     };
//   }, [dom]);

//   // Recalculate the label position
//   const updateLabelPosition = useCallback(() => {
//     setLabelPos(getLabelPosition());
//   }, [getLabelPosition]);

//   /**
//    * 4) Update the label position on scroll/resize
//    */
//   useEffect(() => {
//     window.addEventListener('scroll', updateLabelPosition);
//     window.addEventListener('resize', updateLabelPosition);
//     return () => {
//       window.removeEventListener('scroll', updateLabelPosition);
//       window.removeEventListener('resize', updateLabelPosition);
//     };
//   }, [updateLabelPosition]);

//   /**
//    * 5) Whenever we start or stop showing the indicator, ensure we recalc once
//    */
//   useEffect(() => {
//     if (isHovered || isSelected) {
//       updateLabelPosition(); // recalc immediately when shown
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isHovered, isSelected]);

//   /**
//    * 6) Create a portal to .main-interface-container if we are showing a label
//    */
//   const showIndicator = isHovered || isSelected;
//   const containerEl = document.querySelector('.main-interface-container');

//   const indicatorPortal =
//     showIndicator && containerEl
//       ? ReactDOM.createPortal(
//           <div
//             ref={labelRef}
//             className="floating-node-label"
//             style={{
//               position: 'absolute',
//               top: labelPos.top,
//               left: labelPos.left,
//             }}
//           >
//             <span className="node-label-text">{nodeName}</span>
//           </div>,
//           containerEl
//         )
//       : null;

//   /**
//    * 7) Render the node’s child + our portal
//    */
//   return (
//     <>
//       {indicatorPortal}

//       <div
//         ref={(ref: HTMLDivElement | null) => {
//           if (ref) connect(ref);
//         }}
//       >
//         {render}
//       </div>
//     </>
//   );
// };
