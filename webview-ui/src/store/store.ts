// store.ts

// Provide a default blank JSON:
const DEFAULT_LAYOUT_JSON = JSON.stringify({
  ROOT: {
    type: { resolvedName: 'Container' },
    isCanvas: true,
    props: {
      layoutType: 'container',
      background: '#ffffff',
      fillSpace: 'no',
      width: '800px',
      height: '2595px',
      margin: [0, 0, 0, 0],
      padding: [20, 20, 20, 20],
      shadow: 5,
      radius: 8,
      border: {
        borderStyle: 'solid',
        borderColor: '#cccccc',
        borderWidth: 1,
      },
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
      gap: 0,
      flexWrap: 'nowrap',
      columns: 2,
      rows: 2,
      rowGap: 10,
      columnGap: 10,
      justifyItems: 'stretch',
      alignGridItems: 'stretch',
    },
    displayName: 'Container',
    custom: { isRootContainer: true },
    hidden: false,
    nodes: [],
    linkedNodes: {},
  },
});

// Reuse your Page interface:
export interface Page {
  id: number;
  name: string;
  layout?: any; // The CraftJS node tree (JSON)
}

/**
 * Define the shape of our entire store: all Pages, the selectedPageId,
 * the suggested pages array, and now the user's prompt.
 */
interface StoreState {
  pages: Page[];
  selectedPageId: number;
  suggestedPages: string[];
  userPrompt: string;
}

/**
 * Default / initial state values.
 */
let storeState: StoreState = {
  pages: [{ id: 1, name: 'Page 1', layout: DEFAULT_LAYOUT_JSON }],
  selectedPageId: 1,
  suggestedPages: ['Account', 'Buy Again', 'Best Sellers', 'Returns & Orders'],
  userPrompt: '', // Newly added
};

/**
 * We're no longer loading from localStorage.
 * Using default values defined above.
 */

/* ------------------------------------------------------------------
   GETTERS
   ------------------------------------------------------------------ */

export function getPages() {
  return storeState.pages;
}

export function getPageById(id: number): Page | undefined {
  return storeState.pages.find((p) => p.id === id);
}

export function getSelectedPageId() {
  return storeState.selectedPageId;
}

export function getSelectedPage(): Page | undefined {
  const page = getPageById(storeState.selectedPageId);
  if (page && !page.layout) {
    // If this page has no layout yet, initialize with the blank container
    page.layout = DEFAULT_LAYOUT_JSON;
  }
  return page;
}

export function getSuggestedPages(): string[] {
  return storeState.suggestedPages;
}

// NEW: Getter for the user's prompt
export function getUserPrompt(): string {
  return storeState.userPrompt;
}

/* ------------------------------------------------------------------
   SUBSCRIPTIONS
   ------------------------------------------------------------------ */

/**
 * We maintain separate listener arrays for different store segments:
 *   - pageListeners: Notified when pages or suggested pages change
 *   - selectedPageListeners: Notified when the selectedPageId changes
 *   - promptListeners: Notified when the userPrompt changes
 */
type Listener = () => void;

let pageListeners: Listener[] = [];
let selectedPageListeners: Listener[] = [];
let promptListeners: Listener[] = []; // NEW

/** Call all listeners whenever `pages` or `suggestedPages` change. */
function notifyPageListeners() {
  pageListeners.forEach((fn) => fn());
}

/** Call all listeners whenever `selectedPageId` changes. */
function notifySelectedPageListeners() {
  selectedPageListeners.forEach((fn) => fn());
}

/** Call all listeners whenever `userPrompt` changes. */
function notifyPromptListeners() {
  promptListeners.forEach((fn) => fn());
}

/** Subscribe to page changes (pages array or suggested pages).
 *  Returns an unsubscribe function.
 */
export function subscribePageChange(listener: Listener): () => void {
  pageListeners.push(listener);
  return () => {
    pageListeners = pageListeners.filter((l) => l !== listener);
  };
}

/** Subscribe to changes in the currently selected page ID.
 *  Returns an unsubscribe function.
 */
export function subscribeSelectedPageChange(listener: Listener): () => void {
  selectedPageListeners.push(listener);
  return () => {
    selectedPageListeners = selectedPageListeners.filter((l) => l !== listener);
  };
}

/** Subscribe to changes in the user's prompt.
 *  Returns an unsubscribe function.
 */
export function subscribePromptChange(listener: Listener): () => void {
  promptListeners.push(listener);
  return () => {
    promptListeners = promptListeners.filter((l) => l !== listener);
  };
}

/* ------------------------------------------------------------------
   MUTATIONS
   ------------------------------------------------------------------ */

/** Replace the entire pages array. */
export function setPages(newPages: Page[]) {
  storeState.pages = newPages;
  // Notify any subscribers that pages have changed
  notifyPageListeners();
}

/** Replace a single page's layout or other fields. */
export function updatePage(id: number, partialData: Partial<Page>) {
  storeState.pages = storeState.pages.map((page) =>
    page.id === id ? { ...page, ...partialData } : page
  );
  // Notify that pages changed
  notifyPageListeners();
}

/** Change the currently selected page. */
export function setSelectedPageId(id: number) {
  storeState.selectedPageId = id;
  // Notify subscribers specifically about selected page changes
  notifySelectedPageListeners();
}

/** Replace the suggested pages array. */
export function setSuggestedPages(newPages: string[]) {
  storeState.suggestedPages = newPages;
  // We'll treat suggested pages as part of the "page" domain for notifications
  notifyPageListeners();
}

/** NEW: Set the user's prompt, and notify any prompt subscribers. */
export function setUserPrompt(newPrompt: string) {
  storeState.userPrompt = newPrompt;
  notifyPromptListeners();
}

/* ------------------------------------------------------------------
   PERSISTENCE
   ------------------------------------------------------------------ */

/**
 * This function no longer saves to localStorage.
 * It's kept as a no-op to maintain API compatibility.
 */
export function saveStoreToLocalStorage() {
  // No-op function - we don't save to localStorage anymore
  console.log('Store changes not saved to localStorage (disabled)');
}

/**
 * Reset the store to defaults (no longer clears localStorage).
 */
export function clearStoreFromLocalStorage() {
  // Reset in-memory state to defaults
  storeState = {
    pages: [{ id: 1, name: 'Page 1', layout: {} }],
    selectedPageId: 1,
    suggestedPages: [
      'Account',
      'Buy Again',
      'Best Sellers',
      'Returns & Orders',
    ],
    userPrompt: '', // Reset to empty
  };
  // Notify all relevant listeners
  notifyPageListeners();
  notifySelectedPageListeners();
  notifyPromptListeners();
}
