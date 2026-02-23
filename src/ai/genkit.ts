import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const geminiPro = googleAI.model('gemini-pro');

export const ai = genkit({
  plugins: [googleAI()],
});
