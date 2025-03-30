// PagesTab.tsx

import React, { useEffect, useState } from 'react';
import {
  IconButton,
  TextField,
  Modal,
  PrimaryButton,
  DefaultButton,
} from '@fluentui/react';
import styled from 'styled-components';

import './PagesTab.css';
import SuggestedPages from '../../SuggestedPages/SuggestedPages';

// Import everything you need from the new store
import {
  Page,
  getPages,
  getSelectedPageId,
  setPages,
  setSelectedPageId,
  subscribePageChange,
  subscribeSelectedPageChange,
} from '../../../store/store';

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
  flex-wrap: wrap;
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
  // Local state that mirrors the store
  const [pages, setPagesState] = useState<Page[]>(() => getPages());
  const [selectedPageId, setSelectedPageIdState] = useState<number>(() =>
    getSelectedPageId()
  );

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addPageName, setAddPageName] = useState('');
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [isSuggestedOpen, setIsSuggestedOpen] = useState(false);

  /**
   * Subscribe to store changes so we can update our local state
   * whenever pages or the selected page changes.
   */
  useEffect(() => {
    const unsubscribePages = subscribePageChange(() => {
      // When pages or suggestedPages change, update local state
      setPagesState(getPages());
    });

    const unsubscribeSelected = subscribeSelectedPageChange(() => {
      // When the selected page changes, update local state
      setSelectedPageIdState(getSelectedPageId());
    });

    // Clean up subscriptions on unmount
    return () => {
      unsubscribePages();
      unsubscribeSelected();
    };
  }, []);

  /**
   * Add a new page. If no name given, default to "Page {pages.length + 1}".
   */
  const handleAddPage = () => {
    let finalName = addPageName.trim();
    if (!finalName) {
      finalName = `Page ${pages.length + 1}`;
    }

    // Determine a new ID
    const maxId = pages.reduce((acc, p) => Math.max(acc, p.id), 0);
    const newId = maxId + 1;

    // Create the new page
    const newPage: Page = {
      id: newId,
      name: finalName,
      thumbnail: '',
    };

    // Update the store
    const newPages = [...pages, newPage];
    setPages(newPages);
    setSelectedPageId(newId);

    // Reset local state & close modal
    setAddPageName('');
    setIsAddModalOpen(false);
  };

  /**
   * Rename the currently selected page.
   */
  const handleRenamePage = () => {
    const finalName = newPageName.trim();
    if (!finalName) {
      setIsRenameModalOpen(false);
      setNewPageName('');
      return;
    }

    // Update the page in the store
    const updatedPages = pages.map((p) =>
      p.id === selectedPageId ? { ...p, name: finalName } : p
    );
    setPages(updatedPages);

    // Reset local state & close modal
    setNewPageName('');
    setIsRenameModalOpen(false);
  };

  /**
   * Delete the currently selected page, but don't allow if there's only one page left.
   */
  const handleDeletePage = () => {
    if (pages.length <= 1) return;
    const updated = pages.filter((p) => p.id !== selectedPageId);
    setPages(updated);

    if (updated.length) {
      setSelectedPageId(updated[0].id);
    } else {
      // If nothing left, re-add a default page
      setSelectedPageId(1);
    }
  };

  /**
   * Reset to a single default page.
   */
  const handleResetPages = () => {
    const defaultPages: Page[] = [{ id: 1, name: 'Page 1', thumbnail: '' }];
    setPages(defaultPages);
    setSelectedPageId(1);
  };

  /**
   * When the user clicks a page card, set it as the selected page.
   */
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
          onClick={() => setIsSuggestedOpen(true)}
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

      {/* --- Suggested Pages Modal --- */}
      {isSuggestedOpen && (
        <SuggestedPages onClose={() => setIsSuggestedOpen(false)} />
      )}
    </Wrapper>
  );
};

export default PagesTab;
