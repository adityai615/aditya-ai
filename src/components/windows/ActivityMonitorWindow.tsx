"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createInitialMetrics,
  createInitialProcesses,
  getNextMetrics,
  getNextProcesses,
  getSystemHealth,
  type ActivityMetrics,
  type ActivityProcessRow,
} from "@/lib/activity-monitor-data";

function formatClock(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
}

function formatUptime(secondsElapsed: number) {
  const hours = Math.floor(secondsElapsed / 3600);
  const minutes = Math.floor((secondsElapsed % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

const metricLabels: Array<{ key: keyof ActivityMetrics; label: string }> = [
  { key: "cpu", label: "CPU" },
  { key: "memory", label: "Memory" },
  { key: "network", label: "Network" },
  { key: "aiUsage", label: "AI Usage" },
];

export function ActivityMonitorWindow() {
  const [metrics, setMetrics] = useState<ActivityMetrics>(createInitialMetrics);
  const [processes, setProcesses] = useState<ActivityProcessRow[]>(createInitialProcesses);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [uptimeSeconds, setUptimeSeconds] = useState(0);

  useEffect(() => {
    const metricsTimer = window.setInterval(() => {
      setMetrics((previous) => getNextMetrics(previous));
      setProcesses((previous) => getNextProcesses(previous));
      setLastUpdated(new Date());
    }, 2400);

    const uptimeTimer = window.setInterval(() => {
      setUptimeSeconds((previous) => previous + 1);
    }, 1000);

    return () => {
      window.clearInterval(metricsTimer);
      window.clearInterval(uptimeTimer);
    };
  }, []);

  const systemHealth = useMemo(() => getSystemHealth(metrics), [metrics]);

  const refreshMetrics = () => {
    setMetrics(createInitialMetrics());
    setProcesses(createInitialProcesses());
    setLastUpdated(new Date());
  };

  return (
    <div className="h-full overflow-auto px-4 py-5 sm:px-6 sm:py-6">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-5">
        <section className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-ui text-[18px] font-semibold text-[var(--os-text)]">
                System Overview
              </h2>
              <p className="text-label mt-1 text-[var(--os-text-muted)]">
                Last Updated: {formatClock(lastUpdated)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-label rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] px-2.5 py-1 text-[var(--os-text-muted)]">
                System Status: Stable
              </span>
              <button
                type="button"
                onClick={refreshMetrics}
                className="text-ui rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] px-3 py-2 text-sm text-[var(--os-text)] transition-colors hover:bg-[var(--os-hover)]"
              >
                Refresh Metrics
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {metricLabels.map((metric) => (
              <article
                key={metric.key}
                className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] p-3"
              >
                <p className="text-label text-[var(--os-text-muted)]">{metric.label}</p>
                <p className="text-ui mt-2 text-[24px] font-semibold leading-none text-[var(--os-text)]">
                  {metrics[metric.key]}%
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] p-4 sm:p-5">
            <h3 className="text-ui text-[16px] font-semibold text-[var(--os-text)]">
              Live Resource Usage
            </h3>

            <div className="mt-4 space-y-4">
              {metricLabels.map((metric) => (
                <div key={`${metric.key}-progress`}>
                  <div className="flex items-center justify-between">
                    <p className="text-label text-[var(--os-text-muted)]">{metric.label}</p>
                    <p className="text-label text-[var(--os-text)]">{metrics[metric.key]}%</p>
                  </div>
                  <div className="mt-1.5 h-2 rounded bg-[var(--os-hover)]">
                    <div
                      className="h-full rounded bg-[var(--os-text-muted)] transition-[width] duration-500 ease-out"
                      style={{ width: `${metrics[metric.key]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] p-4 sm:p-5">
            <h3 className="text-ui text-[16px] font-semibold text-[var(--os-text)]">System Health</h3>
            <p className="text-ui mt-2 text-[24px] font-semibold leading-none text-[var(--os-text)]">
              {systemHealth}
            </p>

            <p className="text-label mt-6 text-[var(--os-text-muted)]">Aditya OS Uptime</p>
            <p className="text-ui mt-2 text-[20px] font-semibold text-[var(--os-text)]">
              {formatUptime(uptimeSeconds)}
            </p>
          </article>
        </section>

        <section className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] p-4 sm:p-5">
          <h3 className="text-ui text-[16px] font-semibold text-[var(--os-text)]">Processes</h3>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse">
              <thead>
                <tr className="border-b-[0.5px] border-[var(--os-border)] text-left">
                  <th className="text-label px-2 py-2 text-[var(--os-text-muted)]">Process</th>
                  <th className="text-label px-2 py-2 text-[var(--os-text-muted)]">Usage %</th>
                  <th className="text-label px-2 py-2 text-[var(--os-text-muted)]">Status</th>
                </tr>
              </thead>
              <tbody>
                {processes.map((process) => (
                  <tr
                    key={process.id}
                    className="border-b-[0.5px] border-[var(--os-border)] last:border-b-0"
                  >
                    <td className="text-ui px-2 py-2.5 text-[var(--os-text)]">{process.name}</td>
                    <td className="text-ui px-2 py-2.5 text-[var(--os-text)]">{process.usage}%</td>
                    <td className="text-ui px-2 py-2.5 text-[var(--os-text-muted)]">
                      {process.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

