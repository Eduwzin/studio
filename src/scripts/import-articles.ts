

import { blogArticles } from '../lib/content';
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  // When running in a Google Cloud environment, it will automatically use the
  // service account credentials. For local development, you'd need to set up
  // GOOGLE_APPLICATION_CREDENTIALS environment variable.
  admin.initializeApp();
}

const db = getFirestore();

/**
 * Converts a stringified arrow function into a logic string.
 * e.g., "(cdi, selic) => cdi / 100" becomes "cdi / 100".
 * @param rateValue The function or string to convert.
 * @returns A string representing the logic.
 */
const convertRateToLogicString = (rateValue: any): string => {
  if (typeof rateValue !== 'function') {
    return String(rateValue); // Return as is if not a function
  }

  const funcString = String(rateValue);
  
  // Clean up potential extra spaces and newlines from the string representation
  const cleanedFuncString = funcString.replace(/\s+/g, ' ');

  const arrowIndex = cleanedFuncString.indexOf('=>');
  if (arrowIndex > -1) {
    let logic = cleanedFuncString.substring(arrowIndex + 2).trim();
    // Handle complex ternaries by removing spaces that break the logic
    logic = logic.replace(/\s*\?\s*/, '?').replace(/\s*:\s*/, ':').replace(/\s*>\s*/, '>');
    return logic;
  }
  // Fallback if it's not an arrow function string
  console.warn(`Could not find arrow '=>' in rate function: ${funcString}. Using as is.`);
  return funcString;
};

const importArticles = async () => {
  if (!blogArticles || blogArticles.length === 0) {
    console.log('No articles found in src/lib/content.ts to import.');
    return;
  }

  console.log(`Starting import for ${blogArticles.length} articles...`);

  const articlesCollection = db.collection('articles');
  const batch = db.batch();

  for (const article of blogArticles) {
    const { slug, ...data } = article;
    if (!slug) {
        console.warn('Skipping article with no slug:', article.title);
        continue;
    }
    const docRef = articlesCollection.doc(slug);

    // Deep copy to avoid modifying original objects
    const firestoreData: any = JSON.parse(JSON.stringify(data));

    // Process simulation tables
    if (firestoreData.content && Array.isArray(firestoreData.content)) {
      firestoreData.content = firestoreData.content.map((block: any) => {
        if (block.type === 'simulationTable' && block.scenarios) {
          const newScenarios = block.scenarios.map((scenario: any) => {
            if (scenario.rate) {
              const rateLogic = convertRateToLogicString(scenario.rate);
              const { rate, ...rest } = scenario; // remove original rate function
              return { ...rest, rateLogic };
            }
            return scenario;
          });
          return { ...block, scenarios: newScenarios };
        }
        return block;
      });
    }
    
    // Unify date field to 'lastUpdated' and convert to Firestore Timestamp
    const dateValue = firestoreData.lastUpdated || firestoreData.date;
    if (dateValue) {
        firestoreData.lastUpdated = admin.firestore.Timestamp.fromDate(new Date(dateValue));
        delete firestoreData.date; // Remove original string date field if it exists
    }


    batch.set(docRef, firestoreData, { merge: true }); // Use merge to be safe
    console.log(`Importado: ${slug}`);
  }

  try {
    await batch.commit();
    console.log('------------------------------------');
    console.log(`Successfully imported ${blogArticles.length} articles to Firestore!`);
  } catch (error) {
    console.error('Error committing batch to Firestore:', error);
  }
};

importArticles().catch(error => {
  console.error("An unexpected error occurred during the import process:", error);
});

