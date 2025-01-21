import React, { useState } from 'react';
import {
  IconButton,
  TextField,
  Modal,
  PrimaryButton,
  DefaultButton,
  // Icon,
  // Text
} from '@fluentui/react';
import styled from 'styled-components';
import './PagesTab.css';

import { Page, getGlobalPages, setGlobalPages } from './pageStore';
import SuggestedPages from '../../SuggestedPages/SuggestedPages';

/* ------------------ Styled Components ------------------ */

const Wrapper = styled.div`
  width: 300px;
  box-sizing: border-box;
  background-color: #f9f9f9;
  padding: 15px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

const TabTitle = styled.h2`
  margin: 0;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #4b3f72;
`;

const ActionIconsRow = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap; /* If icons exceed width, wrap to avoid horizontal scroll */
  gap: 8px;
  margin-bottom: 15px;
`;

const GridArea = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  padding: 0;
  width: 100%;
`;

const PageCard = styled.div<{ selected: boolean }>`
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  ${({ selected }) =>
    selected &&
    `
      border-color: #4b3f72;
      box-shadow: 0px 4px 8px rgba(75, 63, 114, 0.2);
    `}

  &:hover {
    border-color: #4b3f72;
    box-shadow: 0px 4px 8px rgba(75, 63, 114, 0.2);
  }
`;

const PageThumbnail = styled.div`
  width: 100%;
  height: 80px;
  background-color: #eaeaea;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PageName = styled.div`
  padding: 5px;
  font-size: 14px;
  color: #333333;
  font-weight: 500;
`;

/* ------------------ Component ------------------ */

const PagesTab: React.FC = () => {
  const [pages, setPages] = useState<Page[]>(() => getGlobalPages());
  const [selectedPageId, setSelectedPageId] = useState<number>(
    pages[0]?.id ?? 1
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addPageName, setAddPageName] = useState('');
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [showSuggested, setShowSuggested] = useState(false);

  const updatePages = (newPages: Page[]) => {
    setPages(newPages);
    setGlobalPages(newPages);
  };

  const handleAddPage = () => {
    if (!addPageName.trim()) return;
    const maxId = pages.reduce((acc, p) => Math.max(acc, p.id), 0);
    const newId = maxId + 1;
    const newPage: Page = {
      id: newId,
      name: addPageName.trim(),
      thumbnail: '',
    };
    updatePages([...pages, newPage]);
    setSelectedPageId(newId);
    setAddPageName('');
    setIsAddModalOpen(false);
  };

  const handleRenamePage = () => {
    if (!newPageName.trim()) return;
    const updated = pages.map((p) =>
      p.id === selectedPageId ? { ...p, name: newPageName.trim() } : p
    );
    updatePages(updated);
    setNewPageName('');
    setIsRenameModalOpen(false);
  };

  const handleDeletePage = () => {
    if (pages.length <= 1) return;
    const updated = pages.filter((p) => p.id !== selectedPageId);
    updatePages(updated);
    if (updated.length) {
      setSelectedPageId(updated[0].id);
    } else {
      setSelectedPageId(1);
    }
  };

  const handleResetPages = () => {
    const defaultPages: Page[] = [{ id: 1, name: 'Page 1', thumbnail: '' }];
    updatePages(defaultPages);
    setSelectedPageId(1);
  };

  const handlePageClick = (id: number) => {
    setSelectedPageId(id);
  };

  return (
    <Wrapper>
      <TabTitle>Pages</TabTitle>

      <ActionIconsRow>
        <IconButton
          iconProps={{ iconName: 'Add' }}
          title="Add Page"
          ariaLabel="Add Page"
          onClick={() => setIsAddModalOpen(true)}
        />
        <IconButton
          iconProps={{ iconName: 'Rename' }}
          title="Rename Page"
          ariaLabel="Rename Page"
          onClick={() => setIsRenameModalOpen(true)}
          disabled={pages.length === 0}
        />
        <IconButton
          iconProps={{ iconName: 'Delete' }}
          title="Delete Page"
          ariaLabel="Delete Page"
          onClick={handleDeletePage}
          disabled={pages.length <= 1}
        />
        <IconButton
          iconProps={{ iconName: 'Refresh' }}
          title="Reset Pages"
          ariaLabel="Reset Pages"
          onClick={handleResetPages}
        />
        <IconButton
          iconProps={{ iconName: 'Lightbulb' }}
          title="Show Suggested"
          ariaLabel="Show Suggested"
          onClick={() => setShowSuggested(true)}
        />
      </ActionIconsRow>

      <GridArea>
        {pages.map((page) => (
          <PageCard
            key={page.id}
            selected={page.id === selectedPageId}
            onClick={() => handlePageClick(page.id)}
          >
            <PageThumbnail>
              {page.thumbnail ? (
                <img src={page.thumbnail} alt={page.name} />
              ) : (
                <div style={{ fontSize: '12px', color: '#888' }}>
                  No Preview
                </div>
              )}
            </PageThumbnail>
            <PageName>{page.name}</PageName>
          </PageCard>
        ))}
      </GridArea>

      {/* --- Add Page Modal --- */}
      <Modal
        isOpen={isAddModalOpen}
        onDismiss={() => setIsAddModalOpen(false)}
        isBlocking={false}
      >
        <div style={{ padding: 20, backgroundColor: '#fff', borderRadius: 8 }}>
          <h3 style={{ marginTop: 0, marginBottom: 15, color: '#4b3f72' }}>
            Add New Page
          </h3>
          <TextField
            label="Page Name"
            value={addPageName}
            onChange={(_, val) => setAddPageName(val || '')}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 15,
            }}
          >
            <PrimaryButton onClick={handleAddPage} text="Add" />
            <DefaultButton
              onClick={() => setIsAddModalOpen(false)}
              text="Cancel"
              style={{ marginLeft: 10 }}
            />
          </div>
        </div>
      </Modal>

      {/* --- Rename Page Modal --- */}
      <Modal
        isOpen={isRenameModalOpen}
        onDismiss={() => setIsRenameModalOpen(false)}
        isBlocking={false}
      >
        <div style={{ padding: 20, backgroundColor: '#fff', borderRadius: 8 }}>
          <h3 style={{ marginTop: 0, marginBottom: 15, color: '#4b3f72' }}>
            Rename Page
          </h3>
          <TextField
            label="New Page Name"
            value={newPageName}
            onChange={(_, val) => setNewPageName(val || '')}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 15,
            }}
          >
            <PrimaryButton onClick={handleRenamePage} text="Rename" />
            <DefaultButton
              onClick={() => setIsRenameModalOpen(false)}
              text="Cancel"
              style={{ marginLeft: 10 }}
            />
          </div>
        </div>
      </Modal>

      {/* Suggested Pages Modal */}
      <SuggestedPages
        isOpen={showSuggested}
        onClose={() => setShowSuggested(false)}
      />
    </Wrapper>
  );
};

export default PagesTab;
