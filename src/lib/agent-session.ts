export type AgentSessionSnapshot = {
  hasStartedChat: boolean;
  hasDraft: boolean;
};

let snapshot: AgentSessionSnapshot = {
  hasStartedChat: false,
  hasDraft: false,
};

const listeners = new Set<() => void>();

export function getAgentSessionSnapshot(): AgentSessionSnapshot {
  return snapshot;
}

export function subscribeAgentSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function publishAgentSession(update: Partial<AgentSessionSnapshot>): void {
  snapshot = { ...snapshot, ...update };
  listeners.forEach((listener) => listener());
}
