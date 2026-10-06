import { getItem, setItem, genId } from "./storageService";

// Factory that creates a REST-like service (getAll, create, update, delete)
// scoped to a userId, backed by localStorage. Designed so it can later be
// swapped 1:1 for real API calls (getAll -> GET, create -> POST, etc).
export function makeUserScopedService(storageKey, idPrefix) {
  function getAllRaw() {
    return getItem(storageKey, []);
  }

  function saveAllRaw(items) {
    setItem(storageKey, items);
  }

  return {
    getAll(userId) {
      return getAllRaw().filter((item) => item.userId === userId);
    },
    getById(id) {
      return getAllRaw().find((item) => item.id === id) || null;
    },
    create(userId, data) {
      const items = getAllRaw();
      const newItem = { id: genId(idPrefix), userId, ...data };
      items.push(newItem);
      saveAllRaw(items);
      return newItem;
    },
    update(id, updates) {
      const items = getAllRaw();
      const idx = items.findIndex((item) => item.id === id);
      if (idx === -1) throw new Error("Record not found.");
      items[idx] = { ...items[idx], ...updates };
      saveAllRaw(items);
      return items[idx];
    },
    delete(id) {
      const items = getAllRaw().filter((item) => item.id !== id);
      saveAllRaw(items);
      return true;
    },
    deleteAllForUser(userId) {
      const items = getAllRaw().filter((item) => item.userId !== userId);
      saveAllRaw(items);
    },
    _getAllRaw: getAllRaw,
    _saveAllRaw: saveAllRaw,
  };
}
