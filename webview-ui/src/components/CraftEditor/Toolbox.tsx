import React from 'react';
import { useEditor } from '@craftjs/core';
import { Container } from '../UserComponents/Container';
import { Text as CraftText } from '../UserComponents/Text';

export const Toolbox: React.FC = () => {
  const { connectors } = useEditor();

  return (
    <div style={{ padding: 10 }}>
      <div
        ref={(ref) =>
          ref &&
          connectors.create(
            ref,
            <CraftText text="I'm brand new text!" fontSize={14} />
          )
        }
        style={{
          padding: 8,
          border: '1px solid black',
          marginBottom: 8,
          cursor: 'grab',
        }}
      >
        Drag New Text
      </div>

      <div
        ref={(ref) =>
          ref &&
          connectors.create(
            ref,
            <Container background="#EFEFEF" padding={10}>
              New Container
            </Container>
          )
        }
        style={{
          padding: 8,
          border: '1px solid black',
          marginBottom: 8,
          cursor: 'grab',
        }}
      >
        Drag New Container
      </div>
    </div>
  );
};
