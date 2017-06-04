chrome.alarms.onAlarm.addListener(function (alarm) {
    chrome.tabs.create({ index: 0, active: true, selected: true, url: "chrome://newtab/?action=alarm&id=" + alarm.name }, function (tab) { });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    //console.log(tabId);
    //console.log(changeInfo);
    //console.log(tab);
    //favIconUrl
    //"complete"
    //integer or array of integer tabIds

    /*Saving Icons*/
    var aIcons = document.createElement('a'); aIcons.href = tab.url; var finalUrlIcons = aIcons.protocol + '//' + aIcons.hostname;
    if (!!changeInfo.favIconUrl && !!finalUrlIcons) {
        chrome.storage.local.get("Icons", function (icons) {
            if (!icons.Icons) { icons = { Icons: {} } }
            if (!!icons.Icons[finalUrlIcons]) { icons.Icons[finalUrlIcons].push(changeInfo.favIconUrl); }
            else { icons.Icons[finalUrlIcons] = []; icons.Icons[finalUrlIcons].push(changeInfo.favIconUrl); }
            var setObjct = {}; setObjct["Icons"] = icons.Icons;
            chrome.storage.local.set(setObjct, function () {/*console.log("Saved");*/ });
        });
    }
    //END Saving Icons

    //Closing Blocked
    if (changeInfo.status == "loading") {
        chrome.storage.local.get("BlockedUrls", function (blockedUrls) {
            if (!!blockedUrls.BlockedUrls) {
                var aBlockedUrlsLoading = document.createElement('a'); aBlockedUrlsLoading.href = tab.url; var finalUrlBlockedUrlsLoading = aBlockedUrlsLoading.protocol + '//' + aBlockedUrlsLoading.hostname;
                if (!!blockedUrls.BlockedUrls[finalUrlBlockedUrlsLoading]) {
                    if (blockedUrls.BlockedUrls[finalUrlBlockedUrlsLoading].Whole == true || blockedUrls.BlockedUrls[finalUrlBlockedUrlsLoading].Whole == "true") {
                        chrome.notifications.create("notificationId", { eventTime: Date.now() + 2, type: "basic", title: "Blocked URL", message: tab.title + " was closed because you marked it as blocked, you can change the settings in the settings page.", iconUrl: "images/icon_256.png" }, function (notificationId) {

                        });
                        chrome.tabs.get(tabId, function (tab) {
                            if (!!tab) {
                                chrome.tabs.remove(tabId, function () {

                                });
                            }
                        });
                    }
                    else {
                        chrome.notifications.create("notificationId", { eventTime: Date.now() + 2, type: "basic", title: "Blocked URL", message: tab.title + " was closed because you marked it as blocked, you can change the settings in the settings page.", iconUrl: "images/icon_256.png" }, function (notificationId) {

                        });
                        chrome.tabs.get(tabId, function (tab) {
                            if (!!tab) {
                                chrome.tabs.remove(tabId, function () {

                                });
                            }
                        });
                    }
                }
            }
        });
    }
    //END Closing Blocked
});