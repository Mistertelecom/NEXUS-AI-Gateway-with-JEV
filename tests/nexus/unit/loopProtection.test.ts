import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { checkLoopProtection, MAX_HOP_COUNT } from "../../../src/nexus/gateway/loopProtection";

describe("NEXUS Loop Protection (X-Nexus-Hop-Count)", () => {
  test("allows requests without hop count and sets next hop to 1", () => {
    const res = checkLoopProtection({});
    assert.equal(res.allowed, true);
    assert.equal(res.currentHop, 0);
    assert.equal(res.nextHop, 1);
  });

  test("allows requests below hop limit", () => {
    const res = checkLoopProtection({ "x-nexus-hop-count": "3" });
    assert.equal(res.allowed, true);
    assert.equal(res.currentHop, 3);
    assert.equal(res.nextHop, 4);
  });

  test("blocks requests when hop limit is reached or exceeded", () => {
    const res = checkLoopProtection({ "x-nexus-hop-count": String(MAX_HOP_COUNT) });
    assert.equal(res.allowed, false);
    assert.ok(res.error?.includes("Loop detectado no NEXUS Gateway"));

    const overLimit = checkLoopProtection({ "x-nexus-hop-count": "10" });
    assert.equal(overLimit.allowed, false);
  });
});
