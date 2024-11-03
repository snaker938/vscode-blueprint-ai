import React, { useState } from 'react';
import { Editor, Frame, Element, SerializedNodes } from '@craftjs/core';
import Sidebar from '../../components/Sidebar/Sidebar';
import ComponentsTab from '../../components/ComponentsTab/ComponentsTab';
import LayoutTab from '../../components/LayoutTab/LayoutTab';
import { Container } from '../../components/UserComponents/Container';
import { Textbox } from '../../components/UserComponents/Textbox';

import './EditingInterface.css';
import PagesTab from '../../components/PagesTab/PagesTab';

interface Page {
  id: number;
  name: string;
  thumbnail: string;
  content: SerializedNodes | null;
}

const EditingInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState('components');

  const [pages, setPages] = useState<Page[]>([
    {
      id: Date.now(),
      name: 'Page 1',
      thumbnail: '',
      content: null,
    },
  ]);
  const [selectedPageId, setSelectedPageId] = useState<number>(pages[0].id);

  const getSelectedPage = () =>
    pages.find((page) => page.id === selectedPageId);

  const getNextPageNumber = () => {
    const pageNumbers = pages
      .map((page) => {
        const match = page.name.match(/^Page (\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((num) => num > 0);
    const maxPageNumber = pageNumbers.length > 0 ? Math.max(...pageNumbers) : 0;
    return maxPageNumber + 1;
  };

  const addPage = (name: string) => {
    const nextPageNumber = getNextPageNumber();
    const newPage: Page = {
      id: Date.now(),
      name: name || `Page ${nextPageNumber}`,
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
    if (updatedPages.length > 0) {
      setSelectedPageId(updatedPages[0].id);
    } else {
      addPage('Page 1');
    }
  };

  const resetPages = () => {
    const newPage: Page = {
      id: Date.now(),
      name: 'Page 1',
      thumbnail: '',
      content: null,
    };
    setPages([newPage]);
    setSelectedPageId(newPage.id);
  };

  const handlePageClick = (id: number) => {
    setSelectedPageId(id);
  };

  const updatePageContent = (content: SerializedNodes) => {
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
        return <div>Layout Tab</div>;
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
      default:
        return null;
    }
  };

  return (
    <div className="editing-interface">
      <Editor
        resolver={{
          Container,
          Textbox,
        }}
        onNodesChange={(query) => {
          const nodes = query.getSerializedNodes();
          updatePageContent(nodes);
        }}
      >
        <Sidebar activeTab={activeTab} onTabClick={setActiveTab} />
        {renderActiveTabContent()}
        <div className="main-content">
          <Frame data={getSelectedPage()?.content}>
            <Element
              canvas
              is={Container}
              background="rgba(255, 255, 255, 1)"
              padding={20}
              custom={{ displayName: 'App Canvas' }}
            >
              {/* Components will be dropped here */}
            </Element>
          </Frame>
        </div>
      </Editor>
    </div>
  );
};

export default EditingInterface;
