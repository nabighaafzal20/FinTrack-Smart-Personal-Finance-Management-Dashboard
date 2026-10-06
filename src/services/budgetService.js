import { KEYS } from "./storageService";
import { makeUserScopedService } from "./makeUserScopedService";

export const budgetService = makeUserScopedService(KEYS.BUDGETS, "budget");
