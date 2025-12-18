const { storage } = require("@forge/api");

const handler = async (event, payload) => {
  console.log("=== HANDLER START ===");
  console.log("EVENT:", JSON.stringify(event.call || "no call"));
  console.log("PAYLOAD:", JSON.stringify(payload));

  const rowId = event.parameters?.rowId || payload?.rowId || "test-row-1";
  const pageId = event.context?.extension?.content?.id || "unknown-page";
  const key = `checkbox-${pageId}-${rowId}`;

  // Check for save - log EVERYTHING
  console.log("SAVE CHECK? payload.checked =", payload?.checked);

  if (payload && payload.checked !== undefined) {
    const checkedValue = !!payload.checked;
    console.log("*** SAVING", key, "=", checkedValue, "***");
    await storage.set(key, checkedValue);
    console.log("*** SAVE DONE ***");
    return { rowId, checked: checkedValue };
  }

  // LOAD
  console.log("LOADING", key);
  const saved = await storage.get(key);
  console.log("Storage:", saved);
  const checked = saved === true;
  return { rowId, checked };
};

module.exports = { handler };
