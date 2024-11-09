/// <reference types="chrome-types" />

declare global {
  interface Window {
    tippy: typeof import("tippy.js").default;
    chrome: typeof chrome;
  }
}

export {};
