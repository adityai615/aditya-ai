"use client";

import { useEffect, useState } from "react";

const START_DATE = new Date(2024, 4, 1);

type UptimeDiff = {
  years: number;
  months: number;
  days: number;
};

function calculateUptime(start: Date, now: Date): UptimeDiff {
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    const daysInPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += daysInPrevMonth;
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days };
}

const monoStyle = { fontFamily: "var(--font-mono, 'SF Mono', monospace)" };

export function UptimeWindow() {
  const [uptime, setUptime] = useState<UptimeDiff>(() =>
    calculateUptime(START_DATE, new Date()),
  );

  useEffect(() => {
    const update = () => {
      setUptime(calculateUptime(START_DATE, new Date()));
    };

    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex h-full flex-col px-5 py-4">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 shrink-0 rounded-full bg-[#4ade80]" aria-hidden="true" />
        <p className="text-label text-[12px] text-[var(--os-text-muted)]">
          aditya.os has been running since first commit
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {(
          [
            { value: uptime.years, label: "years" },
            { value: uptime.months, label: "months" },
            { value: uptime.days, label: "days" },
          ] as const
        ).map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] px-3 py-3 text-center"
          >
            <p
              className="text-[22px] font-semibold leading-none text-[var(--os-text)]"
              style={monoStyle}
            >
              {stat.value}
            </p>
            <p className="text-label mt-1.5 text-[10px] uppercase tracking-[0.08em] text-[var(--os-text-muted)]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="my-4 h-px bg-[var(--os-border)]" />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-label text-[12px] text-[var(--os-text-muted)]">First boot</span>
          <span className="text-ui text-[12px] text-[var(--os-text)]">May 2024</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-label text-[12px] text-[var(--os-text-muted)]">Status</span>
          <span className="text-ui inline-flex items-center gap-1.5 text-[12px] text-[var(--os-text)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" aria-hidden="true" />
            still building
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-label text-[12px] text-[var(--os-text-muted)]">Crashes</span>
          <span className="text-ui text-[12px] text-[var(--os-text)]">0 (so far)</span>
        </div>
      </div>
    </div>
  );
}
