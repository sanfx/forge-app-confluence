const { storage } = require("@forge/api");

const handler = async (event) => {
  console.log("Handler was called.");
  const savePayload = event.call?.payload;
  const { rowId = "test-row-1", checked: saveChecked } =
    savePayload || event.parameters || {};
  const pageId = event.context?.extension?.content?.id || "unknown-page";
  const key = `checkbox-${pageId}-${rowId}`;
  console.log("savedChecked is: ", saveChecked);
  if (saveChecked !== undefined) {
    const checkedValue = !!saveChecked;
    await storage.set(key, checkedValue);
    console.log(`*** SAVED ${key} = ${checkedValue} ***`);
    return { rowId, checked: checkedValue };
  }

  // LOAD + DEBUG ALL KEYS
  const saved = await storage.get(key);
  console.log(`Key ${key}: ${saved}`);

  const checked = saved === true;
  return { rowId, checked };
};

module.exports = { handler };
