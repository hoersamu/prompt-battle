/**
 * Gets a random integer between min (inclusive) and max (exclusive).
 * @param max Maximum number (exclusive)
 * @param min Minimum number (inclusive) (default: 0)
 * @returns number
 */
export function getRandomInteger(max: number, min = 0): number {
  return Math.floor(Math.random() * (max - min)) + min;
}
