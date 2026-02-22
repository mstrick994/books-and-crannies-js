// DOM Helpers - Utility functions for interacting with the DOM

export const getElementById = (elementId: string): HTMLElement | null => {
  return document.getElementById(elementId);
};

export const querySelector = (
  cssSelector: string,
  rootElement: Element | Document = document,
): Element | null => {
  return rootElement.querySelector(cssSelector);
};

export const querySelectorAll = (
  cssSelector: string,
  rootElement: Element | Document = document,
): Element[] => {
  return Array.from(rootElement.querySelectorAll(cssSelector));
};
