const { storage, requestConfluence } = require("@forge/api");

// Initial render: load state + user
async function handler({ rowId = "default-row", release = "Test Release" }) {
  const saved = await storage.get(`checkbox-${rowId}`);
  const checked = saved === true;

  const res = await requestConfluence("/wiki/rest/api/user/current");
  const user = await res.json();
  const currentUserName =
    user?.publicName ||
    user?.displayName ||
    user?.username ||
    user?.accountId ||
    "";

  return { rowId, release, checked, currentUserName };
}

// Save new state
async function save({ rowId, value }) {
  await storage.set(`checkbox-${rowId}`, value);
  return { checked: value };
}

module.exports = { handler, save };
