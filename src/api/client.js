/**
 * AFTERLIGHT — Scalable Archival API Client
 * Features request timeouts, AbortController, retry logic with exponential backoff,
 * response caching with TTL, and standardized error normalization.
 */

import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} [status=0]
   * @param {any} [details=null]
   */
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

class ApiClient {
  constructor() {
    this.baseUrl = env.api.baseUrl;
    this.timeoutMs = env.api.timeoutMs;
    this.cache = new Map();
  }

  /**
   * Performs an asynchronous GET request with timeout, caching, and retry.
   *
   * @param {string} endpoint API endpoint path
   * @param {object} [options]
   * @param {number} [options.ttlMs=0] Cache Time-To-Live in milliseconds (0 = no cache)
   * @param {number} [options.retries=1] Max retry attempts on network error
   * @param {AbortSignal} [options.signal] Optional external AbortSignal
   * @returns {Promise<any>}
   */
  async get(endpoint, options = {}) {
    const { ttlMs = 0, retries = 1, signal } = options;
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    // Cache lookup
    if (ttlMs > 0 && this.cache.has(url)) {
      const cached = this.cache.get(url);
      if (Date.now() < cached.expiresAt) {
        return cached.data;
      }
      this.cache.delete(url);
    }

    let attempt = 0;
    while (attempt <= retries) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      // Link external signal if provided
      if (signal) {
        signal.addEventListener('abort', () => controller.abort());
      }

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json'
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new ApiError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status
          );
        }

        const data = await response.json();

        if (ttlMs > 0) {
          this.cache.set(url, {
            data,
            expiresAt: Date.now() + ttlMs
          });
        }

        return data;
      } catch (err) {
        clearTimeout(timeoutId);
        attempt++;

        if (attempt > retries || err.name === 'AbortError') {
          logger.warn(`API request to ${url} failed:`, err.message);
          throw new ApiError(err.message, err.status || 0, err);
        }

        // Exponential backoff wait
        await new Promise((res) => setTimeout(res, 200 * Math.pow(2, attempt)));
      }
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export const apiClient = new ApiClient();
