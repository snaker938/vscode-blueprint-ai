// store.ts

// Reuse your Page interface:
export interface Page {
  id: number;
  name: string;
  thumbnail?: string;
  layout?: any; // The CraftJS node tree (JSON)
}

/**
 * Define the shape of our entire store: all Pages, the selectedPageId,
 * and the suggested pages array.
 */
interface StoreState {
  pages: Page[];
  selectedPageId: number;
  suggestedPages: string[];
}

/**
 * This key will be used when persisting to localStorage.
 */
const STORAGE_KEY = 'blueprint-ai-data';

/**
 * Default / initial state values.
 * (Equivalent of your old 'globalPages' + 'globalSelectedPageId' + 'suggestedPages'.)
 */
let storeState: StoreState = {
  pages: [{ id: 1, name: 'Page 1', thumbnail: '', layout: {} }],
  selectedPageId: 1,
  suggestedPages: ['Account', 'Buy Again', 'Best Sellers', 'Returns & Orders'],
};

/**
 * On first load, try to read from localStorage to restore any previously saved data.
 */
try {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    storeState = JSON.parse(savedData);
  }
} catch (error) {
  console.warn('Failed to load store data from localStorage:', error);
}

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
  return getPageById(storeState.selectedPageId);
}

export function getSuggestedPages(): string[] {
  return storeState.suggestedPages;
}

/* ------------------------------------------------------------------
   SUBSCRIPTIONS
   ------------------------------------------------------------------ */

/**
 * We can maintain separate listener arrays if you want fine-grained control:
 *   - pageListeners: Notified when pages or suggested pages change
 *   - selectedPageListeners: Notified when the selectedPageId changes
 */
type Listener = () => void;

let pageListeners: Listener[] = [];
let selectedPageListeners: Listener[] = [];

/** Call all listeners whenever `pages` or `suggestedPages` change. */
function notifyPageListeners() {
  pageListeners.forEach((fn) => fn());
}

/** Call all listeners whenever `selectedPageId` changes. */
function notifySelectedPageListeners() {
  selectedPageListeners.forEach((fn) => fn());
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
  // We’ll treat suggested pages as part of the “page” domain for notifications
  notifyPageListeners();
}

/* ------------------------------------------------------------------
   PERSISTENCE
   ------------------------------------------------------------------ */

/**
 * Save current store state to localStorage.
 */
export function saveStoreToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storeState));
}

/**
 * Clear localStorage, and optionally reset your in-memory store to defaults.
 */
export function clearStoreFromLocalStorage() {
  localStorage.removeItem(STORAGE_KEY);
  // Reset in-memory state to defaults (optional, but recommended to avoid confusion).
  storeState = {
    pages: [{ id: 1, name: 'Page 1', thumbnail: '', layout: {} }],
    selectedPageId: 1,
    suggestedPages: [
      'Account',
      'Buy Again',
      'Best Sellers',
      'Returns & Orders',
    ],
  };
  // Notify all page listeners and selected page listeners
  notifyPageListeners();
  notifySelectedPageListeners();
}
