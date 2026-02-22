// DOM Helpers - Utility functions for interacting with the DOM
export const getElementById = (elementId) => {
    return document.getElementById(elementId);
};
export const querySelector = (cssSelector, rootElement = document) => {
    return rootElement.querySelector(cssSelector);
};
export const querySelectorAll = (cssSelector, rootElement = document) => {
    return Array.from(rootElement.querySelectorAll(cssSelector));
};
