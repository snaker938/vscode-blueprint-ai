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
 * This key will be used when persisting to localStorage.
 */
const STORAGE_KEY = 'blueprint-ai-data';

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
 * On first load, try to read from localStorage to restore any previously saved data.
 */
try {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    // Parse stored data
    const parsedData = JSON.parse(savedData);

    // Assign each field safely, so new fields won't cause errors if absent
    storeState.pages = parsedData.pages || storeState.pages;
    storeState.selectedPageId =
      parsedData.selectedPageId || storeState.selectedPageId;
    storeState.suggestedPages =
      parsedData.suggestedPages || storeState.suggestedPages;
    storeState.userPrompt = parsedData.userPrompt || storeState.userPrompt;
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
    userPrompt: '', // Reset to empty
  };
  // Notify all relevant listeners
  notifyPageListeners();
  notifySelectedPageListeners();
  notifyPromptListeners(); // NEW
}
