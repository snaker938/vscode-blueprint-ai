// pageStore.ts

export interface Page {
  id: number;
  name: string;
  thumbnail?: string;
}

// Default "global" pages:
let globalPages: Page[] = [{ id: 1, name: 'Page 1', thumbnail: '' }];

// Keep track of which page is currently selected:
let globalSelectedPageId: number = 1;

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

/** Set which page is currently selected. */
export const setGlobalSelectedPageId = (id: number) => {
  globalSelectedPageId = id;
};
