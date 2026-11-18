/**
 * AFTERLIGHT — Safe DOM Manipulation Helpers
 */

/**
 * Safely query an element with type check.
 * @param {string} selector
 * @param {ParentNode} [parent=document]
 * @returns {HTMLElement|null}
 */
export function query(selector, parent = document) {
  try {
    return parent.querySelector(selector);
  } catch {
    return null;
  }
}

/**
 * Safely query all matching elements.
 * @param {string} selector
 * @param {ParentNode} [parent=document]
 * @returns {HTMLElement[]}
 */
export function queryAll(selector, parent = document) {
  try {
    return Array.from(parent.querySelectorAll(selector));
  } catch {
    return [];
  }
}

/**
 * Adds an event listener and returns an unbind function for clean teardown.
 * @param {EventTarget} target
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} handler
 * @param {boolean|AddEventListenerOptions} [options]
 * @returns {() => void} Teardown callback
 */
export function addListener(target, event, handler, options) {
  if (!target || typeof target.addEventListener !== 'function') {
    return () => {};
  }
  target.addEventListener(event, handler, options);
  return () => {
    target.removeEventListener(event, handler, options);
  };
}

/**
 * Safely set CSS display style.
 * @param {HTMLElement|null} el
 * @param {string} display
 */
export function setDisplay(el, display) {
  if (el && el.style) {
    el.style.display = display;
  }
}
