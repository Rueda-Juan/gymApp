type AnalyticsValue = string | number | boolean | null | undefined | string[];

interface GlobalAnalytics {
  analytics?: {
    logEvent: (name: string, params: Record<string, AnalyticsValue>) => void;
  };
}

export function logEvent(name: string, payload?: Record<string, AnalyticsValue>) {
  try {
    // Console for local debugging
    // Keep messages concise to avoid flooding logs
    // Example: logEvent('bottomsheet_swipe', { thresholdExceeded: true })
    // In production, hook this to analytics SDK if available
     
    console.debug(`[instr] ${name}`, payload ?? {});

    // If an analytics SDK is available globally, call it
    const maybeGlobal = globalThis as unknown;
    if (
      maybeGlobal && 
      typeof maybeGlobal === 'object' && 
      'analytics' in maybeGlobal
    ) {
      const analytics = (maybeGlobal as GlobalAnalytics).analytics;
      if (analytics && typeof analytics.logEvent === 'function') {
        analytics.logEvent(name, payload ?? {});
      }
    }
  } catch (err) {
     
    console.warn('[instr] logEvent failed', err);
  }
}

export default logEvent;
