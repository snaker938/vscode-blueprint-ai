import React, { useState } from 'react';
import {
  IconButton,
  TextField,
  Modal,
  PrimaryButton,
  DefaultButton,
} from '@fluentui/react';
import './PagesTab.css';

interface Page {
  id: number;
  name: string;
  thumbnail: string;
}

interface PagesTabProps {
  pages: Page[];
  selectedPageId: number;
  onAddPage: (name: string) => void;
  onRenamePage: (id: number, newName: string) => void;
  onDeletePage: (id: number) => void;
  onResetPages: () => void;
  onPageClick: (id: number) => void;
}

const PagesTab: React.FC<PagesTabProps> = ({
  pages,
  selectedPageId,
  onAddPage,
  onRenamePage,
  onDeletePage,
  onResetPages,
  onPageClick,
}) => {
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addPageName, setAddPageName] = useState('');

  const handleAddPage = () => {
    onAddPage(addPageName);
    setAddPageName('');
    setIsAddModalOpen(false);
  };

  const handleRenamePage = () => {
    onRenamePage(selectedPageId, newPageName);
    setNewPageName('');
    setIsRenameModalOpen(false);
  };

  const handleDeletePage = () => {
    onDeletePage(selectedPageId);
  };

  return (
    <div className="pages-tab">
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
            disabled={!selectedPageId}
            onClick={() => setIsRenameModalOpen(true)}
          />
          <IconButton
            iconProps={{ iconName: 'Delete' }}
            title="Delete Page"
            ariaLabel="Delete Page"
            disabled={!selectedPageId}
            onClick={handleDeletePage}
          />
          <IconButton
            iconProps={{ iconName: 'Refresh' }}
            title="Reset Pages"
            ariaLabel="Reset Pages"
            onClick={onResetPages}
          />
        </div>
      </div>

      <div className="pages-grid">
        {pages.map((page) => (
          <div
            key={page.id}
            className={`page-card ${
              selectedPageId === page.id ? 'selected' : ''
            }`}
            onClick={() => onPageClick(page.id)}
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
            onChange={(e, newValue) => setAddPageName(newValue || '')}
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
            onChange={(e, newValue) => setNewPageName(newValue || '')}
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
