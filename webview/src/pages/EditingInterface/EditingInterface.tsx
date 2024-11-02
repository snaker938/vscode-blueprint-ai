import React, { useState } from 'react';
import { Editor, Frame, SerializedNodes } from '@craftjs/core';
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
import PagesTab from '../../components/PagesTab/PagesTab';

interface Page {
  id: number;
  name: string;
  thumbnail: string;
  content: string | SerializedNodes;
}

const EditingInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState('components');

  // Pages state lifted to EditingInterface
  const [pages, setPages] = useState<Page[]>([
    {
      id: Date.now(),
      name: 'Untitled Page',
      thumbnail: '',
      content: '',
    },
  ]);
  const [selectedPageId, setSelectedPageId] = useState<number>(pages[0].id);

  const getSelectedPage = () =>
    pages.find((page) => page.id === selectedPageId);

  const addPage = (name: string) => {
    const newPage: Page = {
      id: Date.now(),
      name: name || `Page ${pages.length + 1}`,
      thumbnail: '',
      content: null,
    };
    setPages([...pages, newPage]);
    setSelectedPageId(newPage.id);
  };

  const renamePage = (id: number, newName: string) => {
    setPages(
      pages.map((page) => (page.id === id ? { ...page, name: newName } : page))
    );
  };

  const deletePage = (id: number) => {
    const updatedPages = pages.filter((page) => page.id !== id);
    setPages(updatedPages);
    // Update selectedPageId
    if (selectedPageId === id && updatedPages.length > 0) {
      setSelectedPageId(updatedPages[0].id);
    } else if (updatedPages.length === 0) {
      // If no pages left, create a new one
      addPage('Untitled Page');
    }
  };

  const resetPages = () => {
    setPages([]);
    addPage('Untitled Page');
  };

  const handlePageClick = (id: number) => {
    setSelectedPageId(id);
  };

  // Function to update page content
  const updatePageContent = (content: string | SerializedNodes) => {
    setPages(
      pages.map((page) =>
        page.id === selectedPageId ? { ...page, content } : page
      )
    );
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'components':
        return <ComponentsTab />;
      case 'layout':
        return <div>Layout content goes here</div>;
      case 'pages':
        return (
          <PagesTab
            pages={pages}
            selectedPageId={selectedPageId}
            onAddPage={addPage}
            onRenamePage={renamePage}
            onDeletePage={deletePage}
            onResetPages={resetPages}
            onPageClick={handlePageClick}
          />
        );
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
        onNodesChange={(query) => {
          const json = query.serialize();
          updatePageContent(json);
        }}
      >
        <Sidebar activeTab={activeTab} onTabClick={setActiveTab} />
        {renderActiveTabContent()}
        <div className="main-content">
          <Frame data={getSelectedPage()?.content || null}>
            {/* Canvas content */}
          </Frame>
        </div>
      </Editor>
    </div>
  );
};

export default EditingInterface;
