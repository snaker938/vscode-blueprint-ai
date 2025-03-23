import {
  CSSProperties,
  FC,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { useNode } from '@craftjs/core';
import {
  getGlobalPages,
  subscribeGlobalPagesChange,
  getGlobalSelectedPageId,
  subscribeSelectedPageChange,
  setGlobalSelectedPageId,
  Page,
} from '../../PrimarySidebar/PagesTab/pageStore';
import { Resizer } from '../Utils/Resizer'; // Adjust import as needed
import { NavigationProperties } from './NavigationProperties';

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

  const [pages, setPages] = useState<Page[]>(() => getGlobalPages());
  const [selectedPageId, setSelectedPageId] = useState<number>(() =>
    getGlobalSelectedPageId()
  );
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [effectiveNavType, setEffectiveNavType] = useState<
    'navbar' | 'sidebar'
  >(navType || 'navbar');

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePagesChange = () => {
      setPages(getGlobalPages());
    };
    const unsubPages = subscribeGlobalPagesChange(handlePagesChange);
    return () => {
      unsubPages();
    };
  }, []);

  useEffect(() => {
    const handleSelectedPageChange = () => {
      setSelectedPageId(getGlobalSelectedPageId());
    };
    const unsubSelected = subscribeSelectedPageChange(handleSelectedPageChange);
    return () => {
      unsubSelected();
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      connectors.connect(containerRef.current);
    }
  }, [connectors]);

  const handlePageClick = useCallback((pageId: number) => {
    setGlobalSelectedPageId(pageId);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (navType === 'sidebar') {
        setEffectiveNavType('sidebar');
        return;
      }
      const el = containerRef.current;
      if (!el) return;
      if (el.scrollWidth > el.clientWidth) {
        setEffectiveNavType('sidebar');
        setIsCollapsed(true);
      } else {
        setEffectiveNavType('navbar');
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
    };
  }, [navType, pages, displayName]);

  const isSidebar = effectiveNavType === 'sidebar';
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

  const pagesBlock = (
    <nav
      style={
        isSidebar
          ? {
              display: isCollapsed ? 'none' : 'flex',
              flexDirection: 'column',
              gap: '4px',
            }
          : {
              display: 'flex',
            }
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
              ...(isSidebar
                ? {
                    margin: '8px 0',
                  }
                : {
                    margin: '0 8px',
                  }),
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

  if (!isSidebar) {
    return (
      <Resizer
        ref={(ref) => ref && connectors.connect(ref)}
        propKey={{ width: 'width', height: 'height' }}
        style={containerStyle}
      >
        <div ref={containerRef} style={{ display: 'flex', width: '100%' }}>
          {brandBlock}
          {pagesBlock}
        </div>
      </Resizer>
    );
  } else {
    return (
      <div ref={containerRef} style={containerStyle}>
        {brandBlock}
        {pagesBlock}
      </div>
    );
  }
};

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
