import { ITranslationProvider } from './TranslationProvider';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiTranslationProvider implements ITranslationProvider {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('VITE_GEMINI_API_KEY is not defined. Gemini translations will fail.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || 'missing-key');
  }

  /**
   * Translates text from sourceLanguage to targetLanguage.
   * Prompt is tuned for natural spoken-conversation quality,
   * not literal word-for-word translation.
   */
  public async translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
    if (!text.trim()) return '';

    if (sourceLanguage === targetLanguage && sourceLanguage !== 'Auto Detect') {
      return text;
    }

    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const sourceLabel = sourceLanguage === 'Auto Detect' ? 'the detected language' : sourceLanguage;

    const prompt = `You are a professional live interpreter for real-time spoken conversations.

Translate the following spoken text from ${sourceLabel} to ${targetLanguage}.

Guidelines:
- Return ONLY the translated text — no explanations, no quotes, no commentary.
- Prioritize natural, conversational grammar over literal word-for-word translation.
- Preserve the speaker's intent, tone, and emotional nuance.
- Preserve proper nouns: names, flight numbers, gate numbers, terminal names, booking IDs, passport numbers.
- Handle incomplete or colloquial sentences naturally — real speech is not always grammatically perfect.
- If the text seems like a question, translate it as a question.
- If the text is a command or request, translate it as one.
- Do not add filler words, pleasantries, or extra content that was not in the original.
- Do not censor or summarize.

Spoken text:
${text}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Translation service is temporarily unavailable. Please try again.');
    }
  }
}
