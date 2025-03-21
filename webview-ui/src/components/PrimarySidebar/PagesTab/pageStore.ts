export interface Page {
  id: number;
  name: string;
  thumbnail?: string;
}

// Default "global" pages:
let globalPages: Page[] = [{ id: 1, name: 'Page 1', thumbnail: '' }];

// Keep track of which page is currently selected:
let globalSelectedPageId: number = 1;

// Listeners for changes in the *selected page*:
let listeners: Array<() => void> = [];

/** New: listeners for changes in the globalPages array itself. */
let pagesListeners: Array<() => void> = [];

/** Retrieve the entire list of global pages. */
export const getGlobalPages = () => {
  return globalPages;
};

/** Retrieve the current selected-page ID. */
export const getGlobalSelectedPageId = () => {
  return globalSelectedPageId;
};

/** Retrieve the actual Page object that is selected. */
export const getGlobalSelectedPage = (): Page | undefined => {
  return globalPages.find((p) => p.id === globalSelectedPageId);
};

/** Set the entire list of global pages. */
export const setGlobalPages = (newPages: Page[]) => {
  globalPages = newPages;
  // Notify all subscribers that pages changed
  pagesListeners.forEach((fn) => fn());
};

/** Set which page is currently selected and notify subscribers. */
export const setGlobalSelectedPageId = (id: number) => {
  globalSelectedPageId = id;
  // Notify all 'selected page' subscribers
  listeners.forEach((fn) => fn());
};

/** Subscribe to changes in the selected page.
 *  Returns an unsubscribe function.
 */
export const subscribeSelectedPageChange = (listener: () => void) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

/** NEW: Subscribe to changes in the global pages array. */
export const subscribeGlobalPagesChange = (listener: () => void) => {
  pagesListeners.push(listener);
  return () => {
    pagesListeners = pagesListeners.filter((l) => l !== listener);
  };
};
