// PagesTab.tsx

import React, { useState } from 'react';
import {
  IconButton,
  TextField,
  Modal,
  PrimaryButton,
  DefaultButton,
} from '@fluentui/react';
import './PagesTab.css';

// Global in-memory page store
import { Page, getGlobalPages, setGlobalPages } from './pageStore';

const PagesTab: React.FC = () => {
  const [pages, setPages] = useState<Page[]>(() => getGlobalPages());
  const [selectedPageId, setSelectedPageId] = useState<number>(
    pages[0]?.id ?? 1
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addPageName, setAddPageName] = useState('');

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');

  /** Sync local state with global store */
  const updatePages = (newPages: Page[]) => {
    setPages(newPages);
    setGlobalPages(newPages);
  };

  /** Add a new page */
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

  /** Rename the selected page */
  const handleRenamePage = () => {
    if (!newPageName.trim()) return;
    const updated = pages.map((p) =>
      p.id === selectedPageId ? { ...p, name: newPageName.trim() } : p
    );
    updatePages(updated);
    setNewPageName('');
    setIsRenameModalOpen(false);
  };

  /** Delete the selected page */
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

  /** Reset to a single default page */
  const handleResetPages = () => {
    const defaultPages: Page[] = [{ id: 1, name: 'Page 1', thumbnail: '' }];
    updatePages(defaultPages);
    setSelectedPageId(1);
  };

  /** Handle clicking a page card */
  const handlePageClick = (id: number) => {
    setSelectedPageId(id);
  };

  return (
    <div className="pages-tab">
      {/* Top bar (title + quick actions) */}
      <div className="pages-tab-header">
        <h2>Pages</h2>
        <div className="pages-tab-buttons">
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
        </div>
      </div>

      {/* Grid of pages */}
      <div className="pages-grid">
        {pages.map((page) => (
          <div
            key={page.id}
            className={`page-card ${
              page.id === selectedPageId ? 'selected' : ''
            }`}
            onClick={() => handlePageClick(page.id)}
          >
            <div className="page-thumbnail">
              {page.thumbnail ? (
                <img src={page.thumbnail} alt={page.name} />
              ) : (
                <div className="empty-thumbnail">No Preview</div>
              )}
            </div>
            <div className="page-name">{page.name}</div>
          </div>
        ))}
      </div>

      {/* Add Page Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onDismiss={() => setIsAddModalOpen(false)}
        isBlocking={false}
      >
        <div className="modal-content">
          <h3>Add New Page</h3>
          <TextField
            label="Page Name"
            value={addPageName}
            onChange={(_, val) => setAddPageName(val || '')}
          />
          <div className="modal-buttons">
            <PrimaryButton onClick={handleAddPage} text="Add" />
            <DefaultButton
              onClick={() => setIsAddModalOpen(false)}
              text="Cancel"
            />
          </div>
        </div>
      </Modal>

      {/* Rename Page Modal */}
      <Modal
        isOpen={isRenameModalOpen}
        onDismiss={() => setIsRenameModalOpen(false)}
        isBlocking={false}
      >
        <div className="modal-content">
          <h3>Rename Page</h3>
          <TextField
            label="New Page Name"
            value={newPageName}
            onChange={(_, val) => setNewPageName(val || '')}
          />
          <div className="modal-buttons">
            <PrimaryButton onClick={handleRenamePage} text="Rename" />
            <DefaultButton
              onClick={() => setIsRenameModalOpen(false)}
              text="Cancel"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PagesTab;
