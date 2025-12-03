// Import React and Forge UI Kit components/hooks
import React from 'react';
import ForgeReconciler, { Text, useProductContext } from '@forge/react';
// Import the bridge method to call Confluence REST APIs
import { requestConfluence } from '@forge/bridge';

/**
* Fetches footer comments for a given Confluence page.
* @param {string} pageId - The ID of the Confluence page.
* @returns {Promise<Array>} - Resolves to an array of comment objects.
*/
const fetchCommentsForPage = async (pageId) => {
  // Call the Confluence REST API for footer comments
  const res = await requestConfluence(`/wiki/api/v2/pages/${pageId}/footer-comments`);
  const data = await res.json();
  return data.results;
};

const App = () => {
  // Get the current Atlassian app context (includes page info)
  const context = useProductContext();

  // State to store the array of footer comments
  const [comments, setComments] = React.useState();

  // Log the number of comments to the browser console for debugging
  console.log(`Number of comments on this page: ${comments?.length}`);

  // Fetch comments when the context is available (i.e., after loading)
  React.useEffect(() => {
    if (context) {
      // Extract the page ID from the context object
      const pageId = context.extension.content.id;
      // Fetch and store the comments
      fetchCommentsForPage(pageId).then(setComments);
    }
  }, [context]);

  // Render the UI: show the number of comments and a hello message
  return (
    <>
      <Text>Number of comments on this page: {comments?.length}</Text>
      <Text>Hello world!</Text>
    </>
  );
};

// Render the App component using ForgeReconciler
ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
