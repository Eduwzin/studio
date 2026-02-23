import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// By pointing to the Vertex AI endpoint, we align with Firebase Studio's
// infrastructure, resolving the 'Not Found' error.
const vertexGoogleAI = googleAI({
  clientOptions: {
    apiEndpoint: 'us-central1-aiplatform.googleapis.com',
  },
});

// We define the model using the main googleAI import, not the plugin instance.
// The instance is used to configure genkit, which should make this work.
export const geminiModel = googleAI.model('gemini-1.5-flash');

// Initialize genkit with the correctly configured plugin.
export const ai = genkit({
  plugins: [vertexGoogleAI],
});
