// webview-ui/src/components/PropertiesSidebar/UI/Item.tsx

import React from 'react';
import { Box } from '@mui/material';

interface ItemProps {
  children: React.ReactNode;
}

/**
 * A light "Item" wrapper that just adds consistent spacing.
 */
export const Item: React.FC<ItemProps> = ({ children }) => {
  return <Box sx={{ mb: 2 /* margin bottom */ }}>{children}</Box>;
};
