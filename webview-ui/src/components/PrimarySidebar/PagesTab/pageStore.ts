// pageStore.ts
export interface Page {
  id: number;
  name: string;
  thumbnail?: string;
}

// Default "global" pages:
let globalPages: Page[] = [{ id: 1, name: 'Page 1', thumbnail: '' }];

// Getter
export const getGlobalPages = () => {
  return globalPages;
};

// Setter
export const setGlobalPages = (newPages: Page[]) => {
  globalPages = newPages;
};
