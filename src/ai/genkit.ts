import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// By pointing to the Vertex AI endpoint, we align with Firebase Studio's
// infrastructure, resolving the 'Not Found' error.
const vertexGoogleAI = googleAI({
  clientOptions: {
    apiEndpoint: 'us-central1-aiplatform.googleapis.com',
  },
});

// We define the model using the configured plugin.
export const geminiModel = vertexGoogleAI.model('gemini-1.5-flash');

// Initialize genkit with the correctly configured plugin.
export const ai = genkit({
  plugins: [vertexGoogleAI],
});
