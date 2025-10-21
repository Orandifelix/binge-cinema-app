// Performance monitoring and optimization utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Measure component render time
  measureRender(componentName: string, renderFn: () => void): void {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    const duration = end - start;

    this.metrics.set(`${componentName}_render`, duration);

    if (duration > 16) {
      console.warn(`Slow render detected in ${componentName}: ${duration.toFixed(2)}ms`);
    }
  }

  // Measure API call performance (generic)
  measureApiCall<T>(endpoint: string, apiCall: () => Promise<T>): Promise<T> {
    const start = performance.now();
    return apiCall().then((result) => {
      const end = performance.now();
      const duration = end - start;

      this.metrics.set(`${endpoint}_api`, duration);

      if (duration > 1000) {
        console.warn(`Slow API call detected for ${endpoint}: ${duration.toFixed(2)}ms`);
      }

      return result;
    });
  }

  // Get performance metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Debounce utility for search and input handling
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility for scroll and resize events
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Image preloading utility
export class ImagePreloader {
  private static cache = new Set<string>();

  static async preloadImage(src: string): Promise<void> {
    if (this.cache.has(src)) return;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.cache.add(src);
        resolve();
      };
      img.onerror = (error) => reject(error);
      img.src = src;
    });
  }

  static preloadImages(srcs: string[]): Promise<void[]> {
    return Promise.all(srcs.map((src) => this.preloadImage(src)));
  }
}

// Memory usage monitoring
export function getMemoryUsage(): {
  used: number;
  total: number;
  percentage: number;
} {
  const performanceWithMemory = performance as Performance & {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  };

  if (performanceWithMemory.memory) {
    const memory = performanceWithMemory.memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576),
      total: Math.round(memory.totalJSHeapSize / 1048576),
      percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100),
    };
  }

  return { used: 0, total: 0, percentage: 0 };
}

// Bundle size monitoring
export function logBundleSize(): void {
  if (import.meta.env.DEV) {
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach((script) => {
      const src = script.getAttribute('src');
      if (src) {
        fetch(src, { method: 'HEAD' })
          .then((response) => {
            const size = response.headers.get('content-length');
            if (size) {
              console.log(`Bundle ${src}: ${Math.round(parseInt(size, 10) / 1024)}KB`);
            }
          })
          .catch(() => {});
      }
    });
  }
}

// Performance observer for Core Web Vitals
export function observeWebVitals(): void {
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceEventTiming[];
      entries.forEach((entry) => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceEntry[];
      entries.forEach((entry) => {
        const layoutShiftEntry = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
        if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
          clsValue += layoutShiftEntry.value;
        }
      });
      console.log('CLS:', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }
}

// Initialize performance monitoring
export function initPerformanceMonitoring(): void {
  if (import.meta.env.DEV) {
    observeWebVitals();
    logBundleSize();

    // Log memory usage every 30 seconds in development
    setInterval(() => {
      const memory = getMemoryUsage();
      if (memory.percentage > 80) {
        console.warn('High memory usage detected:', memory);
      }
    }, 30000);
  }
}
