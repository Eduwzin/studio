import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const geminiPro = googleAI.model('gemini-1.5-flash');

export const ai = genkit({
  plugins: [googleAI()],
});
