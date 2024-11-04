import React, { useState } from 'react';
import { mergeStyles } from '@fluentui/react';
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

  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Add these class definitions after the state
  const overlayClass = mergeStyles({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Reduced opacity from 0.6 to 0.4
    backdropFilter: 'blur(2px)', // Adds slight blur effect
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', // Smoother easing
    opacity: isDragging ? 1 : 0,
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000, // Ensure overlay is above other content
  });

  const trashIconClass = mergeStyles({
    fontSize: '48px',
    color: '#ff4444',
    transform: isDraggingOver ? 'scale(1.2)' : 'scale(1)',
    transition: 'transform 0.2s ease',
  });

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
      style={{ position: 'relative' }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={() => {
        setIsDraggingOver(false);
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
            onDragStart={() => {
              setIsDragging(true);
            }}
            onDragEnd={() => {
              setIsDragging(false);
              setIsDraggingOver(false);
            }}
          >
            <Icon iconName={item.icon} className="component-icon" />
            <Text className="component-name">{item.name}</Text>
          </div>
        ))}
      </div>

      <div className={overlayClass}>
        <Icon iconName="Delete" className={trashIconClass} />
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
            onDragStart={() => {
              setIsDragging(true);
            }}
            onDragEnd={() => {
              setIsDragging(false);
              setIsDraggingOver(false);
            }}
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
            onDragStart={() => {
              setIsDragging(true);
            }}
            onDragEnd={() => {
              setIsDragging(false);
              setIsDraggingOver(false);
            }}
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
