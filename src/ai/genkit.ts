import {genkit} from 'genkit';
import {vertexAI, gemini25Flash} from '@genkit-ai/vertexai';

export const ai = genkit({
  plugins: [vertexAI({location: 'us-central1'})],
});

export const geminiModel = gemini25Flash;
