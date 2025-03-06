export interface Page {
  id: number;
  name: string;
  thumbnail?: string;
}

// Default "global" pages:
let globalPages: Page[] = [{ id: 1, name: 'Page 1', thumbnail: '' }];

// Keep track of which page is currently selected:
let globalSelectedPageId: number = 1;

// Array of listeners to be notified when the selected page changes.
let listeners: Array<() => void> = [];

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
};

/** Set which page is currently selected and notify subscribers. */
export const setGlobalSelectedPageId = (id: number) => {
  globalSelectedPageId = id;
  // Notify all subscribers about the change.
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
