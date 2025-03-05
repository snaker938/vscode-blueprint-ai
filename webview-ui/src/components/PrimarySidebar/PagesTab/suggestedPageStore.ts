// ../PrimarySidebar/PagesTab/suggestedPageStore.ts

/**
 * A simple global in-memory store for suggested page names.
 * In practice, you might fetch these from a backend and call setSuggestedPages.
 */

let suggestedPages: string[] = [
  'Account',
  'Buy Again',
  'Best Sellers',
  'Returns & Orders',
];

export function getSuggestedPages(): string[] {
  return suggestedPages;
}

export function setSuggestedPages(newPages: string[]): void {
  suggestedPages = newPages;
}
