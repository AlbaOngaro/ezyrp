export function getDiffPercentage(curr: number, prev: number): number {
  const currInChf = curr / 100;
  const prevInChf = prev / 100;

  if (currInChf === 0) {
    return 0;
  }

  if (prevInChf === 0) {
    return 100;
  }

  return ((prevInChf - currInChf) / currInChf) * 100 * -1;
}
