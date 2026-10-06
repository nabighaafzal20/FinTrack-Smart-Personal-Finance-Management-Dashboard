import { KEYS } from "./storageService";
import { makeUserScopedService } from "./makeUserScopedService";

export const goalService = makeUserScopedService(KEYS.GOALS, "goal");
