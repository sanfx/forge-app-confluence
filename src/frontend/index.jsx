import React, { useState, useEffect } from "react";
import ForgeReconciler, {
  Text,
  Checkbox,
  useProductContext,
} from "@forge/react";
import { invoke } from "@forge/bridge";
// Import the bridge method to call Confluence REST APIs
import { requestConfluence } from "@forge/bridge";

/**
 * Fetches footer comments for a given Confluence page.
 * @param {string} pageId - The ID of the Confluence page.
 * @returns {Promise<Array>} - Resolves to an array of comment objects.
 */
const fetchCommentsForPage = async (pageId) => {
  const res = await requestConfluence(
    `/wiki/api/v2/pages/${pageId}/footer-comments`,
  );
  const data = await res.json();
  return data.results;
};

/**
 * Fetches the currently logged in Confluence user.
 * Returns an object or throws when the response is not ok.
 */
const fetchCurrentUser = async () => {
  const res = await requestConfluence("/wiki/rest/api/user/current");
  // If not OK, try to parse body for debug info and throw
  if (!res.ok) {
    let body;
    try {
      body = await res.json();
    } catch (e) {
      body = await res.text();
    }
    const err = new Error(
      `Failed to fetch current user: ${res.status} ${res.statusText} - ${JSON.stringify(
        body,
      )}`,
    );
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return res.json();
};

const App = (props) => {
  const { rowId, release, checked: initialChecked } = props;
  const context = useProductContext();
  const [checked, setChecked] = useState(initialChecked ?? false);
  const [saving, setSaving] = useState(false);
  const [comments, setComments] = useState();
  const [currentUserName, setCurrentUserName] = useState("");
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);

  const releases = ["Release 1.0", "Release 1.1", "Release 2.0"];
  const [approvers, setApprovers] = useState(() => releases.map(() => ""));

  console.log(`Number of comments on this page: ${comments?.length}`);

  useEffect(() => {
    if (context) {
      const pageId = context.extension.content.id;
      fetchCommentsForPage(pageId)
        .then(setComments)
        .catch((err) => console.error("fetchCommentsForPage error", err));
    }
  }, [context]);

  useEffect(() => {
    let cancelled = false;
    setUserLoading(true);
    setUserError(null);
    fetchCurrentUser()
      .then((user) => {
        if (!cancelled) {
          // Prefer publicName as you requested
          const name =
            user?.publicName ||
            user?.displayName ||
            user?.username ||
            user?.accountId ||
            "";
          console.log("Fetched current user:", name);
          setCurrentUserName(name);
          setUserLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to fetch current user", err);
          setUserError(err);
          setUserLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggle = async (value) => {
    setChecked(value);
    setSaving(true);
    try {
      await invoke("save-checkbox", { rowId, checked: value });
    } finally {
      setSaving(false);
    }
  };
  console.log("User: ", currentUserName);
  // Determine greeting text
  let greeting;
  if (userLoading)
    greeting = "Hello ..."; // loading indicator
  else if (userError)
    greeting = `Hello (error fetching user)`; // visible error
  else if (currentUserName) greeting = `Hello ${currentUserName}!`;
  else greeting = "Hello woooorld!"; // fallback

  return (
    <>
      <Text>Number of comments on this page: {comments?.length}</Text>

      <Text>{greeting}</Text>
      <Checkbox
        label={saving ? "Saving..." : "Approve"}
        isChecked={checked}
        onChange={handleToggle}
      />
      {/* <Checkbox
        label="Release"
        isChecked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />*/}

      {/* If there was an error, show a small hint with details in console */}
      {userError && (
        <Text>
          (See console/network for details — status: {userError.status || "?"})
        </Text>
      )}
      {currentUserName && <Text>(Logged in as {currentUserName})</Text>}
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
