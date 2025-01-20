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
}

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  defaultExpanded = false,
}) => {
  return (
    <Accordion defaultExpanded={defaultExpanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};
