//chrome.runtime.onInstalled.addListener(function() {

 // });

  chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({url: 'popup.html'})
    return true;
  })