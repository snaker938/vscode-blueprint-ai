import React from 'react';
import {
  Editor,
  Frame,
  Element,
  DefaultEventHandlers,
  DefaultEventHandlersOptions,
  EditorStore,
  useEditor,
} from '@craftjs/core';
import { Container } from '../../components/UserComponents/Container';
import { Text as CraftText } from '../../components/UserComponents/Text';
import { PrimarySidebar } from '../../components/PrimarySidebar/PrimarySidebar';
import { PropertiesSidebar } from '../../components/PropertiesSidebar/PropertiesSidebar';
import { RenderNode } from '../../components/UserComponents/Utils/RenderNode';

import './MainInterface.css';

/**
 * Extended event handler options that must match DefaultEventHandlersOptions.
 * isMultiSelectEnabled => (e: MouseEvent) => boolean
 */
interface MyEventHandlersOptions extends DefaultEventHandlersOptions {
  store: EditorStore;
  removeHoverOnMouseleave: boolean;
  isMultiSelectEnabled: (e: MouseEvent) => boolean;
}

/**
 * Custom event handlers:
 * - We skip hover/selection if the target is the root node.
 */
class CustomEventHandlers extends DefaultEventHandlers<MyEventHandlersOptions> {
  constructor(public options: MyEventHandlersOptions) {
    super(options);
  }

  handlers() {
    const defaultHandlers = super.handlers();

    return {
      ...defaultHandlers,

      // Overriding 'select'
      select: (el: HTMLElement, id: string) => {
        // If node is root, don't allow selection:
        if (this.options.store.query.node(id).isRoot()) {
          return () => {};
        }
        return defaultHandlers.select(el, id);
      },

      // Overriding 'hover'
      hover: (el: HTMLElement, id: string) => {
        // If node is root, don't allow hover:
        if (this.options.store.query.node(id).isRoot()) {
          return () => {};
        }
        const unbindDefaultHoverHandler = defaultHandlers.hover(el, id);
        const unbindMouseleave = this.addCraftEventListener(
          el,
          'mouseleave',
          (e) => {
            e.craft.stopPropagation();
            this.options.store.actions.setNodeEvent('hovered', '');
          }
        );

        return () => {
          unbindDefaultHoverHandler();
          unbindMouseleave();
        };
      },
    };
  }
}

const DroppableCanvas: React.FC = () => {
  return (
    <div className="droppable-canvas">
      <Frame>
        <Element
          is={Container}
          canvas
          background="#ffffff"
          padding={20}
          isRootContainer
        >
          <CraftText
            text="Welcome! Drag components from the left!"
            fontSize={22}
          />
        </Element>
      </Frame>
    </div>
  );
};

const CanvasBorderWrapper: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { actions } = useEditor();

  /**
   * Clicking on the wrapper (and not a child) deselects everything.
   */
  const handleClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      actions.selectNode([]);
    }
  };

  return (
    <div
      id="droppable-canvas-border"
      className="canvas-border-wrapper"
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

const MainInterface: React.FC = () => {
  return (
    <Editor
      resolver={{ Container, Text: CraftText }}
      onRender={(nodeProps) => <RenderNode {...nodeProps} />}
      handlers={(store: EditorStore) =>
        new CustomEventHandlers({
          store,
          removeHoverOnMouseleave: false,
          isMultiSelectEnabled: () => false,
        })
      }
    >
      <div className="main-interface-container">
        <aside className="sidebar left-sidebar">
          <PrimarySidebar />
        </aside>

        <main className="editor-canvas-area">
          <CanvasBorderWrapper>
            <DroppableCanvas />
          </CanvasBorderWrapper>
        </main>

        <aside className="sidebar right-sidebar">
          <PropertiesSidebar />
        </aside>
      </div>
    </Editor>
  );
};

export default MainInterface;

// import React from 'react';
// import {
//   Editor,
//   Frame,
//   Element,
//   DefaultEventHandlers,
//   DefaultEventHandlersOptions,
//   EditorStore,
//   useEditor,
// } from '@craftjs/core';
// import { Container } from '../../components/UserComponents/Container';
// import { Text as CraftText } from '../../components/UserComponents/Text';
// import { PrimarySidebar } from '../../components/PrimarySidebar/PrimarySidebar';
// import { PropertiesSidebar } from '../../components/PropertiesSidebar/PropertiesSidebar';
// import { RenderNode } from '../../components/UserComponents/Utils/RenderNode';

// import './MainInterface.css';

// /**
//  * Extended event handler options that must match DefaultEventHandlersOptions.
//  * isMultiSelectEnabled => (e: MouseEvent) => boolean
//  */
// interface MyEventHandlersOptions extends DefaultEventHandlersOptions {
//   store: EditorStore;
//   removeHoverOnMouseleave: boolean;
//   isMultiSelectEnabled: (e: MouseEvent) => boolean;
// }

// /**
//  * Custom event handlers:
//  * - We skip hover/selection if the target is the root node.
//  */
// class CustomEventHandlers extends DefaultEventHandlers<MyEventHandlersOptions> {
//   constructor(public options: MyEventHandlersOptions) {
//     super(options);
//   }

//   handlers() {
//     const defaultHandlers = super.handlers();

//     return {
//       ...defaultHandlers,

//       // Overriding 'select': (el: HTMLElement, id: string) => () => void
//       select: (el: HTMLElement, id: string) => {
//         // If node is root, don't allow selection:
//         if (this.options.store.query.node(id).isRoot()) {
//           return () => {};
//         }
//         return defaultHandlers.select(el, id);
//       },

//       // Overriding 'hover': (el: HTMLElement, id: string) => () => void
//       hover: (el: HTMLElement, id: string) => {
//         // If node is root, don't allow hover:
//         if (this.options.store.query.node(id).isRoot()) {
//           return () => {};
//         }
//         const unbindDefaultHoverHandler = defaultHandlers.hover(el, id);
//         const unbindMouseleave = this.addCraftEventListener(
//           el,
//           'mouseleave',
//           (e) => {
//             e.craft.stopPropagation();
//             this.options.store.actions.setNodeEvent('hovered', '');
//           }
//         );

//         return () => {
//           unbindDefaultHoverHandler();
//           unbindMouseleave();
//         };
//       },
//     };
//   }
// }

// const DroppableCanvas: React.FC = () => {
//   return (
//     <div className="droppable-canvas">
//       <Frame>
//         {/* Root node forced to 800x1235 via isRootContainer */}
//         <Element
//           is={Container}
//           canvas
//           background="#ffffff"
//           padding={20}
//           isRootContainer
//         >
//           <CraftText
//             text="Welcome! Drag components from the left!"
//             fontSize={22}
//           />
//         </Element>
//       </Frame>
//     </div>
//   );
// };

// const CanvasBorderWrapper: React.FC<React.PropsWithChildren<unknown>> = ({
//   children,
// }) => {
//   const { actions } = useEditor();

//   /**
//    * Clicking on the wrapper (and not a child) deselects everything.
//    */
//   const handleClick = (e: React.MouseEvent) => {
//     if (e.target === e.currentTarget) {
//       actions.selectNode([]);
//     }
//   };

//   return (
//     <div
//       id="droppable-canvas-border"
//       className="canvas-border-wrapper"
//       onClick={handleClick}
//     >
//       {children}
//     </div>
//   );
// };

// const MainInterface: React.FC = () => {
//   return (
//     <Editor
//       resolver={{ Container, Text: CraftText }}
//       onRender={(nodeProps) => <RenderNode {...nodeProps} />}
//       handlers={(store: EditorStore) =>
//         new CustomEventHandlers({
//           store,
//           removeHoverOnMouseleave: false,
//           isMultiSelectEnabled: () => false,
//         })
//       }
//     >
//       <div className="main-interface-container">
//         <aside className="sidebar left-sidebar">
//           <PrimarySidebar />
//         </aside>

//         <main className="editor-canvas-area">
//           <CanvasBorderWrapper>
//             <DroppableCanvas />
//           </CanvasBorderWrapper>
//         </main>

//         <aside className="sidebar right-sidebar">
//           <PropertiesSidebar />
//         </aside>
//       </div>
//     </Editor>
//   );
// };

// export default MainInterface;
