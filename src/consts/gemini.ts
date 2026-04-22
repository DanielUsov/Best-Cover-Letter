export const finalPrompt = (
  prompt: string,
  parsedTitle: string,
  parsedLocation: string,
  parsedDescription: string,
): string =>
  `${prompt}
  ### DYNAMIC VACANCY DATA:
  - Title: ${parsedTitle}
  - City: ${parsedLocation}
  - Description: ${parsedDescription}` as const;
