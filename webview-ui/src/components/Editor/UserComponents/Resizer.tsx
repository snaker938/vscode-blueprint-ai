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
import styled from 'styled-components';

/**
 * Utility: is val a percent string?
 */
function isPercentage(val: string | number): boolean {
  return typeof val === 'string' && val.trim().endsWith('%');
}

/**
 * px => % given container dimension
 */
function pxToPercent(px: number, containerSize: number): number {
  if (containerSize <= 0) return px;
  return (px / containerSize) * 100;
}

/**
 * % => px given container dimension
 */
function percentToPx(
  val: string | number,
  containerSize: number
): number | null {
  if (typeof val !== 'string' || containerSize <= 0) return null;
  const numericPart = parseFloat(val);
  if (Number.isNaN(numericPart)) return null;
  return (numericPart / 100) * containerSize;
}

/**
 * Return clientWidth/clientHeight from an element
 */
function getElementDimensions(elem: HTMLElement | null): {
  width: number;
  height: number;
} {
  if (!elem) return { width: 0, height: 0 };
  return {
    width: elem.clientWidth,
    height: elem.clientHeight,
  };
}

export interface ResizerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * propKey must contain the named props for width/height in the Node's data,
   * e.g. { width: 'width', height: 'height' }
   */
  propKey: {
    width: string;
    height: string;
  };
  children?: ReactNode;
  style?: CSSProperties;
}

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
            transform:translateX(-50%);
          `
            : `
            top: 50%;
            left: -5px;
            transform:translateY(-50%);
          `
          : `
          left: -5px;
          top:-5px;
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
            transform:translateX(-50%);
          `
            : `
            bottom: 50%;
            left: -5px;
            transform:translateY(-50%);
          `
          : `
          left: -5px;
          bottom:-5px;
        `}
    }
    &:nth-child(4) {
      bottom: -5px;
      right: -5px;
      display: ${({ $bound }) => ($bound ? 'none' : 'block')};
    }
  }
`;

/**
 * Resizer - wraps children in a re-resizable container,
 * updates Node props (width, height) with px/% logic.
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
  const isResizing = useRef<boolean>(false);

  // Store node's dimension strings in a ref
  const nodeDimensions = useRef<{ width: string; height: string }>({
    width: nodeWidth ?? 'auto',
    height: nodeHeight ?? 'auto',
  });

  // For re-resizable, we keep internal px dimensions
  const [internalDimensions, setInternalDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  // Track the dimension while dragging
  const editingDimensions = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  /**
   * Convert node's dimension to px for re-resizable
   */
  const updateInternalDimensionsInPx = useCallback(() => {
    const ref = resizable.current;
    if (!ref || !ref.resizable) return;

    const parentEl = ref.resizable.parentElement;
    if (!parentEl) return;

    const parentDims = getElementDimensions(parentEl);
    const { width: nW, height: nH } = nodeDimensions.current;

    let pxW = parentDims.width;
    if (isPercentage(nW)) {
      const val = percentToPx(nW, parentDims.width);
      pxW = val ?? parentDims.width;
    } else if (nW !== 'auto') {
      pxW = parseInt(nW) || parentDims.width;
    }

    let pxH = parentDims.height;
    if (isPercentage(nH)) {
      const val = percentToPx(nH, parentDims.height);
      pxH = val ?? parentDims.height;
    } else if (nH !== 'auto') {
      pxH = parseInt(nH) || parentDims.height;
    }

    setInternalDimensions({ width: pxW, height: pxH });
  }, []);

  /**
   * Reset internal dims from nodeDimensions
   */
  const updateInternalDimensionsWithOriginal = useCallback(() => {
    const ref = resizable.current;
    if (!ref || !ref.resizable) return;

    const parentEl = ref.resizable.parentElement;
    if (!parentEl) return;

    const parentDims = getElementDimensions(parentEl);
    const { width: nW, height: nH } = nodeDimensions.current;

    let pxW = parentDims.width;
    if (isPercentage(nW)) {
      const val = percentToPx(nW, parentDims.width);
      pxW = val ?? parentDims.width;
    } else if (nW !== 'auto') {
      pxW = parseInt(nW) || parentDims.width;
    }

    let pxH = parentDims.height;
    if (isPercentage(nH)) {
      const val = percentToPx(nH, parentDims.height);
      pxH = val ?? parentDims.height;
    } else if (nH !== 'auto') {
      pxH = parseInt(nH) || parentDims.height;
    }

    setInternalDimensions({ width: pxW, height: pxH });
  }, []);

  /**
   * If nodeWidth/nodeHeight changes and we aren't resizing, resync
   */
  useEffect(() => {
    nodeDimensions.current.width = nodeWidth;
    nodeDimensions.current.height = nodeHeight;
    if (!isResizing.current) {
      updateInternalDimensionsWithOriginal();
    }
  }, [nodeWidth, nodeHeight, updateInternalDimensionsWithOriginal]);

  /**
   * On window resize => recalc if not resizing
   */
  useEffect(() => {
    const listener = debounce(() => {
      if (!isResizing.current) updateInternalDimensionsWithOriginal();
    }, 50);
    window.addEventListener('resize', listener);
    return () => {
      window.removeEventListener('resize', listener);
    };
  }, [updateInternalDimensionsWithOriginal]);

  /**
   * Calculate new dimension from deltas
   */
  const getUpdatedDimensions = (
    deltaWidth: number,
    deltaHeight: number
  ): { width: number; height: number } => {
    const currW = editingDimensions.current.width;
    const currH = editingDimensions.current.height;
    return {
      width: currW + deltaWidth,
      height: currH + deltaHeight,
    };
  };

  /**
   * The actual onResize callback typed as ResizeCallback
   */
  const onResize: ResizeCallback = (
    _event,
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

    let finalW = nodeDimensions.current.width;
    let finalH = nodeDimensions.current.height;
    const parentDims = getElementDimensions(dom.parentElement);

    // Convert newW => px or % if original is percent
    if (isPercentage(nodeDimensions.current.width)) {
      const val = pxToPercent(newW, parentDims.width);
      finalW = Number.isFinite(val) ? `${val}%` : `${newW}px`;
    } else {
      finalW = `${newW}px`;
    }

    // Convert newH => px or % if original is percent
    if (isPercentage(nodeDimensions.current.height)) {
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

    setProp((prop: any) => {
      prop[propKey.width] = finalW;
      prop[propKey.height] = finalH;
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
      className={cx([
        {
          'm-auto': isRootNode,
          flex: true,
        },
      ])}
      ref={(ref) => {
        resizable.current = ref;
        // Connect to craft node if we have an HTMLElement
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
