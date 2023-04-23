const isContentScript = () => Boolean(typeof chrome !== 'undefined' && chrome.extension);

export default isContentScript;
