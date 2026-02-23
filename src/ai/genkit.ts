import {genkit} from 'genkit';
import {vertexAI} from '@genkit-ai/vertexai';

export const ai = genkit({
  plugins: [
    vertexAI({ location: 'us-central1' }),
  ],
});

export const geminiModel = vertexAI.model('gemini-1.5-flash');
