import { useEffect, useState, CSSProperties } from 'react';
import { getSuggestedPages } from '../PrimarySidebar/PagesTab/suggestedPageStore';
import CreateSelectedPage from './CreateSelectedPage';

/**
 * A single component that:
 * 1) Shows a list of suggested pages.
 * 2) When the user picks (Accepts) one, shows the CreateSelectedPage step.
 * 3) Allows the user to either close at any point or complete the flow.
 */
function SuggestedPages() {
  // Whether the entire modal is open or not
  const [isOpen, setIsOpen] = useState(true);

  // Which step we're on: "suggestions" or "create"
  const [stage, setStage] = useState<'suggestions' | 'create'>('suggestions');

  // List of suggestions from store
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Which suggestion the user has picked (if any)
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  // On component mount, fetch the suggestions
  useEffect(() => {
    const pages = getSuggestedPages();
    setSuggestions(pages);
  }, []);

  // If the user closes the modal entirely, simply render null
  if (!isOpen) {
    return null;
  }

  // A helper to close everything
  const closeModal = () => {
    setIsOpen(false);
  };

  // Overlay/backdrop styling for centered modal
  const overlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  // Modal content box styling
  const modalStyle: CSSProperties = {
    position: 'relative',
    background: '#fff',
    color: '#000',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '80vh',
    overflowY: 'auto',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  };

  // Common styles for the suggestions step
  const titleStyle: CSSProperties = {
    marginTop: 0,
    marginBottom: '16px',
  };

  const listStyle: CSSProperties = {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    marginBottom: '24px',
  };

  const itemStyle: CSSProperties = {
    padding: '12px 16px',
    marginBottom: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    background: '#f9f9f9',
    cursor: 'pointer',
  };

  // If the user has clicked "Accept" on a suggestion, show CreateSelectedPage
  if (stage === 'create' && selectedPage) {
    // This effectively *replaces* the suggestion list UI
    // with the create form, all within the same modal.
    return (
      <div style={overlayStyle}>
        <div style={modalStyle} role="dialog" aria-modal="true">
          {/* Pass the selected page name and a simple onClose to dismiss everything */}
          <CreateSelectedPage pageName={selectedPage} onClose={closeModal} />
        </div>
      </div>
    );
  }

  // Otherwise, we're in the "suggestions" stage
  return (
    <div style={overlayStyle}>
      <div
        style={modalStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="suggestedPagesTitle"
      >
        {/* Close (X) button to exit entirely */}
        <button
          onClick={closeModal}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
          }}
          aria-label="Close"
        >
          &times;
        </button>

        <h2 id="suggestedPagesTitle" style={titleStyle}>
          Suggested Pages
        </h2>
        <p style={{ marginTop: 0, marginBottom: '16px', color: '#555' }}>
          Select one of the suggestions below:
        </p>

        <ul style={listStyle}>
          {suggestions.map((page, index) => (
            <li
              key={index}
              style={{
                ...itemStyle,
                background:
                  selectedPage === page ? '#cce4ff' : itemStyle.background,
              }}
              onClick={() => setSelectedPage(page)}
            >
              {page}
            </li>
          ))}
        </ul>

        {/* Bottom button row: Accept (if selected) + Cancel */}
        <div style={{ textAlign: 'right', marginTop: '24px' }}>
          {selectedPage && (
            <button
              onClick={() => setStage('create')}
              style={{
                background: '#4caf50',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '8px',
              }}
            >
              Accept
            </button>
          )}
          <button
            onClick={closeModal}
            style={{
              background: '#ddd',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuggestedPages;
