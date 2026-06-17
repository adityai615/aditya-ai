export type MetricKey = "cpu" | "memory" | "network" | "aiUsage";

export type ActivityMetrics = Record<MetricKey, number>;

export type ProcessStatus = "Running" | "Idle" | "Sleeping" | "Overthinking" | "Thinking";

export type ActivityProcessRow = {
  id: string;
  name: string;
  usage: number;
  status: ProcessStatus;
};

type ProcessDefinition = {
  id: string;
  name: string;
  min: number;
  max: number;
  maxStep: number;
  getStatus: (usage: number) => ProcessStatus;
};

const PROCESS_DEFINITIONS: ProcessDefinition[] = [
  {
    id: "ai-agent",
    name: "AI Agent",
    min: 28,
    max: 76,
    maxStep: 6,
    getStatus: (usage) => (usage > 62 ? "Running" : usage > 42 ? "Idle" : "Sleeping"),
  },
  {
    id: "next-runtime",
    name: "Next.js Runtime",
    min: 18,
    max: 64,
    maxStep: 5,
    getStatus: (usage) => (usage > 55 ? "Running" : "Idle"),
  },
  {
    id: "github-sync",
    name: "GitHub Sync",
    min: 8,
    max: 44,
    maxStep: 6,
    getStatus: (usage) => (usage > 30 ? "Running" : usage > 16 ? "Idle" : "Sleeping"),
  },
  {
    id: "terminal-service",
    name: "Terminal Service",
    min: 4,
    max: 34,
    maxStep: 5,
    getStatus: (usage) => (usage > 20 ? "Running" : "Idle"),
  },
  {
    id: "wallpaper-engine",
    name: "Wallpaper Engine",
    min: 6,
    max: 26,
    maxStep: 4,
    getStatus: (usage) => (usage > 18 ? "Running" : "Sleeping"),
  },
  {
    id: "brain",
    name: "Brain.exe",
    min: 95,
    max: 100,
    maxStep: 2,
    getStatus: () => "Overthinking",
  },
  {
    id: "resume-viewer",
    name: "Resume Viewer",
    min: 6,
    max: 24,
    maxStep: 4,
    getStatus: (usage) => (usage > 16 ? "Running" : "Idle"),
  },
  {
    id: "command-center",
    name: "Command Center",
    min: 10,
    max: 40,
    maxStep: 5,
    getStatus: (usage) => (usage > 26 ? "Running" : "Idle"),
  },
  {
    id: "gemini-runtime",
    name: "Gemini Runtime",
    min: 22,
    max: 66,
    maxStep: 6,
    getStatus: () => "Thinking",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function randomBetween(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

function drift(value: number, min: number, max: number, maxStep: number) {
  const step = (Math.random() * 2 - 1) * maxStep;
  return clamp(Math.round(value + step), min, max);
}

const metricRanges: Record<MetricKey, { min: number; max: number; step: number }> = {
  cpu: { min: 28, max: 72, step: 7 },
  memory: { min: 42, max: 82, step: 5 },
  network: { min: 12, max: 58, step: 8 },
  aiUsage: { min: 34, max: 92, step: 7 },
};

export function createInitialMetrics(): ActivityMetrics {
  return {
    cpu: randomBetween(34, 50),
    memory: randomBetween(56, 72),
    network: randomBetween(20, 38),
    aiUsage: randomBetween(58, 86),
  };
}

export function getNextMetrics(previous: ActivityMetrics): ActivityMetrics {
  return {
    cpu: drift(previous.cpu, metricRanges.cpu.min, metricRanges.cpu.max, metricRanges.cpu.step),
    memory: drift(
      previous.memory,
      metricRanges.memory.min,
      metricRanges.memory.max,
      metricRanges.memory.step,
    ),
    network: drift(
      previous.network,
      metricRanges.network.min,
      metricRanges.network.max,
      metricRanges.network.step,
    ),
    aiUsage: drift(
      previous.aiUsage,
      metricRanges.aiUsage.min,
      metricRanges.aiUsage.max,
      metricRanges.aiUsage.step,
    ),
  };
}

export function createInitialProcesses(): ActivityProcessRow[] {
  return PROCESS_DEFINITIONS.map((definition) => {
    const usage = randomBetween(definition.min, definition.max);
    return {
      id: definition.id,
      name: definition.name,
      usage,
      status: definition.getStatus(usage),
    };
  });
}

export function getNextProcesses(previousRows: ActivityProcessRow[]) {
  const previousById = new Map(previousRows.map((row) => [row.id, row]));

  return PROCESS_DEFINITIONS.map((definition) => {
    const previousUsage = previousById.get(definition.id)?.usage ?? definition.min;
    const usage = drift(previousUsage, definition.min, definition.max, definition.maxStep);

    return {
      id: definition.id,
      name: definition.name,
      usage,
      status: definition.getStatus(usage),
    };
  });
}

export function getSystemHealth(metrics: ActivityMetrics) {
  const averageLoad = (metrics.cpu + metrics.memory + metrics.network + metrics.aiUsage) / 4;

  if (averageLoad < 50) return "Excellent";
  if (averageLoad < 70) return "Good";
  return "Fair";
}

