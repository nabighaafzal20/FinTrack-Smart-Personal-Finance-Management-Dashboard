import { KEYS } from "./storageService";
import { makeUserScopedService } from "./makeUserScopedService";

const base = makeUserScopedService(KEYS.TRANSACTIONS, "txn");

export const transactionService = {
  ...base,
  getAll(userId) {
    return base.getAll(userId).sort((a, b) => new Date(b.date) - new Date(a.date));
  },
};
