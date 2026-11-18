/**
 * AFTERLIGHT — Global Runtime Error Boundary
 * Catches unhandled exceptions, logs structured telemetry, and gracefully alerts without UI freeze.
 */

import { logger } from '../utils/logger.js';

class ErrorBoundary {
  constructor() {
    this.isInitialized = false;
    this.errorBanner = null;
    this.errorLog = [];
  }

  init() {
    if (this.isInitialized) return;

    window.addEventListener('error', (event) => {
      this.handleError(event.error || new Error(event.message), 'UncaughtWindowError');
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason || new Error('Unhandled Promise Rejection'), 'UnhandledRejection');
    });

    this.isInitialized = true;
    logger.info('Runtime Error Boundary armed.');
  }

  handleError(error, context = 'Runtime') {
    const errorDetails = {
      timestamp: new Date().toISOString(),
      context,
      message: error?.message || String(error),
      stack: error?.stack || null
    };

    this.errorLog.push(errorDetails);
    logger.error(`[${context}]`, error);

    // If critical 3D or WebGL crash, render recovery banner if not already shown
    if (context === 'WebGLCrash' || context === 'SceneInitFailure') {
      this.showRecoveryBanner(errorDetails.message);
    }
  }

  showRecoveryBanner(message) {
    if (this.errorBanner) return;

    this.errorBanner = document.createElement('div');
    this.errorBanner.className = 'error-boundary-banner';
    this.errorBanner.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(18, 20, 26, 0.96);
      border: 1px solid rgba(239, 68, 68, 0.4);
      border-radius: 8px;
      padding: 12px 20px;
      color: #f3f4f6;
      font-family: var(--font-mono, monospace);
      font-size: 11px;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
    `;

    this.errorBanner.innerHTML = `
      <span style="color: #ef4444; font-weight: 600;">INSTRUMENT FAULT:</span>
      <span style="color: #9ca3af; max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${message}</span>
      <button id="btn-reload-monument" style="
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.2);
        color: #fff;
        padding: 4px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-family: inherit;
        font-size: 10px;
      ">RECALIBRATE</button>
    `;

    document.body.appendChild(this.errorBanner);

    this.errorBanner.querySelector('#btn-reload-monument')?.addEventListener('click', () => {
      window.location.reload();
    });
  }
}

export const errorBoundary = new ErrorBoundary();
