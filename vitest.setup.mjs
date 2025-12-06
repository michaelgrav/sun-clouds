import '@testing-library/jest-dom/vitest';

import { vi } from 'vitest';

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);
window.HTMLElement.prototype.scrollIntoView = () => {};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

// Provide layout metrics so chart components that rely on measurements render without warnings in tests.
Object.defineProperty(window.HTMLElement.prototype, 'offsetHeight', {
  configurable: true,
  value: 600,
});

Object.defineProperty(window.HTMLElement.prototype, 'offsetWidth', {
  configurable: true,
  value: 800,
});

Object.defineProperty(window.HTMLElement.prototype, 'clientHeight', {
  configurable: true,
  value: 600,
});

Object.defineProperty(window.HTMLElement.prototype, 'clientWidth', {
  configurable: true,
  value: 800,
});

window.HTMLElement.prototype.getBoundingClientRect = () => ({
  width: 800,
  height: 600,
  top: 0,
  left: 0,
  right: 800,
  bottom: 600,
});
