import { Macro, Text, Checkbox, useState } from "@forge/ui";

const VERSION = "2.19.0";

const App = ({ rowId, release, checked, currentUserName }) => {
  const [isChecked, setIsChecked] = useState(checked);

  // UI Kit cannot call backend directly; persistence happens via resolver.
  // So we update local state, and rely on Forge to re-run resolver on next render.
  const handleChange = async (newValue) => {
    setIsChecked(newValue);
    // This triggers a re-render with updated props on next invocation
    await fetch(`/gateway/save`, {
      // pseudo-code: Forge handles this internally
      method: "POST",
      body: JSON.stringify({ rowId, value: newValue }),
    });
  };

  const greeting = currentUserName ? `Hello ${currentUserName},` : "Hello ...";

  return (
    <>
      <Text>
        {greeting} Macro version is {VERSION}
      </Text>
      <Text>
        Row ID: {rowId} — Release: {release}
      </Text>
      <Checkbox label="Approve" isChecked={isChecked} onChange={handleChange} />
    </>
  );
};

export const run = (props) => <Macro app={<App {...props} />} />;
