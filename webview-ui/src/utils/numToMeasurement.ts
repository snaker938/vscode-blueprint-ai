export function isPercentage(val: any): val is string {
  return (
    typeof val === 'string' &&
    val.trim().endsWith('%') &&
    !isNaN(parseFloat(val.trim()))
  );
}

/**
 * Convert a possibly percentage-based string (e.g., "50%") to a pixel string ("250px")
 * based on the provided `comparativeValue` (usually the parent's dimension in px).
 * If the input is already "px" or "auto" or if `comparativeValue` is invalid,
 * we return the input as-is. If parse fails, we also return it unchanged.
 */
export function percentToPx(value: string, comparativeValue?: number): string {
  if (
    !value ||
    value === 'auto' ||
    typeof comparativeValue !== 'number' ||
    isNaN(comparativeValue)
  ) {
    return value; // no transformation
  }

  // If not a percentage or if it already has "px", just return
  const trimmed = value.trim();
  if (!isPercentage(trimmed) || trimmed.includes('px')) {
    return trimmed;
  }

  // Strip the '%' and parse
  const numericPart = parseFloat(trimmed.replace('%', ''));
  if (isNaN(numericPart)) {
    return value; // fallback, parse error
  }

  const px = (numericPart / 100) * comparativeValue;
  return `${px}px`;
}

/**
 * Convert a numeric dimension in px to a relative percentage
 * based on the provided `comparativeValue`.
 * If `comparativeValue` is invalid, or the original number is not numeric, returns 0.
 * If `value` is negative, we preserve negativity in the returned percentage (rare but possible).
 */
export function pxToPercent(
  value: number | string,
  comparativeValue?: number
): number {
  if (
    typeof comparativeValue !== 'number' ||
    isNaN(comparativeValue) ||
    comparativeValue === 0
  ) {
    return 0;
  }

  const pxVal = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(pxVal)) {
    return 0;
  }
  // Convert px → ratio of parent
  const ratio = Math.abs(pxVal) / comparativeValue;
  const result = Math.round(ratio * 100);
  // Keep sign
  return pxVal < 0 ? -result : result;
}

/**
 * Obtain the `clientWidth`/`clientHeight` minus the element’s own padding,
 * effectively the "inner content" box dimension.
 */
export function getElementDimensions(element: HTMLElement): {
  width: number;
  height: number;
} {
  const computedStyle = getComputedStyle(element);

  // Start with clientWidth/Height
  const { clientWidth: width, clientHeight: height } = element;

  // Parse out padding from computed styles
  const padTop = parseFloat(computedStyle.paddingTop) || 0;
  const padBottom = parseFloat(computedStyle.paddingBottom) || 0;
  const padLeft = parseFloat(computedStyle.paddingLeft) || 0;
  const padRight = parseFloat(computedStyle.paddingRight) || 0;

  // Subtract vertical/horizontal padding
  const finalWidth = width - padLeft - padRight;
  const finalHeight = height - padTop - padBottom;

  return {
    width: finalWidth < 0 ? 0 : finalWidth,
    height: finalHeight < 0 ? 0 : finalHeight,
  };
}
