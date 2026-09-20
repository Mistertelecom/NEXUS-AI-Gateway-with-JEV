/**
 * NEXUS Secure Vault — AES-256-GCM
 * Encrypts upstream credentials and tokens at rest with external master key.
 */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";
import fs from "fs";
import path from "path";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const KEY_LENGTH = 32;
const AUTH_TAG_LENGTH = 16;
const PREFIX = "enc:nx:v1:";
const SALT = "nexus-vault-key-derivation-salt-v1";

let _derivedMasterKey: Buffer | null = null;

/**
 * Resolves the external master key. Checks:
 * 1. process.env.NEXUS_MASTER_KEY
 * 2. .nexus/master.key on disk (auto-created with 0600 mode if missing)
 */
export function getMasterKey(): Buffer {
  if (_derivedMasterKey) return _derivedMasterKey;

  let rawKey = process.env.NEXUS_MASTER_KEY;

  if (!rawKey) {
    const keyDir = path.resolve(process.cwd(), ".nexus");
    const keyPath = path.join(keyDir, "master.key");

    if (fs.existsSync(keyPath)) {
      rawKey = fs.readFileSync(keyPath, "utf-8").trim();
    } else {
      // Auto-generate strong master key
      if (!fs.existsSync(keyDir)) {
        fs.mkdirSync(keyDir, { recursive: true });
      }
      rawKey = randomBytes(32).toString("hex");
      fs.writeFileSync(keyPath, rawKey, { encoding: "utf-8", mode: 0o600 });
    }
  }

  _derivedMasterKey = scryptSync(rawKey, SALT, KEY_LENGTH);
  return _derivedMasterKey;
}

/**
 * Encrypts a plaintext secret string using AES-256-GCM.
 */
export function encryptSecret(plaintext: string): string {
  if (!plaintext) return "";
  if (plaintext.startsWith(PREFIX)) return plaintext; // Already encrypted

  const key = getMasterKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });

  let encrypted = cipher.update(plaintext, "utf-8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return `${PREFIX}${iv.toString("hex")}:${encrypted}:${authTag}`;
}

/**
 * Decrypts an encrypted ciphertext string.
 */
export function decryptSecret(ciphertext: string): string {
  if (!ciphertext) return "";
  if (!ciphertext.startsWith(PREFIX)) return ciphertext; // Return plaintext if not encrypted

  const parts = ciphertext.slice(PREFIX.length).split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted format: expected iv:ciphertext:authTag");
  }

  const [ivHex, encHex, authTagHex] = parts;
  const key = getMasterKey();
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  if (authTag.length !== AUTH_TAG_LENGTH) {
    throw new Error("Corrupted or truncated GCM authentication tag");
  }

  const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encHex, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}

/**
 * Masks a secret string for safe display in UI or logs.
 */
export function maskSecret(secret: string | null | undefined): string {
  if (!secret) return "";
  if (secret.startsWith(PREFIX)) return "••••••••(enc)";
  if (secret.length <= 8) return "••••••••";
  return `${secret.slice(0, 4)}••••${secret.slice(-4)}`;
}

/**
 * Recursively redacts sensitive keys from an object before logging or exporting.
 */
export function redactObject<T>(obj: T): T {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => redactObject(item)) as unknown as T;
  }

  const SENSITIVE_PATTERN = /key|token|secret|password|auth|credential/i;
  const result: Record<string, unknown> = {};

  for (const [k, v] of Object.entries(obj)) {
    if (SENSITIVE_PATTERN.test(k) && typeof v === "string") {
      result[k] = maskSecret(v);
    } else if (typeof v === "object" && v !== null) {
      result[k] = redactObject(v);
    } else {
      result[k] = v;
    }
  }

  return result as T;
}

/**
 * Vault class wrapper for singleton access and convenience methods.
 */
export class Vault {
  private static instance: Vault;

  public static getInstance(): Vault {
    if (!Vault.instance) {
      Vault.instance = new Vault();
    }
    return Vault.instance;
  }

  public getMasterKey(): Buffer {
    return getMasterKey();
  }

  public encrypt(plaintext: string): string {
    return encryptSecret(plaintext);
  }

  public decrypt(ciphertext: string): string {
    return decryptSecret(ciphertext);
  }

  public mask(secret: string | null | undefined): string {
    return maskSecret(secret);
  }

  public redact<T>(obj: T): T {
    return redactObject(obj);
  }
}
