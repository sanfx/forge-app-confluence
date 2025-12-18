const { storage } = require("@forge/api");

const handler = async (event) => {
  const { rowId, release } = event.parameters || {};
  const pageId = event.context?.extension?.content?.id || "unknown-page";

  const saved = await storage.get(`checkbox-${pageId}-${rowId}`);
  const checked = saved === true;

  return { rowId, release, checked };
};

const saveCheckbox = async (event, { rowId, checked }) => {
  const pageId = event.context?.extension?.content?.id || "unknown-page";
  await storage.set(`checkbox-${pageId}-${rowId}`, !!checked);
  return { checked: !!checked };
};

module.exports = { handler, saveCheckbox };
