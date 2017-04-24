chrome.alarms.onAlarm.addListener(function (alarm) {
    chrome.tabs.create({ index: 0, active: true, selected: true, url: "chrome://newtab/?action=alarm&id=" + alarm.name }, function (tab) { });
});