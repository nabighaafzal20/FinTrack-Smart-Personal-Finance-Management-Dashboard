import { KEYS, getItem, setItem, removeItem, genId } from "./storageService";
import { hashPassword, verifyPassword } from "../utils/hash";
import { nowISO } from "../utils/dateUtils";

export function getUsers() {
  return getItem(KEYS.USERS, []);
}

function saveUsers(users) {
  setItem(KEYS.USERS, users);
}

export async function register({ name, email, password }) {
  const users = getUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    throw new Error("An account with this email already exists.");
  }
  const passwordHash = await hashPassword(password);
  const newUser = {
    id: genId("user"),
    name,
    email,
    passwordHash,
    currency: "PKR",
    bio: "",
    avatar: "",
    createdAt: nowISO(),
  };
  users.push(newUser);
  saveUsers(users);
  const { passwordHash: _omit, ...safeUser } = newUser;
  return safeUser;
}

export async function login({ email, password }) {
  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error("Invalid email or password.");
  }
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new Error("Invalid email or password.");
  }
  const { passwordHash: _omit, ...safeUser } = user;
  return safeUser;
}

export function getCurrentUser() {
  return getItem(KEYS.CURRENT_USER, null);
}

export function setCurrentUser(user) {
  setItem(KEYS.CURRENT_USER, user);
}

export function logout() {
  removeItem(KEYS.CURRENT_USER);
}

export function findUserByEmail(email) {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function updateUser(userId, updates) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error("User not found.");
  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);
  const { passwordHash: _omit, ...safeUser } = users[idx];
  const current = getCurrentUser();
  if (current && current.id === userId) {
    setCurrentUser(safeUser);
  }
  return safeUser;
}

export async function changePassword(userId, newPassword) {
  const passwordHash = await hashPassword(newPassword);
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error("User not found.");
  users[idx].passwordHash = passwordHash;
  saveUsers(users);
  return true;
}

export function deleteUser(userId) {
  const users = getUsers().filter((u) => u.id !== userId);
  saveUsers(users);
}
