import {
  CSSProperties,
  FC,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { useNode } from '@craftjs/core';
import { NavigationProperties } from './NavigationProperties';

// 1) Import from the new store
import {
  getPages,
  subscribePageChange,
  getSelectedPageId,
  subscribeSelectedPageChange,
  setSelectedPageId,
  Page,
} from '../../../store/store';

export interface INavigationProps {
  navType?: 'navbar' | 'sidebar';
  displayName?: string;
  background?: string;
  collapsible?: boolean;
  collapsedWidth?: string;
  expandedWidth?: string;
  width?: string;
  height?: string;
  linkStyle?: CSSProperties;
  highlightSelected?: boolean;
  textColor?: string;
  margin?: string;
  padding?: string;
  pageDisplayNames?: Record<number, string>;
}

/** Default props if none are supplied from the Craft.js editor. */
const defaultProps: Partial<INavigationProps> = {
  navType: 'navbar',
  displayName: 'MySite',
  background: '#ffffff',
  collapsible: true,
  collapsedWidth: '60px',
  expandedWidth: '250px',
  width: '200px',
  height: '100%',
  linkStyle: {},
  highlightSelected: true,
  textColor: '#333',
  margin: '0',
  padding: '10px',
};

export const Navigation: FC<INavigationProps> & { craft?: any } = (
  incomingProps
) => {
  const { connectors } = useNode(() => ({}));

  const props = { ...defaultProps, ...incomingProps };
  const {
    navType,
    displayName,
    background,
    collapsible,
    collapsedWidth,
    expandedWidth,
    width,
    height,
    linkStyle,
    highlightSelected,
    textColor,
    margin,
    padding,
    pageDisplayNames,
  } = props;

  /**
   * 2) Local state to mirror the store’s pages and selectedPageId
   */
  const [pages, setPagesState] = useState<Page[]>(() => getPages());
  const [selectedPageId, setSelectedPageIdState] = useState<number>(() =>
    getSelectedPageId()
  );

  /**
   * Controls whether the sidebar (if selected) is collapsed or not.
   */
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * 3) Subscribe to store changes (pages).
   */
  useEffect(() => {
    const handlePagesChange = () => {
      setPagesState(getPages());
    };
    const unsubPages = subscribePageChange(handlePagesChange);
    return () => {
      unsubPages();
    };
  }, []);

  /**
   * 4) Subscribe to store changes (selected page ID).
   */
  useEffect(() => {
    const handleSelectedPageChange = () => {
      setSelectedPageIdState(getSelectedPageId());
    };
    const unsubSelected = subscribeSelectedPageChange(handleSelectedPageChange);
    return () => {
      unsubSelected();
    };
  }, []);

  /**
   * Connect this component to the Craft.js editor for drag/select
   */
  useEffect(() => {
    if (containerRef.current) {
      connectors.connect(containerRef.current);
    }
  }, [connectors]);

  /**
   * Handle user clicking a page link in the nav
   */
  const handlePageClick = useCallback((pageId: number) => {
    setSelectedPageId(pageId);
  }, []);

  /**
   * Decide if we’re in sidebar mode based on the navType prop alone.
   */
  const isSidebar = navType === 'sidebar';

  /**
   * Compute final width if it’s a collapsible sidebar
   */
  const finalWidth = isSidebar
    ? collapsible
      ? isCollapsed
        ? collapsedWidth
        : expandedWidth
      : width
    : undefined;

  const baseContainerStyle: CSSProperties = {
    background,
    color: textColor,
    boxSizing: 'border-box',
    margin,
    padding,
  };

  let containerStyle: CSSProperties = {};
  if (!isSidebar) {
    // NAVBAR STYLE
    containerStyle = {
      ...baseContainerStyle,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      height: height || '50px',
      overflow: 'hidden',
    };
  } else {
    // SIDEBAR STYLE
    containerStyle = {
      ...baseContainerStyle,
      position: 'relative',
      width: finalWidth,
      height,
      overflow: 'hidden',
      transition: collapsible ? 'width 0.3s ease' : undefined,
      display: 'flex',
      flexDirection: 'column',
    };
  }

  const resolvedLinkStyle: CSSProperties = {
    color: textColor,
    textDecoration: 'none',
    padding: '5px 10px',
    display: 'block',
    ...linkStyle,
  };

  /**
   * Brand block or “logo” area
   */
  const brandBlock = (
    <div
      style={{
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        ...(isSidebar
          ? {
              paddingBottom: '1rem',
              justifyContent: 'space-between',
              width: '100%',
            }
          : {}),
      }}
    >
      {displayName}
      {isSidebar && collapsible && (
        <button
          type="button"
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
          }}
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          ☰
        </button>
      )}
    </div>
  );

  /**
   * Links for each page
   */
  const pagesBlock = (
    <nav
      style={
        isSidebar
          ? {
              display: isCollapsed ? 'none' : 'flex',
              flexDirection: 'column',
              gap: '4px',
            }
          : { display: 'flex' }
      }
    >
      {pages.map((page) => {
        const isSelected = page.id === selectedPageId;
        const linkHighlight: CSSProperties =
          isSelected && highlightSelected ? { background: '#ddd' } : {};

        const pageLabel =
          (pageDisplayNames && pageDisplayNames[page.id]) || page.name;

        return (
          <a
            key={page.id}
            href="#"
            style={{
              ...resolvedLinkStyle,
              ...(isSidebar ? { margin: '8px 0' } : { margin: '0 8px' }),
              borderRadius: '4px',
              ...linkHighlight,
            }}
            onClick={(e) => {
              e.preventDefault();
              handlePageClick(page.id);
            }}
            title={isCollapsed && isSidebar ? pageLabel : undefined}
          >
            {pageLabel}
          </a>
        );
      })}
    </nav>
  );

  /**
   * Single return – no resizing, no auto-convert between navbar & sidebar
   */
  return (
    <div ref={containerRef} style={containerStyle}>
      {brandBlock}
      {pagesBlock}
    </div>
  );
};

/** Configure how Craft.js sees this component. */
Navigation.craft = {
  displayName: 'Navigation',
  props: defaultProps,
  isCanvas: false,
  rules: {
    canDrag: () => true,
    canMove: () => true,
    canDelete: () => true,
    canSelect: () => true,
  },
  related: {
    settings: NavigationProperties,
  },
};
