import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const ROOT = process.cwd();

function read(relativePath: string): string {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

test("public shell presents NEXUS alpha as Lead and Worker lanes joined by JEV", () => {
  const landingSources = [
    "src/app/landing/components/HeroSection.tsx",
    "src/app/landing/components/HowItWorks.tsx",
    "src/app/landing/components/FlowAnimation.tsx",
  ]
    .map(read)
    .join("\n");
  const english = JSON.parse(read("src/i18n/messages/en.json")) as {
    landing: Record<string, string>;
  };

  assert.match(landingSources, /leadLane/i);
  assert.match(landingSources, /workerLane/i);
  assert.match(landingSources, /jev/i);
  assert.match(english.landing.heroDescription, /alpha/i);
  assert.match(english.landing.heroDescription, /Lead/i);
  assert.match(english.landing.heroDescription, /Worker/i);
  assert.match(english.landing.heroDescription, /JEV/i);
});

test("public shell does not make unverified repository, live-status, or router claims", () => {
  const publicSources = [
    "src/app/landing/components/HeroSection.tsx",
    "src/app/landing/components/FlowAnimation.tsx",
    "src/app/landing/components/GetStarted.tsx",
    "src/app/landing/components/Footer.tsx",
  ]
    .map(read)
    .join("\n");
  const english = JSON.parse(read("src/i18n/messages/en.json")) as {
    landing: Record<string, string>;
  };

  assert.doesNotMatch(publicSources, /github\.com\/nexus-ai-gateway\/nexus/i);
  assert.doesNotMatch(publicSources, /animate-pulse/);
  assert.doesNotMatch(english.landing.heroDescription, /provider|router|proxy/i);
  assert.doesNotMatch(english.landing.versionLive, /live/i);
  assert.doesNotMatch(english.landing.getStartedStep2Description, /provider|api key/i);
  assert.doesNotMatch(english.landing.ctaDescription, /open source|free/i);
});

test("NEXUS metadata is honest about alpha scope and login preserves its legacy marker", () => {
  const layout = read("src/app/layout.tsx");
  const login = read("src/app/login/page.tsx");

  assert.match(layout, /NEXUS.*alpha/i);
  assert.match(login, /sessionStorage\.setItem\("omniroute_login_time"/);
});
