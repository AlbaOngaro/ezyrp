export function convertRemToPx(rem: number): number {
  try {
    return (
      rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
  } catch (error) {
    return 0;
  }
}
