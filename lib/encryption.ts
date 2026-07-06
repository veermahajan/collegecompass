import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

// Phase A4 — application-layer AES-256-GCM for the Compass Score engine's
// Context/socioeconomic subscore (spec Sec 8: "AES-256 encrypted at the
// application layer before it ever reaches Postgres"). Used for both the
// raw context input (AcademicProfile.contextInputEncrypted) and the
// computed context subscore (CompassScore.contextScoreEncrypted).
//
// Key must be a base64-encoded 32-byte value, e.g. generated with:
//   openssl rand -base64 32
// Lives only in an encrypted Vercel env var — never in source (Sec 8).

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function getKey(): Buffer {
  const raw = process.env.COMPASS_CONTEXT_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error("COMPASS_CONTEXT_ENCRYPTION_KEY is not set.");
  }
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error(
      "COMPASS_CONTEXT_ENCRYPTION_KEY must decode to exactly 32 bytes."
    );
  }
  return key;
}

/** Encrypts a JSON-serializable value to a single base64 string: iv + authTag + ciphertext. */
export function encryptJson(value: unknown): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const plaintext = Buffer.from(JSON.stringify(value), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, ciphertext]).toString("base64");
}

/** Decrypts a blob produced by encryptJson. Only ever call this inside a server-side scoring computation — never on a path that returns to a client. */
export function decryptJson<T>(blob: string): T {
  const key = getKey();
  const raw = Buffer.from(blob, "base64");
  const iv = raw.subarray(0, IV_LENGTH);
  const authTag = raw.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = raw.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return JSON.parse(plaintext.toString("utf8")) as T;
}
