// // Type definitions for the layout tree structure
// interface LayoutNode {
//   type: { resolvedName: string };
//   props: { [key: string]: any };
//   parent: string | null;
//   nodes?: string[];
// }

// interface LayoutTree {
//   [id: string]: LayoutNode;
// }

// // Helper to escape text content for safe HTML output
// function escapeHtml(text: string): string {
//   return String(text)
//     .replace(/&/g, '&amp;')
//     .replace(/</g, '&lt;')
//     .replace(/>/g, '&gt;')
//     .replace(/"/g, '&quot;')
//     .replace(/'/g, '&#39;');
// }

// // Helper to convert node props to an inline CSS style string
// function stylePropsToCSS(props: { [key: string]: any }): string {
//   const style: string[] = [];

//   // Margin and padding (arrays of [top, right, bottom, left])
//   if (props.padding) {
//     const pad = props.padding;
//     if (Array.isArray(pad) && pad.length === 4) {
//       const [pt, pr, pb, pl] = pad;
//       const padValues = [pt, pr, pb, pl].map((val) => {
//         // Append 'px' if value is a number or numeric string (and not empty)
//         if (
//           typeof val === 'number' ||
//           (typeof val === 'string' && val !== '' && /^\d+$/.test(val))
//         ) {
//           return val + 'px';
//         }
//         return String(val);
//       });
//       style.push(`padding: ${padValues.join(' ')};`);
//     }
//   }
//   if (props.margin) {
//     const mar = props.margin;
//     if (Array.isArray(mar) && mar.length === 4) {
//       const [mt, mr, mb, ml] = mar;
//       const marValues = [mt, mr, mb, ml].map((val) => {
//         if (
//           typeof val === 'number' ||
//           (typeof val === 'string' && val !== '' && /^\d+$/.test(val))
//         ) {
//           return val + 'px';
//         }
//         return String(val);
//       });
//       style.push(`margin: ${marValues.join(' ')};`);
//     }
//   }

//   // Flex container properties
//   if (props.flexDirection) {
//     style.push(`display: flex;`);
//     style.push(`flex-direction: ${props.flexDirection};`);
//     if (props.alignItems) {
//       style.push(`align-items: ${props.alignItems};`);
//     }
//     if (props.justifyContent) {
//       style.push(`justify-content: ${props.justifyContent};`);
//     }
//   }

//   // Size (width and height)
//   if (props.width) {
//     const widthVal = props.width;
//     if (
//       typeof widthVal === 'number' ||
//       (typeof widthVal === 'string' && /^\d+$/.test(widthVal))
//     ) {
//       style.push(`width: ${widthVal}px;`);
//     } else {
//       style.push(`width: ${widthVal};`);
//     }
//   }
//   if (props.height) {
//     const heightVal = props.height;
//     if (
//       typeof heightVal === 'number' ||
//       (typeof heightVal === 'string' && /^\d+$/.test(heightVal))
//     ) {
//       style.push(`height: ${heightVal}px;`);
//     } else {
//       style.push(`height: ${heightVal};`);
//     }
//   }

//   // Typography
//   if (props.fontSize) {
//     const fsVal = props.fontSize;
//     if (
//       typeof fsVal === 'number' ||
//       (typeof fsVal === 'string' && /^\d+$/.test(fsVal))
//     ) {
//       style.push(`font-size: ${fsVal}px;`);
//     } else {
//       style.push(`font-size: ${fsVal};`);
//     }
//   }
//   if (props.fontWeight) {
//     style.push(`font-weight: ${props.fontWeight};`);
//   }
//   if (props.textAlign) {
//     style.push(`text-align: ${props.textAlign};`);
//   }

//   // Color and background
//   if (props.color && typeof props.color === 'object') {
//     const { r, g, b, a } = props.color;
//     style.push(`color: rgba(${r}, ${g}, ${b}, ${a});`);
//   }
//   if (props.background && typeof props.background === 'object') {
//     const { r, g, b, a } = props.background;
//     style.push(`background-color: rgba(${r}, ${g}, ${b}, ${a});`);
//   }

//   // Border radius and shadow
//   if (props.radius !== undefined) {
//     const radiusVal = props.radius;
//     if (
//       typeof radiusVal === 'number' ||
//       (typeof radiusVal === 'string' && /^\d+$/.test(radiusVal))
//     ) {
//       style.push(`border-radius: ${radiusVal}px;`);
//     } else {
//       style.push(`border-radius: ${radiusVal};`);
//     }
//   }
//   if (props.shadow !== undefined) {
//     const shadowVal = Number(props.shadow);
//     if (!isNaN(shadowVal) && shadowVal > 0) {
//       // Use shadow value as blur radius for a simple drop shadow
//       style.push(`box-shadow: 0 0 ${shadowVal}px rgba(0, 0, 0, 0.15);`);
//     }
//   }

//   // Flex item expansion
//   if (props.fillSpace === 'yes' || props.fillSpace === true) {
//     style.push(`flex: 1 1 auto;`);
//   }

//   return style.length ? style.join(' ') : '';
// }

// // Main function to generate HTML, CSS, and JS from the layout tree
// function generatePageCode(layout: LayoutTree): {
//   html: string;
//   css: string;
//   js: string;
// } {
//   // Find the root node (where parent is null)
//   const rootId = Object.keys(layout).find((id) => layout[id].parent === null);
//   if (!rootId) {
//     throw new Error('No root node found in layout');
//   }

//   // Recursive function to render a node to HTML
//   const renderNode = (nodeId: string): string => {
//     const node = layout[nodeId];
//     const { resolvedName } = node.type;
//     const props = node.props || {};

//     // Build style string for this node
//     const styleString = stylePropsToCSS(props);
//     const styleAttr = styleString ? ` style="${styleString}"` : '';

//     let html = '';
//     switch (resolvedName) {
//       case 'Container':
//         // Container: use a div as a section/container element
//         html += `<div${styleAttr}>`;
//         if (node.nodes && node.nodes.length) {
//           for (const childId of node.nodes) {
//             html += renderNode(childId);
//           }
//         }
//         html += `</div>`;
//         break;
//       case 'Text':
//         // Text: use a paragraph (p) for block text content
//         const textContent =
//           props.text !== undefined ? escapeHtml(props.text) : '';
//         html += `<p${styleAttr}>${textContent}</p>`;
//         break;
//       case 'Image':
//         // Image: use an img tag
//         const src = props.src ? escapeHtml(props.src) : '';
//         const alt = props.alt ? escapeHtml(props.alt) : '';
//         html += `<img src="${src}" alt="${alt}"${styleAttr} />`;
//         break;
//       case 'Button':
//         // Button: use a button element
//         const btnText = props.text !== undefined ? escapeHtml(props.text) : '';
//         html += `<button${styleAttr}>${btnText}</button>`;
//         break;
//       default:
//         // Fallback for unknown component types
//         html += `<div${styleAttr}>`;
//         if (props.text) {
//           html += escapeHtml(props.text);
//         }
//         if (node.nodes && node.nodes.length) {
//           for (const childId of node.nodes) {
//             html += renderNode(childId);
//           }
//         }
//         html += `</div>`;
//     }
//     return html;
//   };

//   // Generate HTML by rendering the root node
//   const htmlOutput = renderNode(rootId);

//   // Minimal global CSS (scoped to the page content)
//   let cssOutput = '';
//   cssOutput += '* { box-sizing: border-box; }\n';

//   // Minimal JavaScript stub (e.g., page load notification)
//   const jsOutput = `document.addEventListener('DOMContentLoaded', () => {\n  console.log('Page loaded');\n});`;

//   return { html: htmlOutput, css: cssOutput, js: jsOutput };
// }
