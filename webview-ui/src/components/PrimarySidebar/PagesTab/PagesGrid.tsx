// PagesGrid.tsx

import React, { useMemo, useRef, useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import { Editor, Frame, Resolver } from '@craftjs/core';

import { useBlueprintContext } from '../../../store/useBlueprintContext';
import { Page } from '../../../store/store'; // Adjust relative path as needed

// Import built-in user components:
import { Container } from '../../UserComponents/Container';
import { Text } from '../../UserComponents/Text';
import { Navigation } from '../../UserComponents/Navigation';
import { Video } from '../../UserComponents/Video';
import { StarRating } from '../../UserComponents/StarRating';
import { SearchBox } from '../../UserComponents/SearchBox';
import { Slider } from '../../UserComponents/Slider';
import { Button } from '../../UserComponents/Button';
import { Image } from '../../UserComponents/Image';

/* ------------------------------------------------------------------ */
/* 1) Utility to build the CraftJS resolver: built-in + dynamic comps */
/* ------------------------------------------------------------------ */
function buildResolver(dynamicComponents: Record<string, React.FC>): Resolver {
  return {
    Container,
    Text,
    Navigation,
    Video,
    StarRating,
    SearchBox,
    Slider,
    Button,
    Image,
    ...dynamicComponents,
  };
}

/* --------------------------------------------------------------- */
/* 2) Styled Components for the overall grid and the Page “cards.” */
/* --------------------------------------------------------------- */

const GridArea = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  padding: 0;
`;

const PageCard = styled.div<{ selected: boolean }>`
  background-color: rgb(227, 226, 226);
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  ${({ selected }) =>
    selected &&
    `
      border-color: #4b3f72;
      box-shadow: 0px 4px 8px rgba(75, 63, 114, 0.2);
    `}

  &:hover {
    border-color: #4b3f72;
    box-shadow: 0px 4px 8px rgba(75, 63, 114, 0.2);
  }
`;

/**
 * This is the container for the thumbnail preview.
 * We'll fill it and clip any overflow.
 */
const ThumbnailWrapper = styled.div`
  width: 100%;
  height: 80px;
  background-color: #eaeaea;
  position: relative; /* So the scaled content can be absolutely positioned */
  overflow: hidden;
`;

const PageName = styled.div`
  padding: 5px;
  font-size: 14px;
  color: #333333;
  font-weight: 500;
`;

/* ------------------------------------------------------------------ */
/* 3) The main PagesGrid component that loops through each Page card. */
/* ------------------------------------------------------------------ */

interface PagesGridProps {
  pages: Page[];
  selectedPageId: number;
  onSelectPage: (pageId: number) => void;
}

export const PagesGrid: React.FC<PagesGridProps> = ({
  pages,
  selectedPageId,
  onSelectPage,
}) => {
  return (
    <GridArea>
      {pages.map((page) => (
        <PageCard
          key={page.id}
          selected={page.id === selectedPageId}
          onClick={() => onSelectPage(page.id)}
        >
          <ThumbnailWrapper>
            <MiniCraftPreview layoutJSON={page.layout} />
          </ThumbnailWrapper>
          <PageName>{page.name}</PageName>
        </PageCard>
      ))}
    </GridArea>
  );
};

/* ------------------------------------------------------------------ */
/* 4) Mini preview that measures the *actual* rendered content size   */
/*    and then scales to fill the thumbnail, distorting if needed.    */
/* ------------------------------------------------------------------ */

interface MiniCraftPreviewProps {
  layoutJSON?: string;
}

/**
 * Absolutely-positioned container that fills the thumbnail.
 */
const ScaledContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  /* fill the entire 80px container area */
  width: 100%;
  height: 100%;
  pointer-events: none;
  transform-origin: top left; /* we scale from the top-left corner */
`;

/**
 * The actual page content container (unscaled).
 * We'll measure this in a "neutral" state, then apply transform scale.
 */
const PageContent = styled.div`
  /* We keep this at transform: none for measuring initially. */
  position: relative;
`;

export const MiniCraftPreview: React.FC<MiniCraftPreviewProps> = ({
  layoutJSON,
}) => {
  const { customComponents } = useBlueprintContext();
  const currentResolver = useMemo(
    () => buildResolver(customComponents),
    [customComponents]
  );

  // Safely parse the layout JSON:
  const data = useMemo(() => {
    if (!layoutJSON) return {};
    try {
      return JSON.parse(layoutJSON);
    } catch {
      return {};
    }
  }, [layoutJSON]);

  // Refs for measuring
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // We'll store the transform scale in React state:
  const [scale, setScale] = useState({ x: 1, y: 1 });

  // Once content is actually rendered, measure then apply scale:
  useLayoutEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;

    // 1) Temporarily clear any transform to measure the "natural" size
    contentRef.current.style.transform = 'none';

    // 2) Measure parent's (thumbnail's) size
    const { offsetWidth: thumbW, offsetHeight: thumbH } = wrapperRef.current;

    // 3) Measure the *actual* rendered size of the content
    const contentW = contentRef.current.scrollWidth;
    const contentH = contentRef.current.scrollHeight;

    if (contentW === 0 || contentH === 0) {
      return; // avoid dividing by zero if something is not rendered
    }

    // 4) Compute scale for X and Y to fill the thumbnail completely
    const scaleX = thumbW / contentW;
    const scaleY = thumbH / contentH;

    // Because you want it to fill no matter if it distorts, we set both:
    setScale({ x: scaleX, y: scaleY });
  }, [data]);

  return (
    // This outer div ensures we get the correct 80px area
    <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
      <ScaledContent
        style={{
          transform: `scale(${scale.x}, ${scale.y})`,
        }}
      >
        <PageContent ref={contentRef}>
          <Editor resolver={currentResolver} enabled={false}>
            <Frame data={data} />
          </Editor>
        </PageContent>
      </ScaledContent>
    </div>
  );
};
