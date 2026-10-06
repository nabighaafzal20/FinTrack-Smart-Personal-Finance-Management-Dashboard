// Browser-compatible password hashing using SubtleCrypto (SHA-256).
// NOTE: This is a frontend-only demo app with no real backend, so this is
// for obfuscation (not exposing plaintext passwords in localStorage), not
// production-grade security.

export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(password, hash) {
  const computed = await hashPassword(password);
  return computed === hash;
}
