const { storage } = require("@forge/api");

const handler = async (event) => {
  console.log("Handler called with event:", JSON.stringify(event, null, 2));

  const functionKey = event.call?.functionKey || event.functionKey;
  const payload = event.call?.payload;
  const parameters = event.parameters || {};
  console.log("payload", payload);
  // console.log("functionKey", functionKey);
  // Merge payload and parameters
  const { rowId = "test-row-1", checked: saveChecked } = {
    ...parameters,
    ...payload,
  };

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
