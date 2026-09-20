import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  encryptSecret,
  decryptSecret,
  maskSecret,
  redactObject,
  Vault,
} from "../../../src/nexus/providers/vault";

describe("NEXUS Vault — AES-256-GCM Encryption", () => {
  test("encrypts and decrypts secrets correctly", () => {
    const original = "sk-ant-api03-sample-very-secret-token-123456";
    const encrypted = encryptSecret(original);

    assert.ok(encrypted.startsWith("enc:nx:v1:"));
    assert.notEqual(encrypted, original);

    const decrypted = decryptSecret(encrypted);
    assert.equal(decrypted, original);
  });

  test("masks secrets safely for UI and logs", () => {
    assert.equal(maskSecret(""), "");
    assert.equal(maskSecret("short"), "••••••••");
    assert.equal(maskSecret("sk-1234567890abcdef"), "sk-1••••cdef");
    assert.equal(maskSecret("enc:nx:v1:something"), "••••••••(enc)");
  });

  test("redacts sensitive fields in objects recursively", () => {
    const payload = {
      apiKey: "secret-key-123456",
      user: "developer",
      nested: {
        token: "nested-token-987654",
        safe: "hello-world",
      },
    };

    const redacted = redactObject(payload);
    assert.equal(redacted.user, "developer");
    assert.equal(redacted.nested.safe, "hello-world");
    assert.ok(redacted.apiKey.includes("••••"));
    assert.ok(redacted.nested.token.includes("••••"));
  });

  test("Vault class singleton convenience methods", () => {
    const vault = Vault.getInstance();
    const secret = "test-secret-value";
    const enc = vault.encrypt(secret);
    const dec = vault.decrypt(enc);
    assert.equal(dec, secret);
  });
});
