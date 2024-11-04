import React, { useState } from 'react';
import { TextField, Text, Icon, Separator } from '@fluentui/react';
import { useEditor } from '@craftjs/core';
import { Container, Textbox } from '../UserComponents';
import './ComponentsTab.css';

interface ComponentItem {
  key: string;
  icon: string;
  name: string;
  component: React.ElementType;
}

const basicElements: ComponentItem[] = [
  {
    key: 'container',
    icon: 'CubeShape',
    name: 'Container',
    component: Container,
  },
  { key: 'textbox', icon: 'TextField', name: 'Textbox', component: Textbox },
];

const smartComponents: ComponentItem[] = [];

const graphElements: ComponentItem[] = [];

const ComponentsTab: React.FC = () => {
  const { connectors } = useEditor();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter function to match components based on search query
  const filterComponents = (components: ComponentItem[]) =>
    components.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Filtered components based on the search query
  const filteredBasicElements = filterComponents(basicElements);
  const filteredSmartComponents = filterComponents(smartComponents);
  const filteredGraphElements = filterComponents(graphElements);

  return (
    <div
      className="components-tab"
      onDragOver={(e) => {
        e.preventDefault(); // Necessary to allow drag over
        console.log('Hovering over Component Tab');
      }}
    >
      {/* Search Bar */}
      <TextField
        placeholder="Search components..."
        className="search-bar"
        iconProps={{ iconName: 'Search' }}
        value={searchQuery}
        onChange={(e, newValue) => setSearchQuery(newValue || '')}
      />

      {/* Basic Elements Section */}
      <div className="components-grid">
        {filteredBasicElements.map((item) => (
          <div
            key={item.key}
            className="component-card"
            ref={(ref) =>
              ref && connectors.create(ref, React.createElement(item.component))
            }
            draggable={true}
            onDragStart={() => console.log(`Drag started ${item.name}`)}
            onDragEnd={() => console.log(`Drag ended ${item.name}`)}
          >
            <Icon iconName={item.icon} className="component-icon" />
            <Text className="component-name">{item.name}</Text>
          </div>
        ))}
      </div>

      <Separator className="section-divider" />

      {/* Smart Components Section */}
      <div className="components-grid">
        {filteredSmartComponents.map((item) => (
          <div
            key={item.key}
            className="component-card"
            ref={(ref) =>
              ref && connectors.create(ref, React.createElement(item.component))
            }
            draggable={true}
            onDragStart={() => console.log(`Drag started ${item.name}`)}
            onDragEnd={() => console.log(`Drag ended ${item.name}`)}
          >
            <Icon iconName={item.icon} className="component-icon" />
            <Text className="component-name">{item.name}</Text>
          </div>
        ))}
      </div>

      <Separator className="section-divider" />

      {/* Graph Elements Section */}
      <Text variant="xLarge" className="section-title">
        Graph Elements
      </Text>
      {/* Graph Elements Section */}
      <div className="components-grid">
        {filteredGraphElements.map((item) => (
          <div
            key={item.key}
            className="component-card"
            ref={(ref) =>
              ref && connectors.create(ref, React.createElement(item.component))
            }
            draggable={true}
            onDragStart={() => console.log(`Drag started ${item.name}`)}
            onDragEnd={() => console.log(`Drag ended ${item.name}`)}
          >
            <Icon iconName={item.icon} className="component-icon" />
            <Text className="component-name">{item.name}</Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentsTab;
