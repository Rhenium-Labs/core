/**
 * Returns the singular or plural form of a word based on the count.
 *
 * @param count The number to base the inflection on.
 * @param singular The singular form of the word.
 * @param plural The plural form of the word. Defaults to singular + "s".
 * @returns The appropriate singular or plural form based on the count.
 */
export function inflect(count: number, singular: string, plural = `${singular}s`): string {
	return count === 1 ? singular : plural;
}
