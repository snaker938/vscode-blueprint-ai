import React from 'react';
import { TextField, Text, Icon, Separator } from '@fluentui/react';
import { useEditor } from '@craftjs/core';
import {
  Container,
  Button as UserButton,
  Heading,
  Textbox,
  IconComponent,
  LinkComponent,
  ButtonGroup,
  InputBox,
  Dropdown,
  Checkbox,
  RadioButtons,
  Slider,
  StarRating,
  SearchBox,
  BarChart,
  PieChart,
  LineChart,
} from '../UserComponents';
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
  {
    key: 'button',
    icon: 'ButtonControl',
    name: 'Button',
    component: UserButton,
  },
  { key: 'heading', icon: 'Header1', name: 'Heading', component: Heading },
  { key: 'textbox', icon: 'TextField', name: 'Textbox', component: Textbox },
  { key: 'icon', icon: 'Emoji2', name: 'Icon', component: IconComponent },
  { key: 'link', icon: 'Link', name: 'Link', component: LinkComponent },
];

const smartComponents: ComponentItem[] = [
  {
    key: 'buttonGroup',
    icon: 'GroupedList',
    name: 'Button Group',
    component: ButtonGroup,
  },
  {
    key: 'inputBox',
    icon: 'TextField',
    name: 'Input Box',
    component: InputBox,
  },
  { key: 'dropdown', icon: 'Dropdown', name: 'Dropdown', component: Dropdown },
  {
    key: 'checkbox',
    icon: 'CheckboxComposite',
    name: 'Checkbox',
    component: Checkbox,
  },
  {
    key: 'radioButtons',
    icon: 'RadioBtnOn',
    name: 'Radio Buttons',
    component: RadioButtons,
  },
  { key: 'slider', icon: 'Slider', name: 'Slider', component: Slider },
  {
    key: 'starRating',
    icon: 'FavoriteStar',
    name: 'Star Rating',
    component: StarRating,
  },
  {
    key: 'searchBox',
    icon: 'Search',
    name: 'Search Box',
    component: SearchBox,
  },
];

const graphElements: ComponentItem[] = [
  {
    key: 'barChart',
    icon: 'BarChart4',
    name: 'Bar Chart',
    component: BarChart,
  },
  {
    key: 'pieChart',
    icon: 'DonutChart',
    name: 'Pie Chart',
    component: PieChart,
  },
  {
    key: 'lineChart',
    icon: 'LineChart',
    name: 'Line Chart',
    component: LineChart,
  },
];

const ComponentsTab: React.FC = () => {
  const { connectors } = useEditor();

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
          <div
            key={item.key}
            className="component-card"
            ref={(ref) =>
              ref && connectors.create(ref, React.createElement(item.component))
            }
          >
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
          <div
            key={item.key}
            className="component-card"
            ref={(ref) =>
              ref && connectors.create(ref, React.createElement(item.component))
            }
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
      <div className="components-grid">
        {graphElements.map((item) => (
          <div
            key={item.key}
            className="component-card"
            ref={(ref) =>
              ref && connectors.create(ref, React.createElement(item.component))
            }
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
