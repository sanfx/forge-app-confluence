// Import React and Forge UI Kit components/hooks
import React from "react";
import ForgeReconciler, {
  Text,
  Checkbox,
  useProductContext,
} from "@forge/react";
// Import the bridge method to call Confluence REST APIs
import { requestConfluence } from "@forge/bridge";

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

const App = () => {
  // State of the checkbox set by the user
  const [checked, setChecked] = React.useState(false);
  // User's name to set as approver in next column
  const [currentUserName, setCurrentUserName] = React.useState("");
  const [userLoading, setUserLoading] = React.useState(true);
  const [userError, setUserError] = React.useState(null);

  const releases = ["Release 1.0", "Release 1.1", "Release 2.0"];
  const [approvers, setApprovers] = React.useState(() =>
    releases.map(() => ""),
  );

  React.useEffect(() => {
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
          // console.log("Fetched current user:", name);
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
  // we determine the user name to set as approver in next column
  const handleToggle = (index, checked) => {
    setApprovers((prev) => {
      const next = [...prev];
      next[index] = checked ? currentUserName : "";
      return next;
    });
  };
  const VERSION = "2.18.0";
  // Determine greeting text
  let greeting;
  if (userLoading)
    greeting = "Hello ..."; // loading indicator
  else if (userError)
    greeting = `Hello (error fetching user)`; // visible error
  else if (currentUserName) greeting = `Hello ${currentUserName},`;
  else greeting = "Hello woooorld!"; // fallback

  return (
    <>
      <Text>
        {greeting} Macro version is {VERSION}
      </Text>
      <Checkbox
        label="Release"
        isChecked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
