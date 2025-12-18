const { storage } = require("@forge/api");

const handler = async (event) => {
  console.log("HANDLER CALLED");

  const { rowId: rawRowId, release = "Test Release" } = event.parameters || {};
  const rowId = rawRowId || "test-row-1";

  const pageId = event.context?.extension?.content?.id || "unknown-page";

  const storageKey = `checkbox-${pageId}-${rowId}`;
  console.log(`Looking for key: ${storageKey}`);

  const saved = await storage.get(storageKey);
  console.log(`Storage value for ${storageKey}:`, saved);

  const checked = saved === true;
  return { rowId, release, checked };
};

const saveCheckbox = async (event, payload) => {
  console.log("SAVE CALLED", payload);
  const { rowId: rawRowId, checked } = payload || {};
  const rowId = rawRowId || "test-row-1";
  const pageId = event.context?.extension?.content?.id || "unknown-page";
  // Ensure we save a boolean
  const checkedValue = !!checked;
  console.log(`Saving checkbox-${pageId}-${rowId} = ${checkedValue}`);
  await storage.set(`checkbox-${pageId}-${rowId}`, checkedValue);
  console.log("Save complete");
  return { checked: checkedValue };
};

module.exports = { handler, saveCheckbox };
