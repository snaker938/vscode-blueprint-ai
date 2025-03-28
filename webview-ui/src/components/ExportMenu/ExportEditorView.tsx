// // src/components/ExportMenu/ExportEditorView.tsx
// import React, { useEffect, useState } from 'react';
// import {
//   Stack,
//   Pivot,
//   PivotItem,
//   PrimaryButton,
//   DefaultButton,
// } from '@fluentui/react';
// import Editor from '@monaco-editor/react';
// import { Page, generatePageCode } from './codeGenerator';

// interface ExportEditorViewProps {
//   pages: Page[]; // pages selected for export
//   onBack: () => void; // callback to exit editor mode
// }

// interface PageWithCode {
//   id: string;
//   name: string;
//   html: string;
//   css: string;
//   js: string;
// }

// const ExportEditorView: React.FC<ExportEditorViewProps> = ({
//   pages,
//   onBack,
// }) => {
//   const [pageCodeList, setPageCodeList] = useState<PageWithCode[]>([]);

//   // Generate code for selected pages on mount or if pages prop changes
//   useEffect(() => {
//     const generated = pages.map((page) => {
//       const code = generatePageCode(page);
//       return { id: page.id, name: page.name, ...code };
//     });
//     setPageCodeList(generated);
//   }, [pages]);

//   // Handle code editor changes: update state so we always have current code
//   const handleCodeChange = (
//     pageId: string,
//     field: 'html' | 'css' | 'js',
//     value?: string
//   ) => {
//     if (value === undefined) return; // ignore undefined values
//     setPageCodeList((prevList) =>
//       prevList.map((item) =>
//         item.id === pageId ? { ...item, [field]: value } : item
//       )
//     );
//   };

//   // Trigger downloads of HTML, CSS, JS files for a page
//   const downloadPageFiles = (page: PageWithCode) => {
//     // Helper to create a download for one file
//     const triggerDownload = (
//       filename: string,
//       content: string,
//       mimeType: string
//     ) => {
//       const blob = new Blob([content], { type: mimeType });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = filename;
//       link.click();
//       // No persistence needed; we can revoke the object URL after a short delay
//       setTimeout(() => URL.revokeObjectURL(url), 0);
//     };
//     // Trigger download for each file type
//     triggerDownload(`${page.name}.html`, page.html, 'text/html');
//     triggerDownload(`${page.name}.css`, page.css, 'text/css');
//     triggerDownload(`${page.name}.js`, page.js, 'application/javascript');
//   };

//   return (
//     <Stack tokens={{ childrenGap: 10 }} styles={{ root: { padding: 16 } }}>
//       {/* Back button to return to main interface */}
//       <DefaultButton
//         iconProps={{ iconName: 'Back' }}
//         text="Back to Editor"
//         onClick={onBack}
//       />
//       {/* If multiple pages, use a Pivot to switch between page code; if one page, Pivot will still display the single page name */}
//       <Pivot>
//         {pageCodeList.map((page) => (
//           <PivotItem headerText={page.name} key={page.id}>
//             {/* Download button for this page */}
//             <div style={{ textAlign: 'right', margin: '8px 0' }}>
//               <PrimaryButton
//                 iconProps={{ iconName: 'Download' }}
//                 text="Download Files"
//                 onClick={() => downloadPageFiles(page)}
//               />
//             </div>
//             {/* Tabs for HTML, CSS, JS code editors */}
//             <Pivot>
//               <PivotItem headerText="HTML" itemKey="html">
//                 <Editor
//                   width="100%"
//                   height="70vh"
//                   language="html"
//                   value={page.html}
//                   onChange={(val) => handleCodeChange(page.id, 'html', val)}
//                 />
//               </PivotItem>
//               <PivotItem headerText="CSS" itemKey="css">
//                 <Editor
//                   width="100%"
//                   height="70vh"
//                   language="css"
//                   value={page.css}
//                   onChange={(val) => handleCodeChange(page.id, 'css', val)}
//                 />
//               </PivotItem>
//               <PivotItem headerText="JS" itemKey="js">
//                 <Editor
//                   width="100%"
//                   height="70vh"
//                   language="javascript"
//                   value={page.js}
//                   onChange={(val) => handleCodeChange(page.id, 'js', val)}
//                 />
//               </PivotItem>
//             </Pivot>
//           </PivotItem>
//         ))}
//       </Pivot>
//     </Stack>
//   );
// };

// export default ExportEditorView;
