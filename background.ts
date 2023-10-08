import Browser from 'webextension-polyfill'

Browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({ url: 'https://twitter.com/axios/status/1709896541891108969' });
    }
});
