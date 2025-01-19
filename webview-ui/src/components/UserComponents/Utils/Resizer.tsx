import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  CSSProperties,
} from 'react';
import { useNode, useEditor } from '@craftjs/core';
import cx from 'classnames';
import debounce from 'debounce';
import {
  Resizable,
  ResizeDirection,
  NumberSize,
  ResizeCallback,
} from 're-resizable';
import { styled } from 'styled-components';

/** Helper methods (from both current + exemplar) */
function isPercentage(val: string | number): boolean {
  return typeof val === 'string' && val.trim().endsWith('%');
}
function pxToPercent(px: number, containerSize: number): number {
  return containerSize > 0 ? (px / containerSize) * 100 : px;
}
function percentToPx(
  val: string | number,
  containerSize: number
): number | null {
  if (typeof val !== 'string' || containerSize <= 0) return null;
  const numeric = parseFloat(val);
  return Number.isNaN(numeric) ? null : (numeric / 100) * containerSize;
}
function getElementDimensions(elem: HTMLElement | null): {
  width: number;
  height: number;
} {
  if (!elem) return { width: 0, height: 0 };
  return { width: elem.clientWidth, height: elem.clientHeight };
}

/** For styling the corner/edge indicators that appear during active resize */
const Indicators = styled.div<{ $bound?: 'row' | 'column' }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  span {
    position: absolute;
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 100%;
    display: block;
    box-shadow: 0px 0px 12px -1px rgba(0, 0, 0, 0.25);
    z-index: 99999;
    pointer-events: none;
    border: 2px solid #36a9e0;

    &:nth-child(1) {
      ${({ $bound }) =>
        $bound
          ? $bound === 'row'
            ? `
                left: 50%;
                top: -5px;
                transform: translateX(-50%);
              `
            : `
                top: 50%;
                left: -5px;
                transform: translateY(-50%);
              `
          : `
              left: -5px;
              top: -5px;
            `}
    }
    &:nth-child(2) {
      right: -5px;
      top: -5px;
      display: ${({ $bound }) => ($bound ? 'none' : 'block')};
    }
    &:nth-child(3) {
      ${({ $bound }) =>
        $bound
          ? $bound === 'row'
            ? `
                left: 50%;
                bottom: -5px;
                transform: translateX(-50%);
              `
            : `
                bottom: 50%;
                left: -5px;
                transform: translateY(-50%);
              `
          : `
              left: -5px;
              bottom: -5px;
            `}
    }
    &:nth-child(4) {
      bottom: -5px;
      right: -5px;
      display: ${({ $bound }) => ($bound ? 'none' : 'block')};
    }
  }
`;

export interface ResizerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onResize'> {
  /** The node's width/height prop keys, e.g. { width: 'width', height: 'height' } */
  propKey: { width: string; height: string };
  children?: ReactNode;
  style?: CSSProperties;
}

/**
 * Combines logic from your current Resizer + exemplar Resizer:
 * - Uses your imports and structure so it compiles error-free
 * - Keeps the improved resizing flow from the exemplar
 */
export const Resizer: React.FC<ResizerProps> = ({
  propKey,
  children,
  style,
  ...rest
}) => {
  const {
    id,
    actions: { setProp },
    connectors: { connect },
    fillSpace,
    nodeWidth,
    nodeHeight,
    parent,
    active,
    inNodeContext,
  } = useNode((node: any) => ({
    parent: node.data.parent,
    active: node.events.selected,
    nodeWidth: node.data.props[propKey.width],
    nodeHeight: node.data.props[propKey.height],
    fillSpace: node.data.props.fillSpace,
  }));

  const { isRootNode, parentDirection } = useEditor((state, query) => ({
    parentDirection:
      parent && state.nodes[parent]
        ? state.nodes[parent].data.props.flexDirection
        : undefined,
    isRootNode: query.node(id).isRoot(),
  }));

  const resizable = useRef<Resizable | null>(null);
  const isResizing = useRef(false);

  /** Cache the dimension strings stored in the node's props */
  const nodeDimensions = useRef({
    width: nodeWidth ?? 'auto',
    height: nodeHeight ?? 'auto',
  });

  /** The dimension we pass to <Resizable> must be numeric px, so we track an internal state. */
  const [internalDimensions, setInternalDimensions] = useState({
    width: 0,
    height: 0,
  });

  /** Because we'll update the dimension while resizing, we track the "start" dimension in px. */
  const editingDimensions = useRef({ width: 0, height: 0 });

  const updateInternalDimensionsWithOriginal = useCallback(() => {
    if (!resizable.current?.resizable) return;
    const dom = resizable.current.resizable;
    if (!dom.parentElement) return;

    const parentDims = getElementDimensions(dom.parentElement);
    const { width: w, height: h } = nodeDimensions.current;

    let pxW = parentDims.width;
    if (isPercentage(w)) {
      const val = percentToPx(w, parentDims.width);
      pxW = val ?? parentDims.width;
    } else if (w !== 'auto') {
      pxW = parseInt(w) || parentDims.width;
    }

    let pxH = parentDims.height;
    if (isPercentage(h)) {
      const val = percentToPx(h, parentDims.height);
      pxH = val ?? parentDims.height;
    } else if (h !== 'auto') {
      pxH = parseInt(h) || parentDims.height;
    }

    setInternalDimensions({ width: pxW, height: pxH });
  }, []);

  const updateInternalDimensionsInPx = useCallback(() => {
    if (!resizable.current?.resizable) return;
    const dom = resizable.current.resizable;
    if (!dom.parentElement) return;

    const parentDims = getElementDimensions(dom.parentElement);
    const { width: w, height: h } = nodeDimensions.current;

    let pxW = parentDims.width;
    if (isPercentage(w)) {
      const val = percentToPx(w, parentDims.width);
      pxW = val ?? parentDims.width;
    } else if (w !== 'auto') {
      pxW = parseInt(w) || parentDims.width;
    }

    let pxH = parentDims.height;
    if (isPercentage(h)) {
      const val = percentToPx(h, parentDims.height);
      pxH = val ?? parentDims.height;
    } else if (h !== 'auto') {
      pxH = parseInt(h) || parentDims.height;
    }

    setInternalDimensions({ width: pxW, height: pxH });
  }, []);

  // Sync if nodeWidth/nodeHeight changes
  useEffect(() => {
    nodeDimensions.current.width = nodeWidth;
    nodeDimensions.current.height = nodeHeight;
    if (!isResizing.current) {
      updateInternalDimensionsWithOriginal();
    }
  }, [nodeWidth, nodeHeight, updateInternalDimensionsWithOriginal]);

  // On window resize, recalc if not resizing
  useEffect(() => {
    const listener = debounce(() => {
      if (!isResizing.current) updateInternalDimensionsWithOriginal();
    }, 50);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [updateInternalDimensionsWithOriginal]);

  const getUpdatedDimensions = (deltaW: number, deltaH: number) => {
    return {
      width: editingDimensions.current.width + deltaW,
      height: editingDimensions.current.height + deltaH,
    };
  };

  /** re-resizable’s onResize callback */
  const onResize: ResizeCallback = (
    _evt,
    _direction,
    _elementRef,
    delta: NumberSize
  ) => {
    const dom = resizable.current?.resizable;
    if (!dom || !dom.parentElement) return;

    const { width: newW, height: newH } = getUpdatedDimensions(
      delta.width,
      delta.height
    );
    const parentDims = getElementDimensions(dom.parentElement);

    let finalW = nodeDimensions.current.width;
    let finalH = nodeDimensions.current.height;

    // Convert widths
    if (isPercentage(finalW)) {
      const val = pxToPercent(newW, parentDims.width);
      finalW = Number.isFinite(val) ? `${val}%` : `${newW}px`;
    } else {
      finalW = `${newW}px`;
    }

    // Convert heights
    if (isPercentage(finalH)) {
      const val = pxToPercent(newH, parentDims.height);
      finalH = Number.isFinite(val) ? `${val}%` : `${newH}px`;
    } else {
      finalH = `${newH}px`;
    }

    // If parent is auto => fallback to px
    if (isPercentage(finalW) && dom.parentElement.style.width === 'auto') {
      finalW = `${newW}px`;
    }
    if (isPercentage(finalH) && dom.parentElement.style.height === 'auto') {
      finalH = `${newH}px`;
    }

    // Set the new dimension in node.props
    setProp((props: any) => {
      props[propKey.width] = finalW;
      props[propKey.height] = finalH;
    }, 500);
  };

  return (
    <Resizable
      enable={[
        'top',
        'left',
        'bottom',
        'right',
        'topLeft',
        'topRight',
        'bottomLeft',
        'bottomRight',
      ].reduce((acc, dir) => {
        acc[dir as ResizeDirection] = active && inNodeContext;
        return acc;
      }, {} as Record<ResizeDirection, boolean>)}
      className={cx({
        'm-auto': isRootNode,
        flex: true,
      })}
      ref={(ref) => {
        resizable.current = ref;
        if (ref?.resizable instanceof HTMLElement) {
          connect(ref.resizable);
        }
      }}
      size={internalDimensions}
      style={style}
      onResizeStart={(evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        updateInternalDimensionsInPx();

        const dom = resizable.current?.resizable;
        if (dom) {
          editingDimensions.current = {
            width: dom.getBoundingClientRect().width,
            height: dom.getBoundingClientRect().height,
          };
        }
        isResizing.current = true;
      }}
      onResize={onResize}
      onResizeStop={() => {
        isResizing.current = false;
        updateInternalDimensionsWithOriginal();
      }}
      {...rest}
    >
      {children}
      {active && (
        <Indicators $bound={fillSpace === 'yes' ? parentDirection : undefined}>
          <span />
          <span />
          <span />
          <span />
        </Indicators>
      )}
    </Resizable>
  );
};
