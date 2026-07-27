import { ITranslationProvider } from './TranslationProvider';
import { GeminiTranslationProvider } from './GeminiTranslationProvider';
import { TranslateResponse } from '../types/translation.types';

export class TranslationService {
  private provider: ITranslationProvider;

  constructor(provider?: ITranslationProvider) {
    // Default to Gemini API
    this.provider = provider || new GeminiTranslationProvider();
  }

  /**
   * Translates text using the configured provider.
   * 
   * @param text The text to translate
   * @param sourceLanguage The source language label
   * @param targetLanguage The target language label
   * @returns A promise resolving to the TranslateResponse object
   */
  public async translateText(text: string, sourceLanguage: string, targetLanguage: string): Promise<TranslateResponse> {
    try {
      const translatedText = await this.provider.translate(text, sourceLanguage, targetLanguage);
      return { translatedText };
    } catch (error) {
      // Re-throw the error so the UI hook can catch it and display a friendly message
      throw error;
    }
  }
}

// Export a singleton instance for backward compatibility with the existing hook
const defaultTranslationService = new TranslationService();

// Export the method directly matching the previous signature
export const translateText = async (text: string, sourceLanguage: string, targetLanguage: string): Promise<TranslateResponse> => {
  return defaultTranslationService.translateText(text, sourceLanguage, targetLanguage);
};

export default translateText;