// PagesGrid.tsx

import React, { useMemo } from 'react';
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

// A helper function to combine your built-in components plus any dynamic ones.
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
    ...dynamicComponents, // merges in any additional custom components
  };
}

/* ------------------ Styled Components ------------------ */

/** The outer grid container. */
const GridArea = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  padding: 0;
  width: 100%;
`;

/** Each page “card.” */
const PageCard = styled.div<{ selected: boolean }>`
  background-color: #ffffff;
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

/** The thumbnail area that will hold our mini CraftJS preview. */
const ThumbnailWrapper = styled.div`
  width: 100%;
  height: 80px;
  background-color: #eaeaea;
  position: relative;
  overflow: hidden;
`;

/** We'll transform the entire Frame to scale it down. */
const ScaledEditorContainer = styled.div`
  transform: scale(0.15); /* adjust to taste */
  transform-origin: top left;
  position: absolute;
  top: 0;
  left: 0;
`;

/** Page name label under the preview. */
const PageName = styled.div`
  padding: 5px;
  font-size: 14px;
  color: #333333;
  font-weight: 500;
`;

/* -------------------------------------------------- */

interface PagesGridProps {
  pages: Page[];
  selectedPageId: number;
  onSelectPage: (pageId: number) => void;
}

/**
 * Renders a grid of page cards, each showing a
 * mini CraftJS preview of that page's layout.
 */
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

/* -------------------------------------------------- */

/** A small, non-interactive CraftJS preview.
 *  Pass in the JSON string stored in `page.layout`.
 */
interface MiniCraftPreviewProps {
  layoutJSON?: string;
}

const MiniCraftPreview: React.FC<MiniCraftPreviewProps> = ({ layoutJSON }) => {
  const { customComponents } = useBlueprintContext();

  // Build the combined resolver
  const currentResolver = useMemo(
    () => buildResolver(customComponents),
    [customComponents]
  );

  // Safely parse the stored layout JSON
  const data = useMemo(() => {
    if (!layoutJSON) return {};
    try {
      return JSON.parse(layoutJSON);
    } catch {
      return {};
    }
  }, [layoutJSON]);

  return (
    <ScaledEditorContainer>
      <Editor
        resolver={currentResolver}
        enabled={false} // Disable user interaction for the preview
      >
        <Frame data={data} />
      </Editor>
    </ScaledEditorContainer>
  );
};
