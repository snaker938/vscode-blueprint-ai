// PagesGrid.tsx

import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { Editor, Frame, Resolver } from '@craftjs/core';

import { useBlueprintContext } from '../../../store/useBlueprintContext';
import { Page } from '../../../store/store'; // Adjust relative path as needed

// Import built-in components:
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

const ThumbnailWrapper = styled.div`
  width: 100%;
  height: 80px;
  background-color: #eaeaea;
  position: relative;
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
/* 4) A “mini” CraftJS preview that scales to fit inside 80px height. */
/* ------------------------------------------------------------------ */

interface MiniCraftPreviewProps {
  layoutJSON?: string;
}

const ScaledEditorWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: top left;
  pointer-events: none;
`;

//
//  The “design canvas” below is the fixed-size area
//  we assume your pages are roughly designed for.
//
const DesignCanvas = styled.div`
  width: 1000px; /* adjust if your typical page width is different */
  height: 800px; /* adjust if your typical page height is different */
  background: white; /* for visual reference during dev, optional */
`;

const MiniCraftPreview: React.FC<MiniCraftPreviewProps> = ({ layoutJSON }) => {
  const { customComponents } = useBlueprintContext();
  const currentResolver = useMemo(
    () => buildResolver(customComponents),
    [customComponents]
  );

  // Safely parse the stored layout JSON:
  const data = useMemo(() => {
    if (!layoutJSON) return {};
    try {
      return JSON.parse(layoutJSON);
    } catch {
      return {};
    }
  }, [layoutJSON]);

  // We’ll measure the ThumbnailWrapper’s size, then scale accordingly.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.1); // default scale

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;

    const { offsetWidth, offsetHeight } = wrapperRef.current;
    // Our chosen "design canvas" is 1200 x 800:
    const designW = 1200;
    const designH = 800;

    // Figure out how to fit that into our thumbnail:
    const wScale = offsetWidth / designW;
    const hScale = offsetHeight / designH;
    const finalScale = Math.min(wScale, hScale);

    setScale(finalScale);
  }, []);

  return (
    <>
      {/* The area we measure to decide the scale */}
      <div ref={wrapperRef} style={{ width: '100%', height: '100%' }} />

      <ScaledEditorWrapper style={{ transform: `scale(${scale})` }}>
        <DesignCanvas>
          <Editor resolver={currentResolver} enabled={false}>
            <Frame data={data} />
          </Editor>
        </DesignCanvas>
      </ScaledEditorWrapper>
    </>
  );
};
