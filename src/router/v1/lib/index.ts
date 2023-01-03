/**
 * Function normalizing request languages
 * @param languages
 * @return Array<string>
 */
export function normalizeLanguages(languages?: string): Array<string> {
  if (!languages) {
    return ["en-gb"];
  }

  const languageCodes = languages.split(",");

  return languageCodes.map((language) => language.trim().toLowerCase());
}
