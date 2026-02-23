import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Use a stable, modern model as recommended to resolve the "Not Found" error.
export const geminiModel = googleAI.model('gemini-1.5-flash');

export const ai = genkit({
  plugins: [googleAI()],
});
