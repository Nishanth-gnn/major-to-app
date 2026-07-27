export interface ITranslationProvider {
  /**
   * Translates text from a source language to a target language.
   * 
   * @param text The text to translate
   * @param sourceLanguage The source language label (e.g., 'English')
   * @param targetLanguage The target language label (e.g., 'Spanish')
   * @returns A promise that resolves to the translated text
   * @throws Error if the translation fails or the service is unavailable
   */
  translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string>;
}
