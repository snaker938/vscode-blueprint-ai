import React from 'react';
import { useNode } from '@craftjs/core';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface PropertySectionProps {
  /** Title displayed in the accordion summary */
  title: string;
  /** List of prop keys to retrieve from the node data */
  props?: string[];
  /**
   * Optional function to generate summary text.
   * It receives an object of { [key]: nodePropValue }.
   */
  summary?: (nodeProps: Record<string, any>) => React.ReactNode;
  /** Accordion content (usually property controls) */
  children?: React.ReactNode;
  /** If true, the accordion is expanded by default */
  defaultExpanded?: boolean;
}

/**
 * PropertySection
 * A collapsible panel for grouping related property controls.
 */
export const PropertySection: React.FC<PropertySectionProps> = ({
  title,
  props,
  summary,
  children,
  defaultExpanded = false,
}) => {
  const { nodeProps } = useNode((node) => ({
    nodeProps:
      props?.reduce((res, key) => {
        res[key] = node.data.props[key] ?? null;
        return res;
      }, {} as Record<string, any>) || {},
  }));

  // Inline style definitions for minimal CSS
  const accordionStyles = {
    background: 'transparent',
    boxShadow: 'none',
    '&:before': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    '&.Mui-expanded': {
      margin: '0',
      minHeight: '40px',
      '&:before': {
        opacity: 1,
      },
      '& + .MuiAccordion-root:before': {
        display: 'block',
      },
    },
  };

  const summaryStyles = {
    minHeight: '36px',
    padding: 0,
    '.MuiAccordionSummary-content': {
      margin: 0,
    },
  };

  const detailsStyles = {
    padding: '0px 24px 20px',
  };

  return (
    <Accordion defaultExpanded={defaultExpanded} sx={accordionStyles}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summaryStyles}>
        <div style={{ width: '100%' }}>
          <Grid container direction="row" alignItems="center" spacing={3}>
            <Grid item xs={4}>
              <h5 style={{ margin: 0 }}>{title}</h5>
            </Grid>
            {summary && props && (
              <Grid item xs={8} style={{ textAlign: 'right' }}>
                {summary(
                  props.reduce((acc, key) => {
                    acc[key] = nodeProps[key];
                    return acc;
                  }, {} as Record<string, any>)
                )}
              </Grid>
            )}
          </Grid>
        </div>
      </AccordionSummary>
      <AccordionDetails sx={detailsStyles}>
        <Divider style={{ marginBottom: '10px' }} />
        <Grid container spacing={1}>
          {children}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
