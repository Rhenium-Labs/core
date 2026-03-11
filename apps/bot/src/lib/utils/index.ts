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

/**
 * Causes a delay for a specified duration.
 *
 * @param duration The duration of the delay in milliseconds.
 * @returns A promise that resolves after the specified duration has elapsed.
 */
export function sleep(duration: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, duration));
}
