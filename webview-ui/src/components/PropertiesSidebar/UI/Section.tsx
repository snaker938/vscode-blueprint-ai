// webview-ui/src/components/PropertiesSidebar/UI/Section.tsx

import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  subtitle?: string;
  /**
   * Optional: if you want the Accordion to show no outer border or padding.
   */
  disableGutters?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  subtitle,
  defaultExpanded = false,
  disableGutters = false,
}) => {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters={disableGutters}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div>
          <Typography variant="subtitle1">{title}</Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </div>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};
