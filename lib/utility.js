/**
 * Deduplicate an array by converting it to a Set and back.
 * @param array The array to be de-duplicated.
 * @returns An array lacking any duplicate elements.
 */
export function dedupe (array) {
  return [...new Set(array)]
}
