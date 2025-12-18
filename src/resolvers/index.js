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
  // ← payload, NOT destructured
  console.log("=== SAVE CHECKBOX CALLED ===");
  console.log("PAYLOAD:", JSON.stringify(payload));

  const { rowId, checked } = payload || {};
  const rowIdFinal = rowId || "test-row-1";
  const pageId = event.context?.extension?.content?.id || "unknown-page";

  const storageKey = `checkbox-${pageId}-${rowIdFinal}`;
  const checkedValue = !!checked;

  console.log(`Saving ${storageKey} = ${checkedValue}`);
  await storage.set(storageKey, checkedValue);
  console.log("=== SAVE COMPLETED ===");

  return { checked: checkedValue };
};

module.exports = { handler, saveCheckbox };
