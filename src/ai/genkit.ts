import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Use a stable, modern model with the -latest suffix as recommended to resolve the "Not Found" error with the v1beta API.
export const geminiModel = googleAI.model('gemini-1.5-flash-latest');

export const ai = genkit({
  plugins: [googleAI()],
});
