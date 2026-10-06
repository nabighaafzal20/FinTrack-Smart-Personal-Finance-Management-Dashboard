import { KEYS } from "./storageService";
import { makeUserScopedService } from "./makeUserScopedService";

export const subscriptionService = makeUserScopedService(KEYS.SUBSCRIPTIONS, "sub");
