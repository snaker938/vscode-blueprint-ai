import React, { useState } from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import Sidebar from '../../components/Sidebar/Sidebar';
import ComponentsTab from '../../components/ComponentsTab/ComponentsTab';
import { Container } from '../../components/UserComponents/Container';
import { Button } from '../../components/UserComponents/Button';
import { Textbox } from '../../components/UserComponents/Textbox';
import { Heading } from '../../components/UserComponents/Heading';
import { IconComponent } from '../../components/UserComponents/Icon';
import { LinkComponent } from '../../components/UserComponents/Link';
import { ButtonGroup } from '../../components/UserComponents/ButtonGroup';
import { InputBox } from '../../components/UserComponents/InputBox';
import { Dropdown } from '../../components/UserComponents/Dropdown';
import { Checkbox } from '../../components/UserComponents/Checkbox';
import { RadioButtons } from '../../components/UserComponents/RadioButtons';
import { Slider } from '../../components/UserComponents/Slider';
import { StarRating } from '../../components/UserComponents/StarRating';
import { SearchBox } from '../../components/UserComponents/SearchBox';
import { BarChart } from '../../components/UserComponents/BarChart';
import { PieChart } from '../../components/UserComponents/PieChart';
import { LineChart } from '../../components/UserComponents/LineChart';
import './EditingInterface.css';

const EditingInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState('components');

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'components':
        return <ComponentsTab />;
      case 'layout':
        return <div>Layout content goes here</div>;
      case 'pages':
        return <div>Pages content goes here</div>;
      case 'settings':
        return <div>Settings content goes here</div>;
      default:
        return null;
    }
  };

  return (
    <div className="editing-interface">
      <Editor
        resolver={{
          Button,
          Container,
          Textbox,
          Heading,
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
        }}
      >
        <Sidebar activeTab={activeTab} onTabClick={setActiveTab} />
        {renderActiveTabContent()}
        <div className="main-content">
          <Frame>
            <Element is={Container} padding={20} canvas>
              {/* Canvas starts empty */}
            </Element>
          </Frame>
        </div>
      </Editor>
    </div>
  );
};

export default EditingInterface;
