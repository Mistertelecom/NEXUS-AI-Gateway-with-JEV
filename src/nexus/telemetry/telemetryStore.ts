/**
 * NEXUS JEV telemetry buffer. Records are added only by real execution paths;
 * unreported provider usage and cost stay absent instead of becoming zeroes.
 */

import type { JevCallRecord, TelemetryStats } from "./telemetryContracts";

export type { JevCallRecord, TelemetryStats } from "./telemetryContracts";

export class NexusTelemetryStore {
  private static instance: NexusTelemetryStore | undefined;
  private calls: JevCallRecord[] = [];
  private readonly maxCalls = 150;

  private constructor() {}

  public static getInstance(): NexusTelemetryStore {
    if (NexusTelemetryStore.instance === undefined) {
      NexusTelemetryStore.instance = new NexusTelemetryStore();
    }
    return NexusTelemetryStore.instance;
  }

  public recordCall(record: JevCallRecord): void {
    this.calls.unshift(record);
    if (this.calls.length > this.maxCalls) {
      this.calls.pop();
    }
  }

  public getCalls(limit: number = 50): readonly JevCallRecord[] {
    return this.calls.slice(0, limit);
  }

  public getStats(): TelemetryStats {
    let totalTokens = 0;
    let usageMeasuredCalls = 0;
    let totalCostUsd = 0;
    let costMeasuredCalls = 0;
    let totalJevLatency = 0;
    let jevCalls = 0;
    const taskBreakdown = new Map<string, number>();
    const engineBreakdown = new Map<string, number>();

    for (const call of this.calls) {
      if (call.usage !== undefined) {
        usageMeasuredCalls += 1;
        totalTokens += call.usage.totalTokens;
      }

      if (call.cost !== undefined) {
        costMeasuredCalls += 1;
        totalCostUsd += call.cost.amountUsd;
      }

      if (call.jevUsed) {
        jevCalls += 1;
        totalJevLatency += call.jev.latencyMs;
        taskBreakdown.set(call.jev.taskKind, (taskBreakdown.get(call.jev.taskKind) ?? 0) + 1);
      }

      engineBreakdown.set(call.engine, (engineBreakdown.get(call.engine) ?? 0) + 1);
    }

    return {
      totalCalls: this.calls.length,
      jevCalls,
      usageMeasuredCalls,
      ...(usageMeasuredCalls > 0 ? { totalTokens } : {}),
      costMeasuredCalls,
      ...(costMeasuredCalls > 0 ? { totalCostUsd: Number(totalCostUsd.toFixed(6)) } : {}),
      ...(jevCalls > 0 ? { avgJevLatencyMs: Number((totalJevLatency / jevCalls).toFixed(2)) } : {}),
      taskBreakdown: Object.fromEntries(taskBreakdown),
      engineBreakdown: Object.fromEntries(engineBreakdown),
    };
  }

  public clear(): void {
    this.calls = [];
  }
}
