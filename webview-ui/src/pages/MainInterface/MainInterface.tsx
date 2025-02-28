import React from 'react';
import {
  Editor,
  Frame,
  Element,
  DefaultEventHandlers,
  DefaultEventHandlersOptions,
  NodeId,
  EditorStore,
  useEditor,
} from '@craftjs/core';
import { Container } from '../../components/UserComponents/Container';
import { Text as CraftText } from '../../components/UserComponents/Text';
import { Toolbox } from '../../components/CraftEditor/Toolbox';
import { PropertiesPanel } from '../../components/CraftEditor/PropertiesPanel';
import { RenderNode } from '../../components/UserComponents/Utils/RenderNode';

import './MainInterface.css';

type MyEventHandlersOptions = DefaultEventHandlersOptions & {
  store: EditorStore;
  removeHoverOnMouseleave: boolean;
  isMultiSelectEnabled?: () => boolean;
};

/**
 * Custom event handlers to ensure that hover is
 * removed properly on mouse leave.
 */
class CustomEventHandlers extends DefaultEventHandlers {
  constructor(public options: MyEventHandlersOptions) {
    super(options);
  }

  handlers() {
    const defaultHandlers = super.handlers();
    return {
      ...defaultHandlers,
      hover: (el: HTMLElement, id: NodeId) => {
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
          width="1200px"
          height="1800px"
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
      // Pass an empty array to unselect all nodes
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
          <Toolbox />
        </aside>

        <main className="editor-canvas-area">
          <CanvasBorderWrapper>
            <DroppableCanvas />
          </CanvasBorderWrapper>
        </main>

        <aside className="sidebar right-sidebar">
          <PropertiesPanel />
        </aside>
      </div>
    </Editor>
  );
};

export default MainInterface;
