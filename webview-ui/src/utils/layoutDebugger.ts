/**
 * layoutDebugger.ts
 *
 * Usage:
 *   1. Import into your main interface file (e.g. MainInterface.tsx).
 *   2. Call `debugLayout()` once the DOM is rendered (e.g. in a useEffect or at a button click).
 *   3. Check the dev console for a structured JSON log, which you can provide to helpers.
 */

type DebugEntry = {
  selector: string;
  matchedCount: number;
  details: Array<{
    tag: string;
    classNames: string[];
    boundingClientRect: {
      width: number;
      height: number;
      top: number;
      left: number;
    };
    computedStyles: Partial<CSSStyleDeclaration>;
  }>;
};

function gatherComputedStyles(el: HTMLElement): Partial<CSSStyleDeclaration> {
  const s = window.getComputedStyle(el);
  // Pick out relevant layout properties
  return {
    display: s.display,
    position: s.position,
    width: s.width,
    height: s.height,
    flexDirection: s.flexDirection,
    flexWrap: s.flexWrap,
    justifyContent: s.justifyContent,
    alignItems: s.alignItems,
    overflowX: s.overflowX,
    overflowY: s.overflowY,
    margin: s.margin,
    padding: s.padding,
  };
}

export function debugLayout() {
  // Feel free to adjust these selectors to match your layout classes:
  const selectors = [
    '.flex',
    '.flex-none',
    '.flex-1',
    '.overflow-auto',
    '.border-r',
    '.w-screen',
    '.h-screen',
  ];

  const results: DebugEntry[] = [];

  selectors.forEach((sel) => {
    const elements = document.querySelectorAll<HTMLElement>(sel);
    const entry: DebugEntry = {
      selector: sel,
      matchedCount: elements.length,
      details: [],
    };

    elements.forEach((el) => {
      entry.details.push({
        tag: el.tagName.toLowerCase(),
        classNames: [...el.classList],
        boundingClientRect: {
          width: el.getBoundingClientRect().width,
          height: el.getBoundingClientRect().height,
          top: el.getBoundingClientRect().top,
          left: el.getBoundingClientRect().left,
        },
        computedStyles: gatherComputedStyles(el),
      });
    });

    results.push(entry);
  });

  console.log('[layoutDebugger] Layout Debug Results:', results);
}
