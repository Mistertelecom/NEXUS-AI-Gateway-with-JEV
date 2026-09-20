import ConductorPageClient from "./ConductorPageClient";

export const metadata = {
  title: "Conductor — NEXUS",
  description: "NEXUS Conductor CLI-agent fleet: runners, task queue and councils, live.",
};

export default function ConductorPage() {
  return <ConductorPageClient />;
}
