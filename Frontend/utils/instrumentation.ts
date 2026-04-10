// Lightweight instrumentation helper for local repro and analytics
export function logEvent(name: string, payload?: Record<string, any>) {
  try {
    // Console for local debugging
    // Keep messages concise to avoid flooding logs
    // Example: logEvent('bottomsheet_swipe', { thresholdExceeded: true })
    // In production, hook this to analytics SDK if available
    // eslint-disable-next-line no-console
    console.debug(`[instr] ${name}`, payload ?? {});

    // If an analytics SDK is available globally, call it
    const analytics = (globalThis as any)?.analytics;
    if (analytics && typeof analytics.logEvent === 'function') {
      analytics.logEvent(name, payload ?? {});
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[instr] logEvent failed', err);
  }
}

export default logEvent;
