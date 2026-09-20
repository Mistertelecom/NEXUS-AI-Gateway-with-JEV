import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { validateOutboundUrl, isPrivateIp } from "../../../src/nexus/providers/ssrf";

describe("NEXUS SSRF Protection", () => {
  test("identifies private IPv4 and IPv6 addresses", () => {
    assert.equal(isPrivateIp("127.0.0.1"), true);
    assert.equal(isPrivateIp("10.0.0.1"), true);
    assert.equal(isPrivateIp("192.168.1.1"), true);
    assert.equal(isPrivateIp("172.16.0.1"), true);
    assert.equal(isPrivateIp("169.254.169.254"), true);
    assert.equal(isPrivateIp("100.64.0.1"), true);
    assert.equal(isPrivateIp("100.127.255.254"), true);
    assert.equal(isPrivateIp("100.128.0.1"), false);
    assert.equal(isPrivateIp("::1"), true);
    assert.equal(isPrivateIp("::ffff:127.0.0.1"), true);
    assert.equal(isPrivateIp("ff02::1"), true);
    assert.equal(isPrivateIp("8.8.8.8"), false);
    assert.equal(isPrivateIp("1.1.1.1"), false);
  });

  test("blocks requests to loopback and metadata addresses", async () => {
    const loopback = await validateOutboundUrl("http://127.0.0.1:8080/v1/models");
    assert.equal(loopback.valid, false);
    assert.ok(loopback.reason?.includes("privado ou de loopback"));

    const metadata = await validateOutboundUrl("http://169.254.169.254/latest/meta-data/");
    assert.equal(metadata.valid, false);

    const localhost = await validateOutboundUrl("http://localhost:3000");
    assert.equal(localhost.valid, false);
  });

  test("allows public URLs with valid protocol", async () => {
    const pub = await validateOutboundUrl("https://api.openai.com/v1/models");
    assert.equal(pub.valid, true);
  });

  test("respects allowPrivate flag when explicitly configured", async () => {
    const check = await validateOutboundUrl("http://192.168.1.50:8000/v1", {
      allowPrivate: true,
    });
    assert.equal(check.valid, true);
  });
});
