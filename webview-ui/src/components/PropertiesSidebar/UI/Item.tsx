// webview-ui/src/components/PropertiesSidebar/UI/Item.tsx

import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface ItemProps {
  children: React.ReactNode;
  /**
   * Allow overriding the default sx for custom spacing or other styles.
   */
  sx?: SxProps<Theme>;
}

/**
 * A light "Item" wrapper that adds consistent spacing and optionally custom style.
 */
export const Item: React.FC<ItemProps> = ({ children, sx }) => {
  return (
    <Box
      sx={{
        mb: 2,
        ...(sx || {}),
      }}
    >
      {children}
    </Box>
  );
};
