import React, {
  useCallback,
  CSSProperties,
  MouseEvent,
  FC,
  useMemo,
  ChangeEvent,
} from 'react';
import { useNode, useEditor } from '@craftjs/core';

import { Resizer } from '../Utils/Resizer';
import { TextProperties } from './TextProperties';

// Import your page store logic
import { setGlobalSelectedPageId } from '../../PrimarySidebar/PagesTab/pageStore';

/**
 * Utility type for margin/padding: [top, right, bottom, left]
 */
type FourNumberArray = [number, number, number, number];

/**
 * Possible rendering modes for our Text component
 */
export type RenderMode = 'textbox' | 'link';

/**
 * For link behavior
 */
export type LinkType = 'externalUrl' | 'page';

/**
 * Main props for the Text component
 */
export interface TextProps {
  /**
   * Rendering mode. If "textbox", it renders <input> or <textarea>;
   * if "link", it renders <a>.
   */
  renderMode?: RenderMode;

  // Text styling
  fontSize?: number;
  textAlign?: 'left' | 'right' | 'center' | 'justify' | string;
  fontWeight?: string;
  textColor?: { r: number; g: number; b: number; a: number } | string;
  shadow?: number;
  text?: string;

  // Spacing
  margin?: FourNumberArray;
  padding?: FourNumberArray;

  // Appearance
  placeholder?: string;
  fontFamily?: string;
  background?: string;
  multiline?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  radius?: number;
  borderColor?: string;
  borderStyle?: string;
  borderWidth?: number;
  width?: string;
  height?: string;

  // Additional textbox properties
  maxLength?: number;
  rows?: number;
  cols?: number;
  autoFocus?: boolean;
  spellCheck?: boolean;

  // Link-related
  href?: string;
  linkType?: LinkType; // 'externalUrl' | 'page'
  pageId?: number;
  linkTitle?: string; // Optional <a> title attribute
  ariaLabel?: string; // For screen-readers
  children?: React.ReactNode;

  /**
   * If true, renders a checkbox next to the text.
   */
  hasCheckbox?: boolean;

  /**
   * The current checked state of the checkbox (if hasCheckbox is true).
   */
  checked?: boolean;

  /**
   * Position of checkbox relative to text: 'left' or 'right'.
   */
  checkboxPosition?: 'left' | 'right';
}

/**
 * Default values
 */
const defaultProps: Partial<TextProps> = {
  // Rendering
  renderMode: 'textbox',

  // Text style
  fontSize: 15,
  textAlign: 'left',
  fontWeight: '500',
  textColor: { r: 92, g: 90, b: 90, a: 1 },
  shadow: 0,
  text: 'Text',

  // Spacing
  margin: [0, 0, 0, 0],
  padding: [5, 5, 5, 5],

  // Appearance
  fontFamily: 'Arial, sans-serif',
  background: '#ffffff',
  radius: 0,
  borderColor: '#000000',
  borderStyle: 'solid',
  borderWidth: 1,

  // Sizing
  width: '200px',
  height: '40px',

  // Textbox-specific
  placeholder: 'Enter text...',
  multiline: false,
  disabled: false,
  readOnly: false,
  maxLength: undefined,
  rows: undefined,
  cols: undefined,
  autoFocus: false,
  spellCheck: true,

  // Link
  href: '#',
  linkType: 'externalUrl',
  linkTitle: undefined,
  ariaLabel: undefined,

  // Checkbox
  hasCheckbox: false,
  checked: false,
  checkboxPosition: 'left',
};

/**
 * Parse color from RGBA or string
 */
function parseColor(
  c?: { r: number; g: number; b: number; a: number } | string
): string {
  if (!c) return '#000';
  if (typeof c === 'string') return c;
  const { r, g, b, a } = c;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * Extend React.FC so we can add a `craft` static property safely,
 * avoiding the empty-object `{}` type issue.
 */
interface CraftTextFC<T extends object = Record<string, unknown>>
  extends FC<T> {
  craft?: {
    displayName: string;
    props?: Partial<T>;
    related?: {
      settings?: React.ComponentType<any>;
    };
  };
}

/**
 * The unified Text component
 */
const TextComponent: CraftTextFC<TextProps> = (incomingProps) => {
  // Merge default + incoming props
  const props = { ...defaultProps, ...incomingProps };

  const {
    renderMode,
    fontSize,
    textAlign,
    fontWeight,
    textColor,
    shadow,
    text,
    margin,

    placeholder,
    fontFamily,
    background,
    multiline,
    disabled,
    readOnly,
    padding,
    radius,
    borderColor,
    borderStyle,
    borderWidth,
    width,
    height,

    maxLength,
    rows,
    cols,
    autoFocus,
    spellCheck,

    href,
    linkType,
    pageId,
    linkTitle,
    ariaLabel,
    children,

    hasCheckbox,
    checked,
    checkboxPosition,
  } = props;

  // Connect to Craft Node
  const {
    connectors: { connect, drag },
    actions: { setProp },
  } = useNode();

  // Check if Craft editor is enabled
  const { enabled: isEditorEnabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  /**
   * Handle text changes (for input/textarea)
   */
  const handleTextChange = useCallback(
    (newValue: string) => {
      setProp((draft: TextProps) => {
        draft.text = newValue;
      }, 500);
    },
    [setProp]
  );

  /**
   * If the link is external and doesn't start with http(s),
   * prepend "https://" so it works as a direct URL.
   */
  const finalHref = useMemo(() => {
    if (renderMode !== 'link' || linkType !== 'externalUrl') {
      // For non-links or internal page links, just use given href (default '#').
      return href || '#';
    }

    if (!href || href === '#') {
      return '#';
    }
    // If user typed something like "youtube.com", ensure "https://youtube.com"
    if (!/^https?:\/\//i.test(href)) {
      return `https://${href}`;
    }
    return href;
  }, [renderMode, linkType, href]);

  /**
   * Link click logic
   */
  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (renderMode !== 'link') return;

    // If linking to a page within your app
    if (linkType === 'page') {
      e.preventDefault();
      if (typeof pageId === 'number') {
        setGlobalSelectedPageId(pageId);
      }
    }
    // If external, the browser will handle it (opens in new tab).
  };

  /**
   * Container styling (OUTER border)
   */
  const safeMargin = margin || [0, 0, 0, 0];
  const safePadding = padding || [0, 0, 0, 0];

  const containerStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: width || 'auto',
    height: height || 'auto',
    margin: `${safeMargin[0]}px ${safeMargin[1]}px ${safeMargin[2]}px ${safeMargin[3]}px`,
    padding: `${safePadding[0]}px ${safePadding[1]}px ${safePadding[2]}px ${safePadding[3]}px`,
    background: background || 'transparent',
    borderRadius: radius ? `${radius}px` : undefined,
    borderColor: borderColor || '#000',
    borderStyle: borderStyle || 'solid',
    borderWidth: borderWidth ? `${borderWidth}px` : '0px',
    boxShadow:
      shadow && shadow > 0 ? `0px 3px ${shadow}px rgba(0,0,0,0.2)` : 'none',
  };

  /**
   * Text styling (no extra border for input)
   */
  const textStyle: CSSProperties = {
    color: parseColor(textColor),
    fontSize: fontSize ? `${fontSize}px` : undefined,
    fontWeight,
    fontFamily,
    textAlign: textAlign as CSSProperties['textAlign'],
    textShadow:
      shadow && shadow > 0 ? `0px 0px 2px rgba(0,0,0,${shadow / 100})` : 'none',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    border: 'none',
    background: 'transparent',
    resize: 'none',
  };

  // Default link styling (blue, underlined)
  const defaultLinkStyle: CSSProperties = {
    color: '#0645AD',
    textDecoration: 'underline',
  };

  /**
   * Render logic for main text or link
   */
  let content: React.ReactNode;
  if (renderMode === 'textbox') {
    // TEXTBOX MODE
    if (multiline) {
      content = (
        <textarea
          style={textStyle}
          value={text || ''}
          placeholder={placeholder}
          disabled={!isEditorEnabled || disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          rows={rows}
          cols={cols}
          autoFocus={autoFocus}
          spellCheck={spellCheck}
          onChange={(e) => handleTextChange(e.target.value)}
        />
      );
    } else {
      content = (
        <input
          type="text"
          style={textStyle}
          value={text || ''}
          placeholder={placeholder}
          disabled={!isEditorEnabled || disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          autoFocus={autoFocus}
          spellCheck={spellCheck}
          onChange={(e) => handleTextChange(e.target.value)}
        />
      );
    }
  } else {
    // LINK MODE
    const linkContent = children || text;
    const linkStyle: CSSProperties = {
      ...textStyle,
      ...defaultLinkStyle,
      display: 'inline-block',
    };

    content = (
      <a
        href={finalHref}
        target="_blank"
        rel="noopener noreferrer"
        title={linkTitle}
        aria-label={ariaLabel}
        style={linkStyle}
        onClick={handleLinkClick}
      >
        {linkContent}
      </a>
    );
  }

  /**
   * If there's a checkbox, wrap the content with a checkbox input
   */
  const handleCheckboxChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setProp((draft: TextProps) => {
        draft.checked = e.target.checked;
      });
    },
    [setProp]
  );

  let finalContent = content;
  if (hasCheckbox) {
    finalContent = (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {checkboxPosition === 'left' && (
          <input
            type="checkbox"
            checked={checked}
            onChange={handleCheckboxChange}
            disabled={!isEditorEnabled || disabled}
            style={{ marginRight: '5px' }}
          />
        )}
        {content}
        {checkboxPosition === 'right' && (
          <input
            type="checkbox"
            checked={checked}
            onChange={handleCheckboxChange}
            disabled={!isEditorEnabled || disabled}
            style={{ marginLeft: '5px' }}
          />
        )}
      </div>
    );
  }

  /**
   * Connectors for drag/resize
   */
  const connectRef = (dom: HTMLDivElement) => {
    if (dom) {
      connect(drag(dom));
    }
  };

  return (
    <Resizer
      ref={connectRef}
      propKey={{ width: 'width', height: 'height' }}
      style={containerStyle}
    >
      {finalContent}
    </Resizer>
  );
};

/**
 * Attach Craft.js config
 */
TextComponent.craft = {
  displayName: 'Text',
  props: {
    ...defaultProps,
  },
  related: {
    settings: TextProperties,
  },
};

export const Text = TextComponent;
