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
 * the suggested pages array, and now the user's prompt.
 */
interface StoreState {
  pages: Page[];
  selectedPageId: number;
  suggestedPages: string[];
  userPrompt: string;
}

/**
 * This key was previously used for localStorage persistence.
 * Keeping it commented out for reference.
 */
// const STORAGE_KEY = 'blueprint-ai-data';

/**
 * Default / initial state values.
 */
let storeState: StoreState = {
  pages: [{ id: 1, name: 'Page 1', thumbnail: '', layout: {} }],
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
  return getPageById(storeState.selectedPageId);
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
    pages: [{ id: 1, name: 'Page 1', thumbnail: '', layout: {} }],
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
