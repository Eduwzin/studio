import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const geminiPro = googleAI.model('gemini-2.5-pro-preview');

export const ai = genkit({
  plugins: [googleAI()],
});
