import React from 'react';
import { TextField, Text, Icon, Separator } from '@fluentui/react';
import './ComponentsTab.css';

const basicElements = [
  { key: 'container', icon: 'CubeShape', name: 'Container' },
  { key: 'button', icon: 'ButtonControl', name: 'Button' },
  { key: 'image', icon: 'FileImage', name: 'Image' },
  { key: 'heading', icon: 'Header1', name: 'Heading' },
  { key: 'textbox', icon: 'TextField', name: 'Textbox' },
  { key: 'icon', icon: 'Emoji2', name: 'Icon' },
  { key: 'link', icon: 'Link', name: 'Link' },
];

const smartComponents = [
  { key: 'buttonGroup', icon: 'GroupedList', name: 'Button Group' },
  { key: 'inputBox', icon: 'TextField', name: 'Input Box' },
  { key: 'dropdown', icon: 'Dropdown', name: 'Dropdown' },
  { key: 'checkbox', icon: 'CheckboxComposite', name: 'Checkbox' },
  { key: 'radioButtons', icon: 'RadioBtnOn', name: 'Radio Buttons' },
  { key: 'slider', icon: 'Slider', name: 'Slider' },
  { key: 'starRating', icon: 'FavoriteStar', name: 'Star Rating' },
  { key: 'searchBox', icon: 'Search', name: 'Search Box' },
];

const graphElements = [
  { key: 'barChart', icon: 'BarChart4', name: 'Bar Chart' },
  { key: 'pieChart', icon: 'DonutChart', name: 'Pie Chart' },
  { key: 'lineChart', icon: 'LineChart', name: 'Line Chart' },
];

const ComponentsTab: React.FC = () => {
  return (
    <div className="components-tab">
      {/* Search Bar */}
      <TextField
        placeholder="Search components..."
        className="search-bar"
        iconProps={{ iconName: 'Search' }}
      />

      {/* Basic Elements Section */}
      <Text variant="xLarge" className="section-title">
        Basic Elements
      </Text>
      <div className="components-grid">
        {basicElements.map((item) => (
          <div key={item.key} className="component-card">
            <Icon iconName={item.icon} className="component-icon" />
            <Text className="component-name">{item.name}</Text>
          </div>
        ))}
      </div>

      <Separator className="section-divider" />

      {/* Smart Components Section */}
      <Text variant="xLarge" className="section-title">
        Smart Components
      </Text>
      <div className="components-grid">
        {smartComponents.map((item) => (
          <div key={item.key} className="component-card">
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
      <div className="components-grid">
        {graphElements.map((item) => (
          <div key={item.key} className="component-card">
            <Icon iconName={item.icon} className="component-icon" />
            <Text className="component-name">{item.name}</Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentsTab;
