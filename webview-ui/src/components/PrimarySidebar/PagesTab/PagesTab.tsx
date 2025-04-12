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

// Import the store items
import {
  Page,
  getPages,
  getSelectedPageId,
  setPages,
  setSelectedPageId,
  subscribePageChange,
  subscribeSelectedPageChange,
} from '../../../store/store';

// NEW: Import our new PagesGrid
import { PagesGrid } from './PagesGrid'; // Adjust path as needed

/* ------------------ Styled Components (general) ------------------ */

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

  /** Subscribe to store changes so we can update our local state. */
  useEffect(() => {
    const unsubscribePages = subscribePageChange(() => {
      setPagesState(getPages());
    });

    const unsubscribeSelected = subscribeSelectedPageChange(() => {
      setSelectedPageIdState(getSelectedPageId());
    });

    return () => {
      unsubscribePages();
      unsubscribeSelected();
    };
  }, []);

  /** Add a new page. */
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
      layout: '', // Or default JSON if you like
    };

    // Update the store
    const newPages = [...pages, newPage];
    setPages(newPages);
    setSelectedPageId(newId);

    // Reset local state & close modal
    setAddPageName('');
    setIsAddModalOpen(false);
  };

  /** Rename the currently selected page. */
  const handleRenamePage = () => {
    const finalName = newPageName.trim();
    if (!finalName) {
      setIsRenameModalOpen(false);
      setNewPageName('');
      return;
    }

    const updatedPages = pages.map((p) =>
      p.id === selectedPageId ? { ...p, name: finalName } : p
    );
    setPages(updatedPages);

    setNewPageName('');
    setIsRenameModalOpen(false);
  };

  /** Delete page if more than one exists. */
  const handleDeletePage = () => {
    if (pages.length <= 1) return;
    const updated = pages.filter((p) => p.id !== selectedPageId);
    setPages(updated);
    if (updated.length) {
      setSelectedPageId(updated[0].id);
    }
  };

  /** Reset to a single default page. */
  const handleResetPages = () => {
    const defaultPages: Page[] = [{ id: 1, name: 'Page 1', layout: '' }];
    setPages(defaultPages);
    setSelectedPageId(1);
  };

  /** When user clicks a page card, set it as the selected page. */
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

      {/** REPLACE the old grid with the new PagesGrid */}
      <PagesGrid
        pages={pages}
        selectedPageId={selectedPageId}
        onSelectPage={handlePageClick}
      />

      {/** --- Add Page Modal --- */}
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

      {/** --- Rename Page Modal --- */}
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

      {/** --- Suggested Pages Modal --- */}
      {isSuggestedOpen && (
        <SuggestedPages onClose={() => setIsSuggestedOpen(false)} />
      )}
    </Wrapper>
  );
};

export default PagesTab;
