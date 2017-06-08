appManager.controller('headController', [
    '$rootScope', '$scope', '$stateParams', '$interval'
    , '$timeout', '$log', 'Notification', '$location'
    , '$state', '$sce', '$http', '$filter', '$base64', 'FileSaver'
    , 'Upload', 'youtubeEmbedUtils', 'ngAudio', 'DateTimeFormats'
    , function (
        $rootScope, $scope, $stateParams, $interval
        , $timeout, $log, Notification, $location
        , $state, $sce, $http, $filter, $base64, FileSaver
        , Upload, youtubeEmbedUtils, ngAudio, DateTimeFormats
    ) {
        var stopWelccome = null;
        var stopTimeout = null;
        var stopInterval = null;
        var stopChangeBackgroundTimeout = null;
        var stopChangeBackgroundInterval = null;
        var stopPageLoaderTimeout = null;
        var faileSafe = true;
        var welcomePageTimerWatch = null;
        var isDataLoaded = false;


        $rootScope.timeClock = moment().format(DateTimeFormats.DisplayTime);
        $rootScope.dateTimeClock = moment().format(DateTimeFormats.DisplayDateTime);
        $rootScope.dateClock = moment().format(DateTimeFormats.DisplayDate);
        $rootScope.ampmQuote = moment().format(DateTimeFormats.InputAmPm);
        $rootScope.hourQuote = moment().format(DateTimeFormats.InputHour);
        $interval(function () {
            $rootScope.timeClock = moment().format(DateTimeFormats.DisplayTime);
            $rootScope.dateTimeClock = moment().format(DateTimeFormats.DisplayDateTime);
            $rootScope.dateClock = moment().format(DateTimeFormats.DisplayDate);
            $rootScope.ampmQuote = moment().format(DateTimeFormats.InputAmPm);
            $rootScope.hourQuote = moment().format(DateTimeFormats.InputHour);
        }, 1000);


        $rootScope.RefreshData = function () {
            var failSaveInt = 5;
            $rootScope.Loader.PageLoader.Show();
            stopTimeout = $rootScope.Angular.timeout(function () {
                $rootScope.Angular.interval.cancel(stopInterval);
                $rootScope.Angular.timeout.cancel(stopTimeout);
                $rootScope.Loader.PageLoader.Hide();
            }, 500);
            stopInterval = $rootScope.Angular.interval(function () {
                $rootScope.Links.Get();
                $rootScope.Links.ResetLink();
                $rootScope.Background.Get();
                $rootScope.Background.GetBackgrounds();
                $rootScope.Colors.Get();
                $rootScope.Shipment.Get();
                $rootScope.Youtube.Get();
                $rootScope.Settings.GetVisibility();
                $rootScope.Settings.GetUser();
                $rootScope.Password.Get();
                $rootScope.Notes.Get();
                //$rootScope.History.Search();
                $rootScope.ChromeApps.GetApps();
                $rootScope.DownloadManager.SearchInterval();
                $rootScope.InsertCSS.LoadCss();
                $rootScope.BlockedUrls.Get();
                failSaveInt--;
                if (failSaveInt <= 0) {
                    $rootScope.Angular.interval.cancel(stopInterval);
                    $rootScope.Angular.timeout.cancel(stopTimeout);
                    $rootScope.Loader.PageLoader.Hide();
                }
            }, 100);
        };

        $rootScope.Save = {
            SaveStringToString: function (title, string, chromeKey) {
                if (!$rootScope.Check.IsStringFilled(string)) {
                    $rootScope.Notify.FaildToAdd(title);
                    return null;
                }
                var setObjct = {};
                setObjct[chromeKey] = string;
                chrome.storage.local.set(setObjct, function () {
                    $rootScope.Notify.SucceededToAdd(title);
                    $rootScope.RefreshData();
                });
            }
            , SaveStringToObjectOfObjects: function (title, string, chromeKey) {
                if (!$rootScope.Check.IsStringFilled(string)) {
                    $rootScope.Notify.FaildToAdd(title);
                    return null;
                }
                var setObjct = {};
                var strToId = $rootScope.Utils.ToId(string);
                chrome.storage.local.get(chromeKey, function (keyValue) {
                    if (keyValue[chromeKey] == undefined || keyValue[chromeKey] == null) {
                        var newObj = {
                            Id: strToId
                            , Title: string
                            , Value: string
                        };
                        var parentObject = {};
                        parentObject[strToId] = newObj;
                        setObjct[chromeKey] = parentObject;
                        chrome.storage.local.set(setObjct, function () {
                            $rootScope.Notify.SucceededToAdd(title);
                            $rootScope.RefreshData();
                        });
                    }
                    else {
                        var parentObject = keyValue[chromeKey];
                        //var doesLinkExist = $rootScope.Check.FindStringInArrayOfObjects(array, strToId, "Id");
                        if (parentObject[strToId] == undefined) {
                            var newObj = {
                                Id: strToId
                                , Title: string
                                , Value: string
                            };
                            parentObject[strToId] = newObj;
                            setObjct[chromeKey] = parentObject;
                            chrome.storage.local.set(setObjct, function () {
                                $rootScope.Notify.SucceededToAdd(title);
                                $rootScope.RefreshData();
                            });
                        }
                    }
                });
            }
            , SaveStringToArrayOfObjects: function (title, string, chromeKey) {
                if (!$rootScope.Check.IsStringFilled(string)) {
                    $rootScope.Notify.FaildToAdd(title);
                    return null;
                }
                var setObjct = {};
                var strToId = $rootScope.Utils.ToId(string);
                chrome.storage.local.get(chromeKey, function (keyValue) {
                    if (keyValue[chromeKey] == undefined || keyValue[chromeKey] == null) {
                        var newObj = {
                            Id: strToId
                            , Title: string
                            , Value: string
                        };
                        var parentObject = [];
                        parentObject.push(newObj);
                        setObjct[chromeKey] = parentObject;
                        chrome.storage.local.set(setObjct, function () {
                            $rootScope.Notify.SucceededToAdd(title);
                            $rootScope.RefreshData();
                        });
                    }
                    else {
                        var parentObject = keyValue[chromeKey];
                        var doesLinkExist = $rootScope.Check.FindStringInArrayOfObjects(parentObject, strToId, "Id");
                        if (!angular.isNumber(doesLinkExist)) {
                            var newObj = {
                                Id: strToId
                                , Title: string
                                , Value: string
                            };
                            parentObject.push(newObj);
                            setObjct[chromeKey] = parentObject;
                            chrome.storage.local.set(setObjct, function () {
                                $rootScope.Notify.SucceededToAdd(title);
                                $rootScope.RefreshData();
                            });
                        }
                    }
                });
            }

            , SaveObjectToObjectOfObjects: function (title, object, chromeKey) {
                angular.forEach(object, function (value, key) {
                    if (!$rootScope.Check.IsStringFilled(value)) {
                        $rootScope.Notify.FaildToAdd(title);
                        return null;
                    }
                });

                var setObjct = {};
                var strToId = $rootScope.Utils.ToId(object.Title);
                chrome.storage.local.get(chromeKey, function (keyValue) {
                    if (keyValue[chromeKey] == undefined || keyValue[chromeKey] == null) {
                        object.Id = strToId;
                        var parentObject = {};
                        parentObject[object.Id] = object;
                        setObjct[chromeKey] = parentObject;
                        chrome.storage.local.set(setObjct, function () {
                            $rootScope.Notify.SucceededToAdd(title);
                            $rootScope.RefreshData();
                        });
                    }
                    else {
                        var parentObject = keyValue[chromeKey];
                        if (parentObject[strToId] == undefined) {
                            object.Id = strToId;
                            parentObject[object.Id] = object;
                            setObjct[chromeKey] = parentObject;
                            chrome.storage.local.set(setObjct, function () {
                                $rootScope.Notify.SucceededToAdd(title);
                                $rootScope.RefreshData();
                            });
                        }
                    }
                });
            }
            , SaveObjectToArrayOfObjects: function (title, object, chromeKey) {
                if (!$rootScope.Check.IsObjectFilled(object)) {
                    $rootScope.Notify.FaildToAdd(title);
                    return null;
                }
                var setObjct = {};
                var strToId = $rootScope.Utils.ToId(object.Title);
                chrome.storage.local.get(chromeKey, function (keyValue) {
                    if (keyValue[chromeKey] == undefined || keyValue[chromeKey] == null) {
                        object.Id = strToId;
                        var parentObject = [];
                        parentObject.push(object);
                        setObjct[chromeKey] = parentObject;
                        chrome.storage.local.set(setObjct, function () {
                            $rootScope.Notify.SucceededToAdd(title);
                            $rootScope.Save.EmptyEverything();
                            $rootScope.RefreshData();
                        });
                    }
                    else {
                        var parentObject = keyValue[chromeKey];
                        var doesLinkExist = $rootScope.Check.FindStringInArrayOfObjects(parentObject, strToId, "Id");
                        if (!angular.isNumber(doesLinkExist)) {
                            object.Id = strToId;
                            parentObject.push(object);
                            setObjct[chromeKey] = parentObject;
                            chrome.storage.local.set(setObjct, function () {
                                $rootScope.Notify.SucceededToAdd(title);
                                $rootScope.Save.EmptyEverything();
                                $rootScope.RefreshData();
                            });
                        }
                    }
                });
            }
            , SaveArrayOfObjectsToArrayOfObjects: function (title, arrayOfObjects, chromeKey) {
                angular.forEach(arrayOfObjects, function (object, okey) {
                    angular.forEach(object, function (value, key) {
                        if (!$rootScope.Check.IsStringFilled(value)) {
                            $rootScope.Notify.FaildToAdd(title);
                            return null;
                        }
                    });
                    var strToId = $rootScope.Utils.ToId(object.Title);
                    object.Id = strToId;
                });

                var setObjct = {};
                chrome.storage.local.get(chromeKey, function (keyValue) {
                    if (keyValue[chromeKey] == undefined || keyValue[chromeKey] == null || angular.isArray(keyValue[chromeKey])) {
                        var parentObject = [];
                        angular.forEach(arrayOfObjects, function (object, okey) {
                            parentObject.push(object);
                        });
                        setObjct[chromeKey] = parentObject;
                        chrome.storage.local.set(setObjct, function () {
                            $rootScope.Notify.SucceededToAdd(title);
                            $rootScope.Save.EmptyEverything();
                            $rootScope.RefreshData();
                        });
                    }
                    else {
                        var parentObject = keyValue[chromeKey];

                        angular.forEach(arrayOfObjects, function (object, okey) {
                            var doesLinkExist = $rootScope.Check.FindObjectInArrayOfObjects(parentObject, object, "Id");
                            if (!angular.isNumber(doesLinkExist)) {
                                parentObject.push(object);
                            }
                        });
                        setObjct[chromeKey] = parentObject;
                        chrome.storage.local.set(setObjct, function () {
                            $rootScope.Notify.SucceededToAdd(title);
                            $rootScope.Save.EmptyEverything();
                            $rootScope.RefreshData();
                        });
                    }
                });
            }
            , SaveDynamic: function (title, dynamic, chromeKey, type) {
                if (!type) { type = "success"; }
                var setObjct = {};
                setObjct[chromeKey] = dynamic;
                chrome.storage.local.set(setObjct, function () {
                    if (type == "success") {
                        $rootScope.Notify.SucceededToAdd(title);
                    } else if (type == "success") {
                        $rootScope.Notify.FaildToAdd(title);
                    } else if (type == "update") {
                        $rootScope.Notify.SucceededToUpdate(title);
                    }
                    $rootScope.RefreshData();
                });
            }
            , EmptyEverything: function () {
                $rootScope.Shipment.EmptyShipment();
                $rootScope.BlockedUrls.EmptyBlockedUrls();
            }
        };

        $rootScope.LiveEdit = {
            HTML: null
            , CSS: null
        };

        $rootScope.Loader = {
            PageLoader: {
                IsOpen: true
                , IsVisible: function () {
                    return $rootScope.Loader.PageLoader.IsOpen;
                }
                , Show: function () {
                    $rootScope.Angular.timeout.cancel(stopPageLoaderTimeout);
                    $rootScope.Loader.PageLoader.IsOpen = true;
                    if (faileSafe) {
                        stopPageLoaderTimeout = $rootScope.Angular.timeout(function () {
                            if ($rootScope.Loader.PageLoader.IsOpen) {
                                $rootScope.Notify.Notification(null, "Operation is taking too long, or failed. Faile safe removed the loader.", $rootScope.Notify.NotifyType.Warning, 10000, "left", "top");
                                $rootScope.Notify.Notification(null, "Operation is taking too long, or failed. Faile safe removed the loader.", $rootScope.Notify.NotifyType.Warning, 10000, "center", "top");
                                $rootScope.Notify.Notification(null, "Operation is taking too long, or failed. Faile safe removed the loader.", $rootScope.Notify.NotifyType.Warning, 10000, "right", "top");
                                $rootScope.Notify.Notification(null, "Operation is taking too long, or failed. Faile safe removed the loader.", $rootScope.Notify.NotifyType.Warning, 10000, "left", "bottom");
                                $rootScope.Notify.Notification(null, "Operation is taking too long, or failed. Faile safe removed the loader.", $rootScope.Notify.NotifyType.Warning, 10000, "center", "bottom");
                                $rootScope.Notify.Notification(null, "Operation is taking too long, or failed. Faile safe removed the loader.", $rootScope.Notify.NotifyType.Warning, 10000, "right", "bottom");
                            }
                            $rootScope.Loader.PageLoader.Hide();
                            $rootScope.Angular.timeout.cancel(stopPageLoaderTimeout);
                        }, 6000);
                    }
                }
                , Hide: function () {
                    $rootScope.Angular.timeout.cancel(stopPageLoaderTimeout);
                    $rootScope.Loader.PageLoader.IsOpen = false;
                }
            }
        };

        $rootScope.SafeApply = function (fn) {
            var phase = $rootScope.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof (fn) === 'function')) {
                    fn();
                }
            } else {
                $rootScope.$apply(fn);
            }
        };

        $rootScope.Check = {
            IsObjectFilled: function (value) {
                return (value != undefined && value != null && Object.keys(value).length > 0);
            }
            , IsStringFilled: function (value) {
                return (value != undefined && value != null && value != "" && value != " " && value.toString().toLowerCase() != "null");
            }
            , ArrayContainsObject: function (array, obj) {
                for (var i = 0; i < array.length ; i++) {
                    if (obj.Id == array[i].Id)
                    { return i; }
                }
                return null;
            }
            , ArrayContainsObject: function (array, obj) {
                for (var i = 0; i < array.length ; i++) {
                    if (obj.Id == array[i].Id)
                    { return i; }
                }
                return null;
            }
            , ArrayContainsString: function (array, string, key) {
                for (var i = 0; i < array.length ; i++) {
                    if (string == array[i])
                    { return i; }
                }
                return null;
            }
            , FindStringInArrayOfObjects: function (array, string, key) {
                for (var i = 0; i < array.length ; i++) {
                    if (array[i][key] == string)
                    { return i; }
                }
                return undefined;
            }
            , FindObjectInArrayOfObjects: function (array, object, key, id) {
                if (key) {
                    for (var i = 0; i < array.length ; i++) {
                        if (array[i][key] == object[key])
                        { return i; }
                    }
                }
                else if (id) {
                    for (var i = 0; i < array.length ; i++) {
                        if (array[i].Id == object.Id)
                        { return i; }
                    }
                }
                else {
                    for (var i = 0; i < array.length ; i++) {
                        angular.forEach(array[i], function (v, k) {
                            if (v == object[k])
                            { return i; }
                        });
                    }
                }
                return undefined;
            }
            , FindStringInObject: function (object, string, key) {
                if (object[key] == string) {
                    return true;
                }
                return undefined;
            }
            , IsNumber: function (value) {
                return angular.isNumber(value);
            }
        };

        $rootScope.State = {
            State: $rootScope.state,
            Name: function () {
                return $rootScope.state.name;
            }
        };

        $rootScope.Notify = {
            Notification: function (title, message, type, time, posX, posY) {
                if (time == undefined || time == null || !angular.isNumber(time)) {
                    time = 5000;
                }
                if (!$rootScope.Check.IsStringFilled(title)) {
                    title = "Notification";
                    if ($rootScope.Check.IsStringFilled(type)) {
                        title = type;
                    }
                }
                if ((posX == undefined || posX == null) && (posX != "right" && posX != "left" && posX != "center")) {
                    posX = "right";
                }
                if ((posY == undefined || posY == null) && (posY != "top" && posY != "bottom")) {
                    posY = "top";
                }
                switch (type) {
                    default:
                        {
                            $rootScope.Angular.Notification({
                                title: title, message: message
                                , delay: time, startTop: 20, startRight: 10, verticalSpacing: 20, horizontalSpacing: 20,
                                positionX: posX, positionY: posY, templateUrl: "/templates/ZackryNotification.html"
                            });
                            break;
                        }
                    case $rootScope.Notify.NotifyType.Primary:
                        {
                            $rootScope.Angular.Notification.primary({
                                title: title, message: message
                                , delay: time, startTop: 20, startRight: 10, verticalSpacing: 20, horizontalSpacing: 20,
                                positionX: posX, positionY: posY
                            });
                            break;
                        }
                    case $rootScope.Notify.NotifyType.Info:
                        {
                            $rootScope.Angular.Notification.info({
                                title: title, message: message
                                , delay: time, startTop: 20, startRight: 10, verticalSpacing: 20, horizontalSpacing: 20,
                                positionX: posX, positionY: posY
                            });
                            break;
                        }
                    case $rootScope.Notify.NotifyType.Success:
                        {
                            $rootScope.Angular.Notification.success({
                                title: title, message: message
                                , delay: time, startTop: 20, startRight: 10, verticalSpacing: 20, horizontalSpacing: 20,
                                positionX: posX, positionY: posY
                            });
                            break;
                        }
                    case $rootScope.Notify.NotifyType.Warning:
                        {
                            $rootScope.Angular.Notification.warning({
                                title: title, message: message
                                , delay: time, startTop: 20, startRight: 10, verticalSpacing: 20, horizontalSpacing: 20,
                                positionX: posX, positionY: posY
                            });
                            break;
                        }
                    case $rootScope.Notify.NotifyType.Error:
                        {
                            $rootScope.Angular.Notification.error({
                                title: title, message: message
                                , delay: time, startTop: 20, startRight: 10, verticalSpacing: 20, horizontalSpacing: 20,
                                positionX: 'right', positionY: posY
                            });
                            break;
                        }
                    case $rootScope.Notify.NotifyType.ClearAll:
                        {
                            $rootScope.Angular.Notification.clearAll();
                            break;
                        }
                }
            }
            , NotifyType: {
                Primary: "primary"
                , Info: "info"
                , Success: "success"
                , Warning: "warning"
                , Error: "error"
                , ClearAll: "clearAll"
            }
            , FaildToAdd: function (value) {
                $rootScope.Notify.Notification(null, "Failed to add " + value + ".", $rootScope.Notify.NotifyType.Error);
            }
            , SucceededToAdd: function (value) {
                $rootScope.Notify.Notification(null, "Succeeded to add " + value + ".", $rootScope.Notify.NotifyType.Success);
            }
            , SucceededToUpdate: function (value) {
                $rootScope.Notify.Notification(null, "Succeeded to update " + value + ".", $rootScope.Notify.NotifyType.Warning);
            }
        };

        $rootScope.Utils = {
            CapitalizeFirstLetter: function (value) {
                value = value.toLowerCase().replace(/\b[a-z]/g, function (letter) {
                    return letter.toUpperCase();
                });
                return value;
            }
            , ToId: function (value) {
                if (value) {
                    return value.toLowerCase().replace(/[^0-9a-z]/gi, '')
                }
                return "";
            }
            , ToLower: function (value) {
                if (value) {
                    return value.toLowerCase();
                }
                return "";
            }
            , Eval: function (value) {
                if (value) {
                    return $rootScope.$eval(value)
                }
                return "";
            }
            , SCE: function (value) {
                if (value) {
                    return $sce.trustAsHtml(value);
                }
                return "";
            }
            , ToBool: function (value) {
                if (value) {
                    return (value == true || value.toString().toLowerCase() == "true") ? true : false;
                }
                return false;
            }
            , TodayDate: function () {
                var todayeDate = new Date();
                return todayeDate.getMonth() + 1 + "/" + todayeDate.getDate() + "/" + todayeDate.getYear();
            }
            , ToBase64URL: function (value) {
                if ($rootScope.Check.IsObjectFilled(value) && value.filetype && value.filetype)
                { return 'data:' + value.filetype + ';base64,' + value.base64; }
                return "/images/linkimage.png";
            }
            , GetBase64FromImageUrl: function (url) {
                var img = new Image();
                img.setAttribute('crossOrigin', 'anonymous');
                var base64 = null;
                img.onload = function () {
                    var canvas = document.createElement("canvas");
                    canvas.width = this.width;
                    canvas.height = this.height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(this, 0, 0);
                    var dataURL = canvas.toDataURL("image/png");
                    var url = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
                    return dataURL;
                };
                img.src = url;
            }
            , ParseBool: function (value) {
                return (value && ((typeof value == "boolean" && value == true) || (typeof value == "string" && value.toLowerCase() == "true"))) ? true : false;
            }
            , RandomBase16: function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            , Generate: {
                Guid: function () {
                    return ($rootScope.Utils.RandomBase16() + $rootScope.Utils.RandomBase16() + "-" + $rootScope.Utils.RandomBase16() + "-4" + $rootScope.Utils.RandomBase16().substr(0, 3) + "-" + $rootScope.Utils.RandomBase16() + "-" + $rootScope.Utils.RandomBase16() + $rootScope.Utils.RandomBase16() + $rootScope.Utils.RandomBase16()).toLowerCase();
                }
                , RandomString: function (length, groups, char) {
                    if (!length)
                    { length = 10; }
                    if (!char)
                    { char = "-"; }
                    var text = "";
                    var array = [];
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                    if (groups) {
                        for (var j = 0; j < groups; j++) {
                            text = "";
                            for (var i = 0; i < length; i++) {
                                text += possible.charAt(Math.floor(Math.random() * possible.length));
                            }
                            array.push(text);
                        }
                        text = array.join(char);
                    }
                    else {
                        for (var i = 0; i < length; i++) {
                            text += possible.charAt(Math.floor(Math.random() * possible.length));
                        }
                    }
                    return text;
                }
            }
        };

        $rootScope.Links = {
            Link: {
                Id: null
                , Title: null
                , URL: null
                , Image: {
                    base64: base64DefaultLinkImage
                    , filename: null
                    , filesize: null
                    , filetype: imageTypeDefaultLinkImage
                }
                , Favorite: false
                , Secret: false
                , Count: 0
            }
            , Links: []
            , File: null
            , Regex: /((http)(s)?([:]{1})([\/]{2}))/
            , TestRegex: function (value) {
                var match = $rootScope.Links.Regex.exec(value, "i");
                return match
            }
            , ResetLink: function () {
                $rootScope.Links.Link.Id = null;
                $rootScope.Links.Link.Title = null;
                $rootScope.Links.Link.URL = null;
                $rootScope.Links.Link.Image = {
                    base64: base64DefaultLinkImage
                    , filename: null
                    , filesize: null
                    , filetype: imageTypeDefaultLinkImage
                };
                $rootScope.Links.Link.Favorite = false;
                $rootScope.Links.Link.Count = 0;
            }
            , IsLinkFilled: function () {
                return ($rootScope.Check.IsStringFilled($rootScope.Links.Link.Title)
                && $rootScope.Check.IsStringFilled($rootScope.Links.Link.URL)
                && $rootScope.Check.IsObjectFilled($rootScope.Links.Link.Image));
            }
            , IsLinkEmpty: function () {
                return !$rootScope.Links.IsLinkFilled();
            }
            , Save: function () {
                $rootScope.Loader.PageLoader.Show();
                if ($rootScope.Links.IsLinkEmpty()) {
                    $rootScope.Notify.FaildToAdd("link");
                    $rootScope.Loader.PageLoader.Hide();
                    return false;
                }
                if (!$rootScope.Links.TestRegex($rootScope.Links.Link.URL)) {
                    $rootScope.Notify.Notification(null, "URL has wrong format, it should start with http:// or https://", $rootScope.Notify.NotifyType.Error);
                    $rootScope.Loader.PageLoader.Hide();
                    return false;
                }
                $rootScope.Save.SaveObjectToArrayOfObjects("link", $rootScope.Links.Link, "Links");
            }
            , Get: function () {
                chrome.storage.local.get("Links", function (links) {
                    $rootScope.Links.Links = [];
                    if (links.Links != undefined && links.Links != undefined) {
                        $rootScope.Links.Links = links.Links;
                    }
                });
            }
            , ReturnLinks: function () {
                chrome.storage.local.get("Links", function (links) {
                    $rootScope.Links.Links = [];
                    if (links.Links != undefined && links.Links != undefined) {
                        return links.Links;
                    }
                    return null;
                });
            }
            , RemoveLink: function (link) {
                $rootScope.Remove.RemoveObjectFromArray("link", link, "Links", false, true);
            }
            , TuggleFavorite: function (value) {
                $rootScope.Loader.PageLoader.Show();
                var indexOfObject = $rootScope.Check.FindObjectInArrayOfObjects($rootScope.Links.Links, value, false, true);
                if (angular.isNumber(indexOfObject)) {
                    $rootScope.Links.Links[indexOfObject].Favorite = !$rootScope.Links.Links[indexOfObject].Favorite;
                    $rootScope.Save.SaveDynamic("link", $rootScope.Links.Links, "Links");
                }
            }
            , TuggleSecret: function (value) {
                $rootScope.Loader.PageLoader.Show();
                var indexOfObject = $rootScope.Check.FindObjectInArrayOfObjects($rootScope.Links.Links, value, false, true);
                if (angular.isNumber(indexOfObject)) {
                    $rootScope.Links.Links[indexOfObject].Secret = !$rootScope.Links.Links[indexOfObject].Secret;
                    $rootScope.Save.SaveDynamic("link", $rootScope.Links.Links, "Links");
                }
            }
            , SecretVisibility: false
            , ShowSecret(secret) {
                return ($rootScope.Utils.ToBool(secret) && $rootScope.Links.SecretVisibility) || (!$rootScope.Utils.ToBool(secret) && !$rootScope.Links.SecretVisibility);
            }
            , TuggleSecretVisibility() {
                $rootScope.Links.SecretVisibility = !$rootScope.Links.SecretVisibility;
            }
            , Counter: function (value) {
                $rootScope.Loader.PageLoader.Show();
                var myLinks = angular.copy($rootScope.Links.Links);
                var indexOfObject = $rootScope.Check.FindObjectInArrayOfObjects(myLinks, value, false, true);
                if (angular.isNumber(indexOfObject)) {
                    myLinks[indexOfObject].Count = myLinks[indexOfObject].Count + 1;
                    $rootScope.Save.SaveDynamic("link", myLinks, "Links");
                }
            }
            , RemoveLinks: function () {
                $rootScope.Loader.PageLoader.Show();
                chrome.storage.local.remove("Links", function () {
                    $rootScope.Notify.Notification(null, "All links were deleted.", $rootScope.Notify.NotifyType.Warning);
                    $rootScope.RefreshData();
                });
            }
            , DownloadLinks: function () {
                var data = new Blob([JSON.stringify($rootScope.Links.Links)], { type: 'text/plain;charset=utf-8' });
                FileSaver.saveAs(data, 'links.json');
            }
            , UlpoadLinks: function (file) {
                Upload.upload({
                    url: '/upload',
                    data: { file: file }
                }).then(function (resp) {
                }, function (resp) {
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                });
            }
            , Callback: function (file) {
                $rootScope.Loader.PageLoader.Show();
                var backedupLinks = JSON.parse(file.content);
                var linksArray = angular.copy($rootScope.Links.Links);
                var linksCount = linksArray.length;
                angular.forEach(backedupLinks, function (value, key) {
                    var indexOfObject = $rootScope.Check.FindObjectInArrayOfObjects(linksArray, value, false, true);
                    if (!angular.isNumber(indexOfObject)) {
                        if ($rootScope.Check.IsStringFilled(value.Id)
                            && $rootScope.Check.IsStringFilled(value.Title)
                            && $rootScope.Check.IsStringFilled(value.URL)
                            && (value.Image)
                            && $rootScope.Check.IsStringFilled(value.Image.base64)
                            ) {
                            var object = {
                                Id: value.Id
                                , Title: value.Title
                                , URL: value.URL
                                , Image: {
                                    base64: value.Image.base64
                                    , filename: value.Image.filename
                                    , filesize: value.Image.filesize
                                    , filetype: value.Image.filetype
                                }
                                , Favorite: value.Favorite
                                , Count: value.Count
                            };
                            linksArray.push(object);
                        }
                    }
                });
                if (linksArray.length > linksCount) {
                    $rootScope.Save.SaveDynamic("links", linksArray, "Links");
                    $rootScope.RefreshData();
                }
                else {
                    $rootScope.Loader.PageLoader.Hide();
                    $rootScope.Notify.Notification(null, "No links added.", $rootScope.Notify.NotifyType.Error);
                }
                $rootScope.Links.File = null;
                $('ng-file-input [type="file"]').val(null);
            }
        };

        $rootScope.Slice = {
            SliceArray: function (array, object, key, id) {
                var indexOfObject = $rootScope.Check.FindObjectInArrayOfObjects(array, object, key, id);
                if (angular.isNumber(indexOfObject)) {
                    array.splice(indexOfObject, 1);
                }
                return array;
            }
            , SliceArrayByString: function (array, string, key) {
                var indexOfObject = $rootScope.Check.FindStringInArrayOfObjects(array, string, key);
                if (angular.isNumber(indexOfObject)) {
                    array.splice(indexOfObject, 1);
                }
                return array;
            }
        };

        $rootScope.Remove = {
            RemoveAll: function (title, chromeKey) {
                $rootScope.Loader.PageLoader.Show();
                chrome.storage.local.remove(chromeKey, function () {
                    $rootScope.Notify.Notification(null, "All " + title + " were deleted.", $rootScope.Notify.NotifyType.Warning);
                    $rootScope.RefreshData();
                });
            }
            , RemoveObjectFromArray: function (title, object, chromeKey, key, id) {
                $rootScope.Loader.PageLoader.Show();
                chrome.storage.local.get(chromeKey, function (keyValue) {
                    var parentObject = [];
                    if (keyValue[chromeKey] != undefined && keyValue[chromeKey] != null) {
                        parentObject = keyValue[chromeKey];
                        parentObject = $rootScope.Slice.SliceArray(parentObject, object, key, id);
                        $rootScope.Save.SaveDynamic(title, parentObject, chromeKey);
                    }
                });
            }
            , RemoveObjectFromArrayByString: function (title, string, chromeKey, key, id) {
                $rootScope.Loader.PageLoader.Show();
                chrome.storage.local.get(chromeKey, function (keyValue) {
                    var parentObject = [];
                    if (keyValue[chromeKey] != undefined && keyValue[chromeKey] != null) {
                        parentObject = keyValue[chromeKey];
                        parentObject = $rootScope.Slice.SliceArray(parentObject, object, key, id);
                        $rootScope.Save.SaveDynamic(title, parentObject, chromeKey);
                    }
                });
            }
        };

        $rootScope.BrowsingData = {
            Type: {
                Appcache: "appcache", Cache: "cache", Cookies: "cookies", Downloads: "downloads", FileSystems: "fileSystems", FormData: "formData", History: "history", IndexedDB: "indexedDB", LocalStorage: "localStorage", PluginData: "pluginData", Passwords: "passwords", WebSQL: "webSQL"
            }
            , GetSeconds: {
                FiveMinutes: 1000 * 60 * 5, HalfAnHour: 1000 * 60 * 30, OneHour: 1000 * 60 * 60, TwoHours: 1000 * 60 * 60 * 2, SixHours: 1000 * 60 * 60 * 6, TwelveHours: 1000 * 60 * 60 * 12, OneDay: 1000 * 60 * 60 * 24, TwoDays: 1000 * 60 * 60 * 24 * 2, ThreeDays: 1000 * 60 * 60 * 24 * 3, OneWeek: 1000 * 60 * 60 * 24 * 7, TwoWeek: 1000 * 60 * 60 * 24 * 7 * 2, OneMonth: 1000 * 60 * 60 * 24 * 30, TwoMonth: 1000 * 60 * 60 * 24 * 30 * 2, ThreeMonth: 1000 * 60 * 60 * 24 * 30 * 3, SixMonth: 1000 * 60 * 60 * 24 * 30 * 6, OneYear: 1000 * 60 * 60 * 24 * 30 * 12, Everything: 0
            }
            , TimeSelect: [
                { Title: "5 Minutes", Value: 300000 }, { Title: "30 Minutes", Value: 1800000 }, { Title: "1 Hour", Value: 3600000 }, { Title: "2 Hours", Value: 7200000 }, { Title: "6 Hours", Value: 21600000 }, { Title: "12 Hours", Value: 43200000 }, { Title: "1 Day", Value: 86400000 }, { Title: "2 Days", Value: 172800000 }, { Title: "3 Days", Value: 259200000 }, { Title: "1 Week", Value: 604800000 }, { Title: "2 Week", Value: 1209600000 }, { Title: "1 Month", Value: 2592000000 }, { Title: "2 Month", Value: 5184000000 }, { Title: "3 Month", Value: 7776000000 }, { Title: "6 Month", Value: 15552000000 }, { Title: "1 Year", Value: 31104000000 }, { Title: "Everything", Value: 0 }
            ]
            , TimeSelected: null
            , GetTime: function (value) {
                return ((new Date()).getTime() - value);
            }
            , ClearAll: function (value, dontReload) {
                $rootScope.Loader.PageLoader.Show();
                var sinceTime = 0
                if (value == null) {
                    $rootScope.Loader.PageLoader.Hide();
                    return false;
                }
                else if (value != 0) {
                    sinceTime = $rootScope.BrowsingData.GetTime(value);
                }
                chrome.browsingData.remove({
                    "since": sinceTime
                }, {
                    "appcache": true, "cache": true, "cookies": true, "downloads": true, "fileSystems": true, "formData": true, "history": true, "indexedDB": true, "localStorage": true, "pluginData": true, "passwords": true, "webSQL": true
                }, function () {
                    $rootScope.Loader.PageLoader.Hide();
                    if (dontReload == false) { chrome.tabs.reload(); }
                });
            }
            , ClearAppcache: function (value, dontReload) {
                $rootScope.Loader.PageLoader.Show();
                var sinceTime = 0;
                if (value == null) {
                    $rootScope.Notify.Notification(null, "Failed to clear.", $rootScope.Notify.NotifyType.Error);
                    $rootScope.Loader.PageLoader.Hide();
                    return false;
                }
                else if (value != 0) {
                    sinceTime = $rootScope.BrowsingData.GetTime(value);
                }
                chrome.browsingData.removeAppcache({
                    "since": sinceTime
                }, function () {
                    $rootScope.Notify.Notification(null, "App cache cleared.", $rootScope.Notify.NotifyType.Info);
                    $rootScope.Loader.PageLoader.Hide();
                    if (dontReload == false) { chrome.tabs.reload(); }
                });
            }
            , ClearCache: function (value, dontReload) {
                $rootScope.Loader.PageLoader.Show();
                var sinceTime = 0;
                if (value == null) {
                    $rootScope.Notify.Notification(null, "Failed to clear.", $rootScope.Notify.NotifyType.Error);
                    $rootScope.Loader.PageLoader.Hide();
                    return false;
                }
                else if (value != 0) {
                    sinceTime = $rootScope.BrowsingData.GetTime(value);
                }
                chrome.browsingData.removeCache({
                    "since": sinceTime
                }, function () {
                    $rootScope.Notify.Notification(null, "Cache cleared.", $rootScope.Notify.NotifyType.Info);
                    $rootScope.Loader.PageLoader.Hide();
                    if (dontReload == false) { chrome.tabs.reload(); }
                });
            }
            , ClearCookies: function (value, dontReload) {
                $rootScope.Loader.PageLoader.Show();
                var sinceTime = 0;
                if (value == null) {
                    $rootScope.Notify.Notification(null, "Failed to clear.", $rootScope.Notify.NotifyType.Error);
                    $rootScope.Loader.PageLoader.Hide();
                    return false;
                }
                else if (value != 0) {
                    sinceTime = $rootScope.BrowsingData.GetTime(value);
                }
                chrome.browsingData.removeCookies({
                    "since": sinceTime
                }, function () {
                    $rootScope.Notify.Notification(null, "Cookies cleared.", $rootScope.Notify.NotifyType.Info);
                    $rootScope.Loader.PageLoader.Hide();
                    if (dontReload == false) { chrome.tabs.reload(); }
                });
            }
            , ClearDownloads: function (value, dontReload) {
                $rootScope.Loader.PageLoader.Show();
                var sinceTime = 0;
                if (value == null) {
                    $rootScope.Loader.PageLoader.Hide();
                    return false;
                }
                else if (value != 0) {
                    sinceTime = $rootScope.BrowsingData.GetTime(value);
                }
                chrome.browsingData.removeDownloads({
                    "since": sinceTime
                }, function () {
                    $rootScope.Notify.Notification(null, "Downloads cleared.", $rootScope.Notify.NotifyType.Info);
                    $rootScope.Loader.PageLoader.Hide();
                    if (dontReload == false) { chrome.tabs.reload(); }
                });
            }
            , ClearFileSystems: function (value, dontReload) {
                $rootScope.Loader.PageLoader.Show();
                var sinceTime = 0;
                if (value == null) {
                    $rootScope.Notify.Notification(null, "Failed to clear.", $rootScope.Notify.NotifyType.Error);
                    $rootScope.Loader.PageLoader.Hide();
                    return false;
                }
                else if (value != 0) {
                    sinceTime = $rootScope.BrowsingData.GetTime(value);
                }
                chrome.browsingData.removeFileSystems({
                    "since": sinceTime
                }, function () {
                    $rootScope.Notify.Notification(null, "File Systems cleared.", $rootScope.Notify.NotifyType.Info);
                    $rootScope.Loader.PageLoader.Hide();
                    if (dontReload == false) { chrome.tabs.reload(); }
                });
            }
            , ClearFormData: function (value, dontReload) {
                $rootScope.Loader.PageLoader.Show();
                var sinceTime = 0;
                if (value == null) {
                    $rootScope.Notify.Notification(null, "Failed to clear.", $rootScope.Notify.NotifyType.Error);
                    $rootScope.Loader.PageLoader.Hide();
                    return false;
                }
                else if (value != 0) {
                    sinceTime = $rootScope.BrowsingData.GetTime(value);
                }
                chrome.browsingData.removeFormData({
                    "since": sinceTime
                }, function () {
                    $rootScope.Notify.Notification(null, "Form Data cleared.", $rootScope.Notify.NotifyType.Info);
                    $rootScope.Loader.PageLoader.Hide();
                    if (dontReload == false) { chrome.tabs.reload(); }
                });
            }
            , ClearHistory: function (value, dontReload) {
                $rootScope.Loader.PageLoader.Show();
                var sinceTime = 0;
                if (value == null) {
                    $rootScope.Notify.Notification(null, "Failed to clear.", $rootScope.Notify.NotifyType.Error);
                    $rootScope.Loader.PageLoader.Hide();
                    return false;
                }
                else if (value != 0) {
                    sinceTime = $rootScope.BrowsingData.GetTime(value);
                }
                chrome.browsingData.removeHistory({
                    "since": sinceTime
                }, function () {
                    $rootScope.Notify.Notification(null, "History cleared.", $rootScope.Notify.NotifyType.Info);
                    $rootScope.Loader.PageLoader.Hide();
                    if (dontReload == false) { chrome.tabs.reload(); }
                });
            }
            , ClearIndexedDB: function (value, dontReload) {
                $rootScope.Loader.PageLoader.Show();
                var sinceTime = 0;
                if (value == null) {
                    $rootScope.Notify.Notification(null, "Failed to clear.", $rootScope.Notify.NotifyType.Error);
                    $rootScope.Loader.PageLoader.Hide();
                    return false;
                }
                else if (value != 0) {
                    sinceTime = $rootScope.BrowsingData.GetTime(value);
                }
                chrome.browsingData.removeIndexedDB({
                    "since": sinceTime
                }, function () {
                    $rootScope.Notify.Notification(null, "Indexed DB cleared.", $rootScope.Notify.NotifyType.Info);
                    $rootScope.Loader.PageLoader.Hide();
                    if (dontReload == false) { chrome.tabs.reload(); }
                });
            }
            , ClearLocalStorage: function (value, dontReload) {
                $rootScope.Loader.PageLoader.Show();
                var sinceTime = 0;
                if (value == null) {
                    $rootScope.Notify.Notification(null, "Failed to clear.", $rootScope.Notify.NotifyType.Error);
                    $rootScope.Loader.PageLoader.Hide();
                    return false;
                }
                else if (value != 0) {
                    sinceTime = $rootScope.BrowsingData.GetTime(value);
                }
                chrome.browsingData.removeLocalStorage({
                    "since": sinceTime
                }, function () {
                    $rootScope.Notify.Notification(null, "Local Storage cleared.", $rootScope.Notify.NotifyType.Info);
                    $rootScope.Loader.PageLoader.Hide();
                    if (dontReload == false) { chrome.tabs.reload(); }
                });
            }
            , ClearPluginData: function (value, dontReload) {
                $rootScope.Loader.PageLoader.Show();
                var sinceTime = 0;
                if (value == null) {
                    $rootScope.Notify.Notification(null, "Failed to clear.", $rootScope.Notify.NotifyType.Error);
                    $rootScope.Loader.PageLoader.Hide();
                    return false;
                }
                else if (value != 0) {
                    sinceTime = $rootScope.BrowsingData.GetTime(value);
                }
                chrome.browsingData.removePluginData({
                    "since": sinceTime
                }, function () {
                    $rootScope.Notify.Notification(null, "Plugin Data cleared.", $rootScope.Notify.NotifyType.Info);
                    $rootScope.Loader.PageLoader.Hide();
                    if (dontReload == false) { chrome.tabs.reload(); }
                });
            }
            , ClearPasswords: function (value, dontReload) {
                $rootScope.Loader.PageLoader.Show();
                var sinceTime = 0;
                if (value == null) {
                    $rootScope.Notify.Notification(null, "Failed to clear.", $rootScope.Notify.NotifyType.Error);
                    $rootScope.Loader.PageLoader.Hide();
                    return false;
                }
                else if (value != 0) {
                    sinceTime = $rootScope.BrowsingData.GetTime(value);
                }
                chrome.browsingData.removePasswords({
                    "since": sinceTime
                }, function () {
                    $rootScope.Notify.Notification(null, "Passwords cleared.", $rootScope.Notify.NotifyType.Info);
                    $rootScope.Loader.PageLoader.Hide();
                    if (dontReload == false) { chrome.tabs.reload(); }
                });
            }
            , ClearWebSQL: function (value, dontReload) {
                $rootScope.Loader.PageLoader.Show();
                var sinceTime = 0;
                if (value == null) {
                    $rootScope.Notify.Notification(null, "Failed to clear.", $rootScope.Notify.NotifyType.Error);
                    $rootScope.Loader.PageLoader.Hide();
                    return false;
                }
                else if (value != 0) {
                    sinceTime = $rootScope.BrowsingData.GetTime(value);
                }
                chrome.browsingData.removeWebSQL({
                    "since": sinceTime
                }, function () {
                    $rootScope.Notify.Notification(null, "WebSQL cleared.", $rootScope.Notify.NotifyType.Info);
                    $rootScope.Loader.PageLoader.Hide();
                    if (dontReload == false) { chrome.tabs.reload(); }
                });
            }
        };

        $rootScope.Background = {
            BackgroundUrl: "/images/bg-fiber.jpg"
            , ConstantBackgrounds: []
            , Backgrounds: []
            , Save: function () {
                $rootScope.Save.SaveStringToString("Background", $rootScope.Background.BackgroundUrl, "BackgroundUrl")
            }
            , Background: []
            , AddBackground: function () {
                if (angular.isArray($rootScope.Background.Background) && $rootScope.Background.Background.length > 0) {
                    var count = $rootScope.Background.Backgrounds.length;
                    angular.forEach($rootScope.Background.Background, function (value, key) {
                        var object = {
                            Id: $rootScope.Utils.ToId(value.filename)
                          , Title: value.filename
                          , Size: value.filesize
                          , Type: value.filetype
                          , Description: ""
                          , Image: $rootScope.Utils.ToBase64URL(value)
                        };
                        var indexOfObject = $rootScope.Check.FindObjectInArrayOfObjects($rootScope.Background.Backgrounds, object, false, true);
                        if (!angular.isNumber(indexOfObject)) {
                            $rootScope.Background.Backgrounds.push(object);
                        }
                    });
                    $rootScope.Background.Background = [];
                    if ($rootScope.Background.Backgrounds.length > count) {
                        $rootScope.Save.SaveDynamic("Background image(s)", $rootScope.Background.Backgrounds, "Backgrounds");
                    }
                }
                else {
                    $rootScope.Background.Background = [];
                    $rootScope.Notify.FaildToAdd("background(s)");
                    return false;
                }
            }
            , GetBackgrounds: function () {
                chrome.storage.local.get("Backgrounds", function (backgrounds) {
                    if (backgrounds.Backgrounds != undefined && backgrounds.Backgrounds != null) {
                        $rootScope.Background.Backgrounds = backgrounds.Backgrounds;
                    }
                    else {
                        $rootScope.Background.Backgrounds = [];
                    }
                });
            }
            , ChangeBackground: function (value) {
                if ($rootScope.Check.IsStringFilled(value)) {
                    $rootScope.Background.BackgroundUrl = value;
                }
                $rootScope.Background.Save();
            }
            , onChangeBackground: function (value) {
                stopChangeBackgroundTimeout = $rootScope.Angular.timeout(function () {
                    $rootScope.Background.ReformatBackgroundURL();
                    $rootScope.Background.Save();
                    $rootScope.Angular.interval.cancel(stopChangeBackgroundInterval);
                    $rootScope.Angular.timeout.cancel(stopChangeBackgroundTimeout);
                }, 200);
                stopChangeBackgroundInterval = $rootScope.Angular.interval(function () {
                    $rootScope.Background.ReformatBackgroundURL();
                }, 100);
            }
            , onSubmitBackgroundUrl: function () {
                $rootScope.Background.onChangeBackground();
            }
            , Get: function () {
                chrome.storage.local.get("BackgroundUrl", function (backgroundUrl) {
                    if (backgroundUrl.BackgroundUrl != undefined && backgroundUrl.BackgroundUrl != null) {
                        $rootScope.Background.BackgroundUrl = backgroundUrl.BackgroundUrl;
                    }
                });
            }
            , ReformatBackgroundURL: function () {
                $rootScope.Background.BackgroundUrl = $rootScope.Background.BackgroundUrl.replace(/([\\])/g, "/")
            }
            , RemoveAll: function () {
                $rootScope.Loader.PageLoader.Show();
                chrome.storage.local.remove("Backgrounds", function () {
                    $rootScope.Notify.Notification(null, "All Uploaded Images were deleted.", $rootScope.Notify.NotifyType.Warning);
                    $rootScope.RefreshData();
                });
            }
            , Remove: function (value) {
                var doesExist = $rootScope.Check.FindObjectInArrayOfObjects($rootScope.Background.Backgrounds, value, null, true);
                if (angular.isNumber(doesExist)) {
                    $rootScope.Background.Backgrounds.splice(doesExist, 1);
                    $rootScope.Save.SaveDynamic("Backgrounds", $rootScope.Background.Backgrounds, "Backgrounds", "none");
                    $rootScope.Notify.Notification(null, "Background removed.", $rootScope.Notify.NotifyType.Warning);
                }
            }
        };

        $rootScope.TabUpdateUrl = function (value) {
            chrome.tabs.update({ url: value });
        };

        $rootScope.Shipment = {
            Select: {
                ExpectedDateSelect: [
                    { Title: "I Know Expected Date", Value: "false" }, { Title: "I Don't Know Expected Date", Value: "true" }
                ]
                , YesNo: [
                    { Title: "No", Value: "false" }, { Title: "Yes", Value: "true" }
                ]
            }
            , TempItem: {
                Title: null
                , Number: null
                , URL: null
                , DateExpected: null
                , DaysNumber: null
                , KnowDateExpected: null
                , Shipped: null
                , Recieved: null
                , Picture: {
                    base64: null
                  , filename: null
                  , filesize: null
                  , filetype: null
                }
                , DaysToDeliver: null
            }
            , Item: {
                Title: null
                , Number: null
                , URL: null
                , DateExpected: null
                , Shipped: null
                , Recieved: null
                , Picture: {
                    base64: null
                  , filename: null
                  , filesize: null
                  , filetype: null
                }
                , DaysToDeliver: null
            }
            , ItemToDelete: null
            , Items: []
            , IsShipmentFull: function () {
                return ($rootScope.Check.IsStringFilled($rootScope.Shipment.TempItem.Title)
                    && $rootScope.Check.IsStringFilled($rootScope.Shipment.TempItem.Number)
                    && $rootScope.Check.IsStringFilled($rootScope.Shipment.TempItem.URL)
                    && $rootScope.Check.IsStringFilled($rootScope.Shipment.TempItem.Picture.base64)
                    && $rootScope.Check.IsStringFilled($rootScope.Shipment.TempItem.DaysToDeliver)
                    && (($rootScope.Check.IsStringFilled($rootScope.Shipment.TempItem.DateExpected) && ($rootScope.Shipment.TempItem.KnowDateExpected != null && ($rootScope.Shipment.TempItem.KnowDateExpected.toString().toLowerCase() == "false")))
                    || ($rootScope.Check.IsStringFilled($rootScope.Shipment.TempItem.DaysNumber) && ($rootScope.Shipment.TempItem.KnowDateExpected != null && ($rootScope.Shipment.TempItem.KnowDateExpected.toString().toLowerCase() == "true"))))
                );
            }
            , IsShipmentEmpty: function () {
                return !$rootScope.Shipment.IsShipmentFull();
            }
            , EmptyShipment: function () {
                $rootScope.Shipment.TempItem.Title = null;
                $rootScope.Shipment.TempItem.Number = null;
                $rootScope.Shipment.TempItem.URL = null;
                $rootScope.Shipment.TempItem.DateExpected = null;
                $rootScope.Shipment.TempItem.DaysNumber = null;
                $rootScope.Shipment.TempItem.KnowDateExpected = null;
                $rootScope.Shipment.TempItem.Shipped = null;
                $rootScope.Shipment.TempItem.Recieved = null;
                $rootScope.Shipment.TempItem.Picture = {
                    base64: null
                  , filename: null
                  , filesize: null
                  , filetype: null
                };
                $rootScope.Shipment.TempItem.DaysToDeliver = null;
                $rootScope.Shipment.Item.Title = null;
                $rootScope.Shipment.Item.Number = null;
                $rootScope.Shipment.Item.URL = null;
                $rootScope.Shipment.Item.DateExpected = null;
                $rootScope.Shipment.Item.Shipped = null;
                $rootScope.Shipment.Item.Recieved = null;
                $rootScope.Shipment.Item.Picture = null
                $rootScope.Shipment.Item.DaysToDeliver = null
            }
            , Save: function () {
                $rootScope.Loader.PageLoader.Show();
                if ($rootScope.Shipment.IsShipmentEmpty()) {
                    $rootScope.Notify.Notification(null, "Failed to add shipment item.", $rootScope.Notify.NotifyType.Error);
                    return null;
                }
                $rootScope.Shipment.Item.Title = $rootScope.Shipment.TempItem.Title;
                $rootScope.Shipment.Item.Number = $rootScope.Shipment.TempItem.Number;
                $rootScope.Shipment.Item.URL = $rootScope.Shipment.TempItem.URL;
                $rootScope.Shipment.Item.Shipped = ($rootScope.Shipment.TempItem.Shipped == true || $rootScope.Shipment.TempItem.Shipped.toString().toLowerCase() == "true") ? true : false;
                $rootScope.Shipment.Item.Recieved = ($rootScope.Shipment.TempItem.Recieved == true || $rootScope.Shipment.TempItem.Recieved.toString().toLowerCase() == "true") ? true : false;
                $rootScope.Shipment.Item.Picture = $rootScope.Shipment.TempItem.Picture;
                $rootScope.Shipment.Item.DateExpected = $rootScope.Shipment.TempItem.DateExpected;
                $rootScope.Shipment.Item.DaysToDeliver = $rootScope.Shipment.TempItem.DaysToDeliver;
                $rootScope.Shipment.Item.DaysNumber = parseInt($rootScope.Shipment.TempItem.DaysNumber, 10);
                var date = null;
                if (angular.isNumber($rootScope.Shipment.Item.DaysNumber) && $rootScope.Shipment.TempItem.DateExpected == null) {
                    date = new Date();
                    date.setDate(date.getDate() + $rootScope.Shipment.Item.DaysNumber);
                    date = new Date(date);
                }
                if (angular.isDate($rootScope.Shipment.TempItem.DateExpected)) {
                    date = $rootScope.Shipment.TempItem.DateExpected
                }
                $rootScope.Shipment.Item.DateExpected = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
                $rootScope.Save.SaveObjectToArrayOfObjects("shipment", $rootScope.Shipment.Item, "Shipment");
            }
            , Get: function () {
                chrome.storage.local.get("Shipment", function (shipment) {
                    if (shipment.Shipment != undefined && shipment.Shipment != null) {
                        $rootScope.Shipment.Items = shipment.Shipment;

                        angular.forEach($rootScope.Shipment.Items, function (value, key) {
                            var dateExpected = new Date(value.DateExpected);
                            var today = new Date();
                            var timeDiff = Math.abs(dateExpected.getTime() - today.getTime());
                            var daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
                            if (today > dateExpected && daysLeft > 0) {
                                daysLeft *= -1;
                            }
                            var years = 0;
                            var months = 0;
                            var days = 0;
                            var tempDays = daysLeft;
                            for (var i = tempDays; i >= 0; i--) {
                                if (tempDays > 365) {
                                    years++;
                                    tempDays -= 365;
                                } else if (tempDays > 30) {
                                    months++;
                                    tempDays -= 30;
                                } else if (tempDays > 1) {
                                    days++;
                                    tempDays -= 1;
                                }
                            }
                            value.DaysLeft = {
                                TotalDays: daysLeft
                                , Years: years
                                , Months: months
                                , Days: days
                                , Passed: (daysLeft < 0) ? true : false
                                , Percentage: (daysLeft * 100) / value.DaysToDeliver
                            };
                            value.Shipped = (value.Shipped == true || value.Shipped == "true") ? true : false;
                            value.Recieved = (value.Recieved == true || value.Recieved == "true") ? true : false;
                        });
                    }
                });
            }
            , AddToRemoveItem: function (value) {
                $rootScope.Shipment.ItemToDelete = value.Number;
            }
            , RemoveItem: function () {
                if (!$rootScope.Check.IsStringFilled($rootScope.Shipment.ItemToDelete)) {
                    $rootScope.Notify.Notification(null, "Failed to remove shipment item.", $rootScope.Notify.NotifyType.Warning);
                    return null;
                }
                $rootScope.Loader.PageLoader.Show();
                var array = $rootScope.Slice.SliceArrayByString($rootScope.Shipment.Items, $rootScope.Shipment.ItemToDelete, "Number");
                $rootScope.Save.SaveDynamic("shipment", array, "Shipment");
                angular.element('#deleteitem').modal('hide')
            }
            , RemoveAll: function () {
                $rootScope.Loader.PageLoader.Show();
                chrome.storage.local.remove("Shipment", function () {
                    $rootScope.Notify.Notification(null, "All shipments were deleted.", $rootScope.Notify.NotifyType.Warning);
                    $rootScope.RefreshData();
                });
            }
            , TuggleRecieved: function (value) {
                $rootScope.Loader.PageLoader.Show();
                var indexOfObject = $rootScope.Check.FindObjectInArrayOfObjects($rootScope.Shipment.Items, value, "Number", false);
                if (angular.isNumber(indexOfObject)) {
                    $rootScope.Shipment.Items[indexOfObject].Recieved = !$rootScope.Shipment.Items[indexOfObject].Recieved;
                    $rootScope.Save.SaveDynamic("shipment", $rootScope.Shipment.Items, "Shipment");
                }
            }
            , TuggleShipped: function (value) {
                $rootScope.Loader.PageLoader.Show();
                var indexOfObject = $rootScope.Check.FindObjectInArrayOfObjects($rootScope.Shipment.Items, value, "Number", false);
                if (angular.isNumber(indexOfObject)) {
                    $rootScope.Shipment.Items[indexOfObject].Shipped = !$rootScope.Shipment.Items[indexOfObject].Shipped;
                    $rootScope.Save.SaveDynamic("shipment", $rootScope.Shipment.Items, "Shipment");
                }
            }
            , DoTrack: function (value) {
                YQV5.trackSingle({
                    YQ_ContainerId: "YQContainer",
                    YQ_Height: 600,
                    YQ_Fc: "0",
                    YQ_Lang: "en",
                    YQ_Num: value
                });
            }
        };

        $rootScope.Colors = {
            Backgrounds: [{ Title: "None", Value: "transparent" }, { Title: "Red 50", Value: "red-50" }, { Title: "Red 100", Value: "red-100" }, { Title: "Red 200", Value: "red-200" }, { Title: "Red 300", Value: "red-300" }, { Title: "Red 400", Value: "red-400" }, { Title: "Red 500", Value: "red-500" }, { Title: "Red 600", Value: "red-600" }, { Title: "Red 700", Value: "red-700" }, { Title: "Red 800", Value: "red-800" }, { Title: "Red 900", Value: "red-900" }, { Title: "Red A100", Value: "red-A100" }, { Title: "Red A200", Value: "red-A200" }, { Title: "Red A400", Value: "red-A400" }, { Title: "Red A700", Value: "red-A700" }, { Title: "Pink 50", Value: "pink-50" }, { Title: "Pink 100", Value: "pink-100" }, { Title: "Pink 200", Value: "pink-200" }, { Title: "Pink 300", Value: "pink-300" }, { Title: "Pink 400", Value: "pink-400" }, { Title: "Pink 500", Value: "pink-500" }, { Title: "Pink 600", Value: "pink-600" }, { Title: "Pink 700", Value: "pink-700" }, { Title: "Pink 800", Value: "pink-800" }, { Title: "Pink 900", Value: "pink-900" }, { Title: "Pink A100", Value: "pink-A100" }, { Title: "Pink A200", Value: "pink-A200" }, { Title: "Pink A400", Value: "pink-A400" }, { Title: "Pink A700", Value: "pink-A700" }, { Title: "Purple 50", Value: "purple-50" }, { Title: "Purple 100", Value: "purple-100" }, { Title: "Purple 200", Value: "purple-200" }, { Title: "Purple 300", Value: "purple-300" }, { Title: "Purple 400", Value: "purple-400" }, { Title: "Purple 500", Value: "purple-500" }, { Title: "Purple 600", Value: "purple-600" }, { Title: "Purple 700", Value: "purple-700" }, { Title: "Purple 800", Value: "purple-800" }, { Title: "Purple 900", Value: "purple-900" }, { Title: "Purple A100", Value: "purple-A100" }, { Title: "Purple A200", Value: "purple-A200" }, { Title: "Purple A400", Value: "purple-A400" }, { Title: "Purple A700", Value: "purple-A700" }, { Title: "Deep Purple 50", Value: "deep-purple-50" }, { Title: "Deep Purple 100", Value: "deep-purple-100" }, { Title: "Deep Purple 200", Value: "deep-purple-200" }, { Title: "Deep Purple 300", Value: "deep-purple-300" }, { Title: "Deep Purple 400", Value: "deep-purple-400" }, { Title: "Deep Purple 500", Value: "deep-purple-500" }, { Title: "Deep Purple 600", Value: "deep-purple-600" }, { Title: "Deep Purple 700", Value: "deep-purple-700" }, { Title: "Deep Purple 800", Value: "deep-purple-800" }, { Title: "Deep Purple 900", Value: "deep-purple-900" }, { Title: "Deep Purple A100", Value: "deep-purple-A100" }, { Title: "Deep Purple A200", Value: "deep-purple-A200" }, { Title: "Deep Purple A400", Value: "deep-purple-A400" }, { Title: "Deep purple", Value: "deep-purple" }, { Title: "Deep Purple A700", Value: "deep-purple-A700" }, { Title: "Indigo 50", Value: "indigo-50" }, { Title: "Indigo 100", Value: "indigo-100" }, { Title: "Indigo 200", Value: "indigo-200" }, { Title: "Indigo 300", Value: "indigo-300" }, { Title: "Indigo 400", Value: "indigo-400" }, { Title: "Indigo 500", Value: "indigo-500" }, { Title: "Indigo 600", Value: "indigo-600" }, { Title: "Indigo 700", Value: "indigo-700" }, { Title: "Indigo 800", Value: "indigo-800" }, { Title: "Indigo 900", Value: "indigo-900" }, { Title: "Indigo A100", Value: "indigo-A100" }, { Title: "Indigo A200", Value: "indigo-A200" }, { Title: "Indigo A400", Value: "indigo-A400" }, { Title: "Indigo A700", Value: "indigo-A700" }, { Title: "Blue 50", Value: "blue-50" }, { Title: "Blue 100", Value: "blue-100" }, { Title: "Blue 200", Value: "blue-200" }, { Title: "Blue 300", Value: "blue-300" }, { Title: "Blue 400", Value: "blue-400" }, { Title: "Blue 500", Value: "blue-500" }, { Title: "Blue 600", Value: "blue-600" }, { Title: "Blue 700", Value: "blue-700" }, { Title: "Blue 800", Value: "blue-800" }, { Title: "Blue 900", Value: "blue-900" }, { Title: "Blue A100", Value: "blue-A100" }, { Title: "Blue A200", Value: "blue-A200" }, { Title: "Blue A400", Value: "blue-A400" }, { Title: "Blue A700", Value: "blue-A700" }, { Title: "Blue grey", Value: "blue-grey" }, { Title: "Light Blue 50", Value: "light-blue-50" }, { Title: "Light Blue 100", Value: "light-blue-100" }, { Title: "Light Blue 200", Value: "light-blue-200" }, { Title: "Light Blue 300", Value: "light-blue-300" }, { Title: "Light Blue 400", Value: "light-blue-400" }, { Title: "Light Blue 500", Value: "light-blue-500" }, { Title: "Light Blue 600", Value: "light-blue-600" }, { Title: "Light Blue 700", Value: "light-blue-700" }, { Title: "Light Blue 800", Value: "light-blue-800" }, { Title: "Light Blue 900", Value: "light-blue-900" }, { Title: "Light Blue A100", Value: "light-blue-A100" }, { Title: "Light Blue A200", Value: "light-blue-A200" }, { Title: "Light Blue A400", Value: "light-blue-A400" }, { Title: "Light blue", Value: "light-blue" }, { Title: "Light Blue A700", Value: "light-blue-A700" }, { Title: "Cyan 50", Value: "cyan-50" }, { Title: "Cyan 100", Value: "cyan-100" }, { Title: "Cyan 200", Value: "cyan-200" }, { Title: "Cyan 300", Value: "cyan-300" }, { Title: "Cyan 400", Value: "cyan-400" }, { Title: "Cyan 500", Value: "cyan-500" }, { Title: "Cyan 600", Value: "cyan-600" }, { Title: "Cyan 700", Value: "cyan-700" }, { Title: "Cyan 800", Value: "cyan-800" }, { Title: "Cyan 900", Value: "cyan-900" }, { Title: "Cyan A100", Value: "cyan-A100" }, { Title: "Cyan A200", Value: "cyan-A200" }, { Title: "Cyan A400", Value: "cyan-A400" }, { Title: "Cyan A700", Value: "cyan-A700" }, { Title: "Teal 50", Value: "teal-50" }, { Title: "Teal 100", Value: "teal-100" }, { Title: "Teal 200", Value: "teal-200" }, { Title: "Teal 300", Value: "teal-300" }, { Title: "Teal 400", Value: "teal-400" }, { Title: "Teal 500", Value: "teal-500" }, { Title: "Teal 600", Value: "teal-600" }, { Title: "Teal 700", Value: "teal-700" }, { Title: "Teal 800", Value: "teal-800" }, { Title: "Teal 900", Value: "teal-900" }, { Title: "Teal A100", Value: "teal-A100" }, { Title: "Teal A200", Value: "teal-A200" }, { Title: "Teal A400", Value: "teal-A400" }, { Title: "Teal A700", Value: "teal-A700" }, { Title: "Green 50", Value: "green-50" }, { Title: "Green 100", Value: "green-100" }, { Title: "Green 200", Value: "green-200" }, { Title: "Green 300", Value: "green-300" }, { Title: "Green 400", Value: "green-400" }, { Title: "Green 500", Value: "green-500" }, { Title: "Green 600", Value: "green-600" }, { Title: "Green 700", Value: "green-700" }, { Title: "Green 800", Value: "green-800" }, { Title: "Green 900", Value: "green-900" }, { Title: "Green A100", Value: "green-A100" }, { Title: "Green A200", Value: "green-A200" }, { Title: "Green A400", Value: "green-A400" }, { Title: "Green A700", Value: "green-A700" }, { Title: "Light Green 50", Value: "light-green-50" }, { Title: "Light Green 100", Value: "light-green-100" }, { Title: "Light green", Value: "light-green" }, { Title: "Light Green 200", Value: "light-green-200" }, { Title: "Light Green 300", Value: "light-green-300" }, { Title: "Light Green 400", Value: "light-green-400" }, { Title: "Light Green 500", Value: "light-green-500" }, { Title: "Light Green 600", Value: "light-green-600" }, { Title: "Light Green 700", Value: "light-green-700" }, { Title: "Light Green 800", Value: "light-green-800" }, { Title: "Light Green 900", Value: "light-green-900" }, { Title: "Light Green A100", Value: "light-green-A100" }, { Title: "Light Green A200", Value: "light-green-A200" }, { Title: "Light Green A400", Value: "light-green-A400" }, { Title: "Light Green A700", Value: "light-green-A700" }, { Title: "Lime 50", Value: "lime-50" }, { Title: "Lime 100", Value: "lime-100" }, { Title: "Lime 200", Value: "lime-200" }, { Title: "Lime 300", Value: "lime-300" }, { Title: "Lime 400", Value: "lime-400" }, { Title: "Lime 500", Value: "lime-500" }, { Title: "Lime 600", Value: "lime-600" }, { Title: "Lime 700", Value: "lime-700" }, { Title: "Lime 800", Value: "lime-800" }, { Title: "Lime 900", Value: "lime-900" }, { Title: "Lime A100", Value: "lime-A100" }, { Title: "Lime A200", Value: "lime-A200" }, { Title: "Lime A400", Value: "lime-A400" }, { Title: "Lime A700", Value: "lime-A700" }, { Title: "Yellow 50", Value: "yellow-50" }, { Title: "Yellow 100", Value: "yellow-100" }, { Title: "Yellow 200", Value: "yellow-200" }, { Title: "Yellow 300", Value: "yellow-300" }, { Title: "Yellow 400", Value: "yellow-400" }, { Title: "Yellow 500", Value: "yellow-500" }, { Title: "Yellow 600", Value: "yellow-600" }, { Title: "Yellow 700", Value: "yellow-700" }, { Title: "Yellow 800", Value: "yellow-800" }, { Title: "Yellow 900", Value: "yellow-900" }, { Title: "Yellow A100", Value: "yellow-A100" }, { Title: "Yellow A200", Value: "yellow-A200" }, { Title: "Yellow A400", Value: "yellow-A400" }, { Title: "Yellow A700", Value: "yellow-A700" }, { Title: "Amber 50", Value: "amber-50" }, { Title: "Amber 100", Value: "amber-100" }, { Title: "Amber 200", Value: "amber-200" }, { Title: "Amber 300", Value: "amber-300" }, { Title: "Amber 400", Value: "amber-400" }, { Title: "Amber 500", Value: "amber-500" }, { Title: "Amber 600", Value: "amber-600" }, { Title: "Amber 700", Value: "amber-700" }, { Title: "Amber 800", Value: "amber-800" }, { Title: "Amber 900", Value: "amber-900" }, { Title: "Amber A100", Value: "amber-A100" }, { Title: "Amber A200", Value: "amber-A200" }, { Title: "Amber A400", Value: "amber-A400" }, { Title: "Amber A700", Value: "amber-A700" }, { Title: "Orange 50", Value: "orange-50" }, { Title: "Deep orange", Value: "deep-orange" }, { Title: "Orange 100", Value: "orange-100" }, { Title: "Orange 200", Value: "orange-200" }, { Title: "Orange 300", Value: "orange-300" }, { Title: "Orange 400", Value: "orange-400" }, { Title: "Orange 500", Value: "orange-500" }, { Title: "Orange 600", Value: "orange-600" }, { Title: "Orange 700", Value: "orange-700" }, { Title: "Orange 800", Value: "orange-800" }, { Title: "Orange 900", Value: "orange-900" }, { Title: "Orange A100", Value: "orange-A100" }, { Title: "Orange A200", Value: "orange-A200" }, { Title: "Orange A400", Value: "orange-A400" }, { Title: "Orange A700", Value: "orange-A700" }, { Title: "Deep Orange 50", Value: "deep-orange-50" }, { Title: "Deep Orange 100", Value: "deep-orange-100" }, { Title: "Deep Orange 200", Value: "deep-orange-200" }, { Title: "Deep Orange 300", Value: "deep-orange-300" }, { Title: "Deep Orange 400", Value: "deep-orange-400" }, { Title: "Deep Orange 500", Value: "deep-orange-500" }, { Title: "Deep Orange 600", Value: "deep-orange-600" }, { Title: "Deep Orange 700", Value: "deep-orange-700" }, { Title: "Deep Orange 800", Value: "deep-orange-800" }, { Title: "Deep Orange 900", Value: "deep-orange-900" }, { Title: "Deep Orange A100", Value: "deep-orange-A100" }, { Title: "Deep Orange A200", Value: "deep-orange-A200" }, { Title: "Deep Orange A400", Value: "deep-orange-A400" }, { Title: "Deep Orange A700", Value: "deep-orange-A700" }, { Title: "Brown 50", Value: "brown-50" }, { Title: "Brown 100", Value: "brown-100" }, { Title: "Brown 200", Value: "brown-200" }, { Title: "Brown 300", Value: "brown-300" }, { Title: "Brown 400", Value: "brown-400" }, { Title: "Brown 500", Value: "brown-500" }, { Title: "Brown 600", Value: "brown-600" }, { Title: "Brown 700", Value: "brown-700" }, { Title: "Brown 800", Value: "brown-800" }, { Title: "Brown 900", Value: "brown-900" }, { Title: "Brown A100", Value: "brown-A100" }, { Title: "Brown A200", Value: "brown-A200" }, { Title: "Brown A400", Value: "brown-A400" }, { Title: "Brown A700", Value: "brown-A700" }, { Title: "Grey 50", Value: "grey-50" }, { Title: "Grey 100", Value: "grey-100" }, { Title: "Grey 200", Value: "grey-200" }, { Title: "Grey 300", Value: "grey-300" }, { Title: "Grey 400", Value: "grey-400" }, { Title: "Grey 500", Value: "grey-500" }, { Title: "Grey 600", Value: "grey-600" }, { Title: "Grey 700", Value: "grey-700" }, { Title: "Grey 800", Value: "grey-800" }, { Title: "Grey 900", Value: "grey-900" }, { Title: "Grey A100", Value: "grey-A100" }, { Title: "Grey A200", Value: "grey-A200" }, { Title: "Grey A400", Value: "grey-A400" }, { Title: "Grey A700", Value: "grey-A700" }, { Title: "Blue Grey 50", Value: "blue-grey-50" }, { Title: "Blue Grey 100", Value: "blue-grey-100" }, { Title: "Blue Grey 200", Value: "blue-grey-200" }, { Title: "Blue Grey 300", Value: "blue-grey-300" }, { Title: "Blue Grey 400", Value: "blue-grey-400" }, { Title: "Blue Grey 500", Value: "blue-grey-500" }, { Title: "Blue Grey 600", Value: "blue-grey-600" }, { Title: "Blue Grey 700", Value: "blue-grey-700" }, { Title: "Blue Grey 800", Value: "blue-grey-800" }, { Title: "Blue Grey 900", Value: "blue-grey-900" }, { Title: "Blue Grey A100", Value: "blue-grey-A100" }, { Title: "Blue Grey A200", Value: "blue-grey-A200" }, { Title: "Blue Grey A400", Value: "blue-grey-A400" }, { Title: "Blue Grey A700", Value: "blue-grey-A700" }, { Title: "White", Value: "white" }, { Title: "Black", Value: "black" }]
            , Texts: [{ Title: "Red 50", Value: "text-red-50" }, { Title: "Red 100", Value: "text-red-100" }, { Title: "Red 200", Value: "text-red-200" }, { Title: "Red 300", Value: "text-red-300" }, { Title: "Red 400", Value: "text-red-400" }, { Title: "Red 500", Value: "text-red-500" }, { Title: "Red 600", Value: "text-red-600" }, { Title: "Red 700", Value: "text-red-700" }, { Title: "Red 800", Value: "text-red-800" }, { Title: "Red 900", Value: "text-red-900" }, { Title: "Red A100", Value: "text-red-A100" }, { Title: "Red A200", Value: "text-red-A200" }, { Title: "Red A400", Value: "text-red-A400" }, { Title: "Red A700", Value: "text-red-A700" }, { Title: "Pink 50", Value: "text-pink-50" }, { Title: "Pink 100", Value: "text-pink-100" }, { Title: "Pink 200", Value: "text-pink-200" }, { Title: "Pink 300", Value: "text-pink-300" }, { Title: "Pink 400", Value: "text-pink-400" }, { Title: "Pink 500", Value: "text-pink-500" }, { Title: "Pink 600", Value: "text-pink-600" }, { Title: "Pink 700", Value: "text-pink-700" }, { Title: "Pink 800", Value: "text-pink-800" }, { Title: "Pink 900", Value: "text-pink-900" }, { Title: "Pink A100", Value: "text-pink-A100" }, { Title: "Pink A200", Value: "text-pink-A200" }, { Title: "Pink A400", Value: "text-pink-A400" }, { Title: "Pink A700", Value: "text-pink-A700" }, { Title: "Purple 50", Value: "text-purple-50" }, { Title: "Purple 100", Value: "text-purple-100" }, { Title: "Purple 200", Value: "text-purple-200" }, { Title: "Purple 300", Value: "text-purple-300" }, { Title: "Purple 400", Value: "text-purple-400" }, { Title: "Purple 500", Value: "text-purple-500" }, { Title: "Purple 600", Value: "text-purple-600" }, { Title: "Purple 700", Value: "text-purple-700" }, { Title: "Purple 800", Value: "text-purple-800" }, { Title: "Purple 900", Value: "text-purple-900" }, { Title: "Purple A100", Value: "text-purple-A100" }, { Title: "Purple A200", Value: "text-purple-A200" }, { Title: "Purple A400", Value: "text-purple-A400" }, { Title: "Purple A700", Value: "text-purple-A700" }, { Title: "Deep Purple 50", Value: "text-deep-purple-50" }, { Title: "Deep Purple 100", Value: "text-deep-purple-100" }, { Title: "Deep Purple 200", Value: "text-deep-purple-200" }, { Title: "Deep Purple 300", Value: "text-deep-purple-300" }, { Title: "Deep Purple 400", Value: "text-deep-purple-400" }, { Title: "Deep Purple 500", Value: "text-deep-purple-500" }, { Title: "Deep Purple 600", Value: "text-deep-purple-600" }, { Title: "Deep Purple 700", Value: "text-deep-purple-700" }, { Title: "Deep Purple 800", Value: "text-deep-purple-800" }, { Title: "Deep Purple 900", Value: "text-deep-purple-900" }, { Title: "Deep Purple A100", Value: "text-deep-purple-A100" }, { Title: "Deep purple", Value: "text-deep-purple" }, { Title: "Deep Purple A200", Value: "text-deep-purple-A200" }, { Title: "Deep Purple A400", Value: "text-deep-purple-A400" }, { Title: "Deep Purple A700", Value: "text-deep-purple-A700" }, { Title: "Indigo 50", Value: "text-indigo-50" }, { Title: "Indigo 100", Value: "text-indigo-100" }, { Title: "Indigo 200", Value: "text-indigo-200" }, { Title: "Indigo 300", Value: "text-indigo-300" }, { Title: "Indigo 400", Value: "text-indigo-400" }, { Title: "Indigo 500", Value: "text-indigo-500" }, { Title: "Indigo 600", Value: "text-indigo-600" }, { Title: "Indigo 700", Value: "text-indigo-700" }, { Title: "Indigo 800", Value: "text-indigo-800" }, { Title: "Indigo 900", Value: "text-indigo-900" }, { Title: "Indigo A100", Value: "text-indigo-A100" }, { Title: "Indigo A200", Value: "text-indigo-A200" }, { Title: "Indigo A400", Value: "text-indigo-A400" }, { Title: "Indigo A700", Value: "text-indigo-A700" }, { Title: "Blue 50", Value: "text-blue-50" }, { Title: "Blue 100", Value: "text-blue-100" }, { Title: "Blue 200", Value: "text-blue-200" }, { Title: "Blue 300", Value: "text-blue-300" }, { Title: "Blue 400", Value: "text-blue-400" }, { Title: "Blue 500", Value: "text-blue-500" }, { Title: "Blue 600", Value: "text-blue-600" }, { Title: "Blue 700", Value: "text-blue-700" }, { Title: "Blue 800", Value: "text-blue-800" }, { Title: "Blue 900", Value: "text-blue-900" }, { Title: "Blue A100", Value: "text-blue-A100" }, { Title: "Blue A200", Value: "text-blue-A200" }, { Title: "Blue A400", Value: "text-blue-A400" }, { Title: "Blue A700", Value: "text-blue-A700" }, { Title: "Blue grey", Value: "text-blue-grey" }, { Title: "Light Blue 50", Value: "text-light-blue-50" }, { Title: "Light Blue 100", Value: "text-light-blue-100" }, { Title: "Light Blue 200", Value: "text-light-blue-200" }, { Title: "Light Blue 300", Value: "text-light-blue-300" }, { Title: "Light Blue 400", Value: "text-light-blue-400" }, { Title: "Light Blue 500", Value: "text-light-blue-500" }, { Title: "Light Blue 600", Value: "text-light-blue-600" }, { Title: "Light Blue 700", Value: "text-light-blue-700" }, { Title: "Light Blue 800", Value: "text-light-blue-800" }, { Title: "Light Blue 900", Value: "text-light-blue-900" }, { Title: "Light Blue A100", Value: "text-light-blue-A100" }, { Title: "Light blue", Value: "text-light-blue" }, { Title: "Light Blue A200", Value: "text-light-blue-A200" }, { Title: "Light Blue A400", Value: "text-light-blue-A400" }, { Title: "Light Blue A700", Value: "text-light-blue-A700" }, { Title: "Cyan 50", Value: "text-cyan-50" }, { Title: "Cyan 100", Value: "text-cyan-100" }, { Title: "Cyan 200", Value: "text-cyan-200" }, { Title: "Cyan 300", Value: "text-cyan-300" }, { Title: "Cyan 400", Value: "text-cyan-400" }, { Title: "Cyan 500", Value: "text-cyan-500" }, { Title: "Cyan 600", Value: "text-cyan-600" }, { Title: "Cyan 700", Value: "text-cyan-700" }, { Title: "Cyan 800", Value: "text-cyan-800" }, { Title: "Cyan 900", Value: "text-cyan-900" }, { Title: "Cyan A100", Value: "text-cyan-A100" }, { Title: "Cyan A200", Value: "text-cyan-A200" }, { Title: "Cyan A400", Value: "text-cyan-A400" }, { Title: "Cyan A700", Value: "text-cyan-A700" }, { Title: "Teal 50", Value: "text-teal-50" }, { Title: "Teal 100", Value: "text-teal-100" }, { Title: "Teal 200", Value: "text-teal-200" }, { Title: "Teal 300", Value: "text-teal-300" }, { Title: "Teal 400", Value: "text-teal-400" }, { Title: "Teal 500", Value: "text-teal-500" }, { Title: "Teal 600", Value: "text-teal-600" }, { Title: "Teal 700", Value: "text-teal-700" }, { Title: "Teal 800", Value: "text-teal-800" }, { Title: "Teal 900", Value: "text-teal-900" }, { Title: "Teal A100", Value: "text-teal-A100" }, { Title: "Teal A200", Value: "text-teal-A200" }, { Title: "Teal A400", Value: "text-teal-A400" }, { Title: "Teal A700", Value: "text-teal-A700" }, { Title: "Green 50", Value: "text-green-50" }, { Title: "Green 100", Value: "text-green-100" }, { Title: "Green 200", Value: "text-green-200" }, { Title: "Green 300", Value: "text-green-300" }, { Title: "Green 400", Value: "text-green-400" }, { Title: "Green 500", Value: "text-green-500" }, { Title: "Green 600", Value: "text-green-600" }, { Title: "Green 700", Value: "text-green-700" }, { Title: "Green 800", Value: "text-green-800" }, { Title: "Green 900", Value: "text-green-900" }, { Title: "Green A100", Value: "text-green-A100" }, { Title: "Green A200", Value: "text-green-A200" }, { Title: "Green A400", Value: "text-green-A400" }, { Title: "Green A700", Value: "text-green-A700" }, { Title: "Light Green 50", Value: "text-light-green-50" }, { Title: "Light Green 100", Value: "text-light-green-100" }, { Title: "Light green", Value: "text-light-green" }, { Title: "Light Green 200", Value: "text-light-green-200" }, { Title: "Light Green 300", Value: "text-light-green-300" }, { Title: "Light Green 400", Value: "text-light-green-400" }, { Title: "Light Green 500", Value: "text-light-green-500" }, { Title: "Light Green 600", Value: "text-light-green-600" }, { Title: "Light Green 700", Value: "text-light-green-700" }, { Title: "Light Green 800", Value: "text-light-green-800" }, { Title: "Light Green 900", Value: "text-light-green-900" }, { Title: "Light Green A100", Value: "text-light-green-A100" }, { Title: "Light Green A200", Value: "text-light-green-A200" }, { Title: "Light Green A400", Value: "text-light-green-A400" }, { Title: "Light Green A700", Value: "text-light-green-A700" }, { Title: "Lime 50", Value: "text-lime-50" }, { Title: "Lime 100", Value: "text-lime-100" }, { Title: "Lime 200", Value: "text-lime-200" }, { Title: "Lime 300", Value: "text-lime-300" }, { Title: "Lime 400", Value: "text-lime-400" }, { Title: "Lime 500", Value: "text-lime-500" }, { Title: "Lime 600", Value: "text-lime-600" }, { Title: "Lime 700", Value: "text-lime-700" }, { Title: "Lime 800", Value: "text-lime-800" }, { Title: "Lime 900", Value: "text-lime-900" }, { Title: "Lime A100", Value: "text-lime-A100" }, { Title: "Lime A200", Value: "text-lime-A200" }, { Title: "Lime A400", Value: "text-lime-A400" }, { Title: "Lime A700", Value: "text-lime-A700" }, { Title: "Yellow 50", Value: "text-yellow-50" }, { Title: "Yellow 100", Value: "text-yellow-100" }, { Title: "Yellow 200", Value: "text-yellow-200" }, { Title: "Yellow 300", Value: "text-yellow-300" }, { Title: "Yellow 400", Value: "text-yellow-400" }, { Title: "Yellow 500", Value: "text-yellow-500" }, { Title: "Yellow 600", Value: "text-yellow-600" }, { Title: "Yellow 700", Value: "text-yellow-700" }, { Title: "Yellow 800", Value: "text-yellow-800" }, { Title: "Yellow 900", Value: "text-yellow-900" }, { Title: "Yellow A100", Value: "text-yellow-A100" }, { Title: "Yellow A200", Value: "text-yellow-A200" }, { Title: "Yellow A400", Value: "text-yellow-A400" }, { Title: "Yellow A700", Value: "text-yellow-A700" }, { Title: "Amber 50", Value: "text-amber-50" }, { Title: "Amber 100", Value: "text-amber-100" }, { Title: "Amber 200", Value: "text-amber-200" }, { Title: "Amber 300", Value: "text-amber-300" }, { Title: "Amber 400", Value: "text-amber-400" }, { Title: "Amber 500", Value: "text-amber-500" }, { Title: "Amber 600", Value: "text-amber-600" }, { Title: "Amber 700", Value: "text-amber-700" }, { Title: "Amber 800", Value: "text-amber-800" }, { Title: "Amber 900", Value: "text-amber-900" }, { Title: "Amber A100", Value: "text-amber-A100" }, { Title: "Amber A200", Value: "text-amber-A200" }, { Title: "Amber A400", Value: "text-amber-A400" }, { Title: "Amber A700", Value: "text-amber-A700" }, { Title: "Orange 50", Value: "text-orange-50" }, { Title: "Orange 100", Value: "text-orange-100" }, { Title: "Orange 200", Value: "text-orange-200" }, { Title: "Orange 300", Value: "text-orange-300" }, { Title: "Orange 400", Value: "text-orange-400" }, { Title: "Orange 500", Value: "text-orange-500" }, { Title: "Orange 600", Value: "text-orange-600" }, { Title: "Orange 700", Value: "text-orange-700" }, { Title: "Orange 800", Value: "text-orange-800" }, { Title: "Orange 900", Value: "text-orange-900" }, { Title: "Orange A100", Value: "text-orange-A100" }, { Title: "Orange A200", Value: "text-orange-A200" }, { Title: "Orange A400", Value: "text-orange-A400" }, { Title: "Orange A700", Value: "text-orange-A700" }, { Title: "Deep Orange 50", Value: "text-deep-orange-50" }, { Title: "Deep Orange 100", Value: "text-deep-orange-100" }, { Title: "Deep Orange 200", Value: "text-deep-orange-200" }, { Title: "Deep Orange 300", Value: "text-deep-orange-300" }, { Title: "Deep Orange 400", Value: "text-deep-orange-400" }, { Title: "Deep Orange 500", Value: "text-deep-orange-500" }, { Title: "Deep Orange 600", Value: "text-deep-orange-600" }, { Title: "Deep Orange 700", Value: "text-deep-orange-700" }, { Title: "Deep orange", Value: "text-deep-orange" }, { Title: "Deep Orange 800", Value: "text-deep-orange-800" }, { Title: "Deep Orange 900", Value: "text-deep-orange-900" }, { Title: "Deep Orange A100", Value: "text-deep-orange-A100" }, { Title: "Deep Orange A200", Value: "text-deep-orange-A200" }, { Title: "Deep Orange A400", Value: "text-deep-orange-A400" }, { Title: "Deep Orange A700", Value: "text-deep-orange-A700" }, { Title: "Brown 50", Value: "text-brown-50" }, { Title: "Brown 100", Value: "text-brown-100" }, { Title: "Brown 200", Value: "text-brown-200" }, { Title: "Brown 300", Value: "text-brown-300" }, { Title: "Brown 400", Value: "text-brown-400" }, { Title: "Brown 500", Value: "text-brown-500" }, { Title: "Brown 600", Value: "text-brown-600" }, { Title: "Brown 700", Value: "text-brown-700" }, { Title: "Brown 800", Value: "text-brown-800" }, { Title: "Brown 900", Value: "text-brown-900" }, { Title: "Brown A100", Value: "text-brown-A100" }, { Title: "Brown A200", Value: "text-brown-A200" }, { Title: "Brown A400", Value: "text-brown-A400" }, { Title: "Brown A700", Value: "text-brown-A700" }, { Title: "Grey 50", Value: "text-grey-50" }, { Title: "Grey 100", Value: "text-grey-100" }, { Title: "Grey 200", Value: "text-grey-200" }, { Title: "Grey 300", Value: "text-grey-300" }, { Title: "Grey 400", Value: "text-grey-400" }, { Title: "Grey 500", Value: "text-grey-500" }, { Title: "Grey 600", Value: "text-grey-600" }, { Title: "Grey 700", Value: "text-grey-700" }, { Title: "Grey 800", Value: "text-grey-800" }, { Title: "Grey 900", Value: "text-grey-900" }, { Title: "Grey A100", Value: "text-grey-A100" }, { Title: "Grey A200", Value: "text-grey-A200" }, { Title: "Grey A400", Value: "text-grey-A400" }, { Title: "Grey A700", Value: "text-grey-A700" }, { Title: "Blue Grey 50", Value: "text-blue-grey-50" }, { Title: "Blue Grey 100", Value: "text-blue-grey-100" }, { Title: "Blue Grey 200", Value: "text-blue-grey-200" }, { Title: "Blue Grey 300", Value: "text-blue-grey-300" }, { Title: "Blue Grey 400", Value: "text-blue-grey-400" }, { Title: "Blue Grey 500", Value: "text-blue-grey-500" }, { Title: "Blue Grey 600", Value: "text-blue-grey-600" }, { Title: "Blue Grey 700", Value: "text-blue-grey-700" }, { Title: "Blue Grey 800", Value: "text-blue-grey-800" }, { Title: "Blue Grey 900", Value: "text-blue-grey-900" }, { Title: "Blue Grey A100", Value: "text-blue-grey-A100" }, { Title: "Blue Grey A200", Value: "text-blue-grey-A200" }, { Title: "Blue Grey A400", Value: "text-blue-grey-A400" }, { Title: "Blue Grey A700", Value: "text-blue-grey-A700" }, { Title: "White", Value: "text-white" }, { Title: "Black", Value: "text-black" }]
            , BackgroundsObjects: { Red: [{ Title: "Red 50", Value: "red-50", Color: "#ffebee", Shade: "", Special: false }, { Title: "Red 100", Value: "red-100", Color: "#ffcdd2", Shade: "", Special: false }, { Title: "Red 200", Value: "red-200", Color: "#ef9a9a", Shade: "", Special: false }, { Title: "Red 300", Value: "red-300", Color: "#e57373", Shade: "", Special: false }, { Title: "Red 400", Value: "red-400", Color: "#ef5350", Shade: "", Special: false }, { Title: "Red 500", Value: "red-500", Color: "#f44336", Shade: "", Special: false }, { Title: "Red 600", Value: "red-600", Color: "#e53935", Shade: "", Special: false }, { Title: "Red 700", Value: "red-700", Color: "#d32f2f", Shade: "", Special: false }, { Title: "Red 800", Value: "red-800", Color: "#c62828", Shade: "", Special: false }, { Title: "Red 900", Value: "red-900", Color: "#b71c1c", Shade: "", Special: false }, { Title: "Red A100", Value: "red-A100", Color: "#ff8a80", Shade: "", Special: false }, { Title: "Red A200", Value: "red-A200", Color: "#ff5252", Shade: "", Special: false }, { Title: "Red A400", Value: "red-A400", Color: "#ff1744", Shade: "", Special: false }, { Title: "Red A700", Value: "red-A700", Color: "#d50000", Shade: "", Special: false }], Pink: [{ Title: "Pink 50", Value: "pink-50", Color: "#fce4ec", Shade: "", Special: false }, { Title: "Pink 100", Value: "pink-100", Color: "#f8bbd0", Shade: "", Special: false }, { Title: "Pink 200", Value: "pink-200", Color: "#f48fb1", Shade: "", Special: false }, { Title: "Pink 300", Value: "pink-300", Color: "#f06292", Shade: "", Special: false }, { Title: "Pink 400", Value: "pink-400", Color: "#ec407a", Shade: "", Special: false }, { Title: "Pink 500", Value: "pink-500", Color: "#e91e63", Shade: "", Special: false }, { Title: "Pink 600", Value: "pink-600", Color: "#d81b60", Shade: "", Special: false }, { Title: "Pink 700", Value: "pink-700", Color: "#c2185b", Shade: "", Special: false }, { Title: "Pink 800", Value: "pink-800", Color: "#ad1457", Shade: "", Special: false }, { Title: "Pink 900", Value: "pink-900", Color: "#880e4f", Shade: "", Special: false }, { Title: "Pink A100", Value: "pink-A100", Color: "#ff80ab", Shade: "", Special: false }, { Title: "Pink A200", Value: "pink-A200", Color: "#ff4081", Shade: "", Special: false }, { Title: "Pink A400", Value: "pink-A400", Color: "#f50057", Shade: "", Special: false }, { Title: "Pink A700", Value: "pink-A700", Color: "#c51162", Shade: "", Special: false }], Purple: [{ Title: "Purple 50", Value: "purple-50", Color: "#f3e5f5", Shade: "", Special: false }, { Title: "Purple 100", Value: "purple-100", Color: "#e1bee7", Shade: "", Special: false }, { Title: "Purple 200", Value: "purple-200", Color: "#ce93d8", Shade: "", Special: false }, { Title: "Purple 300", Value: "purple-300", Color: "#ba68c8", Shade: "", Special: false }, { Title: "Purple 400", Value: "purple-400", Color: "#ab47bc", Shade: "", Special: false }, { Title: "Purple 500", Value: "purple-500", Color: "#9c27b0", Shade: "", Special: false }, { Title: "Purple 600", Value: "purple-600", Color: "#8e24aa", Shade: "", Special: false }, { Title: "Purple 700", Value: "purple-700", Color: "#7b1fa2", Shade: "", Special: false }, { Title: "Purple 800", Value: "purple-800", Color: "#6a1b9a", Shade: "", Special: false }, { Title: "Purple 900", Value: "purple-900", Color: "#4a148c", Shade: "", Special: false }, { Title: "Purple A100", Value: "purple-A100", Color: "#ea80fc", Shade: "", Special: false }, { Title: "Purple A200", Value: "purple-A200", Color: "#e040fb", Shade: "", Special: false }, { Title: "Purple A400", Value: "purple-A400", Color: "#d500f9", Shade: "", Special: false }, { Title: "Purple A700", Value: "purple-A700", Color: "#aa00ff", Shade: "", Special: false }], DeepPurple: [{ Title: "Deep Purple 50", Value: "deep-purple-50", Color: "#ede7f6", Shade: "50", Special: false }, { Title: "Deep Purple 100", Value: "deep-purple-100", Color: "#d1c4e9", Shade: "100", Special: false }, { Title: "Deep Purple 200", Value: "deep-purple-200", Color: "#b39ddb", Shade: "200", Special: false }, { Title: "Deep Purple 300", Value: "deep-purple-300", Color: "#9575cd", Shade: "300", Special: false }, { Title: "Deep Purple 400", Value: "deep-purple-400", Color: "#7e57c2", Shade: "400", Special: false }, { Title: "Deep Purple 500", Value: "deep-purple-500", Color: "#673ab7", Shade: "500", Special: false }, { Title: "Deep Purple 600", Value: "deep-purple-600", Color: "#5e35b1", Shade: "600", Special: false }, { Title: "Deep Purple 700", Value: "deep-purple-700", Color: "#512da8", Shade: "700", Special: false }, { Title: "Deep Purple 800", Value: "deep-purple-800", Color: "#4527a0", Shade: "800", Special: false }, { Title: "Deep Purple 900", Value: "deep-purple-900", Color: "#311b92", Shade: "900", Special: false }, { Title: "Deep Purple A100", Value: "deep-purple-A100", Color: "#b388ff", Shade: "A100", Special: true }, { Title: "Deep Purple A200", Value: "deep-purple-A200", Color: "#7c4dff", Shade: "A200", Special: true }, { Title: "Deep Purple A400", Value: "deep-purple-A400", Color: "#651fff", Shade: "A400", Special: true }, { Title: "Deep purple", Value: "deep-purple", Color: "#673ab7", Shade: "", Special: false }, { Title: "Deep Purple A700", Value: "deep-purple-A700", Color: "#6200ea", Shade: "A700", Special: true }], Indigo: [{ Title: "Indigo 50", Value: "indigo-50", Color: "#e8eaf6", Shade: "", Special: false }, { Title: "Indigo 100", Value: "indigo-100", Color: "#c5cae9", Shade: "", Special: false }, { Title: "Indigo 200", Value: "indigo-200", Color: "#9fa8da", Shade: "", Special: false }, { Title: "Indigo 300", Value: "indigo-300", Color: "#7986cb", Shade: "", Special: false }, { Title: "Indigo 400", Value: "indigo-400", Color: "#5c6bc0", Shade: "", Special: false }, { Title: "Indigo 500", Value: "indigo-500", Color: "#3f51b5", Shade: "", Special: false }, { Title: "Indigo 600", Value: "indigo-600", Color: "#3949ab", Shade: "", Special: false }, { Title: "Indigo 700", Value: "indigo-700", Color: "#303f9f", Shade: "", Special: false }, { Title: "Indigo 800", Value: "indigo-800", Color: "#283593", Shade: "", Special: false }, { Title: "Indigo 900", Value: "indigo-900", Color: "#1a237e", Shade: "", Special: false }, { Title: "Indigo A100", Value: "indigo-A100", Color: "#8c9eff", Shade: "", Special: false }, { Title: "Indigo A200", Value: "indigo-A200", Color: "#536dfe", Shade: "", Special: false }, { Title: "Indigo A400", Value: "indigo-A400", Color: "#3d5afe", Shade: "", Special: false }, { Title: "Indigo A700", Value: "indigo-A700", Color: "#304ffe", Shade: "", Special: false }], Blue: [{ Title: "Blue 50", Value: "blue-50", Color: "#e3f2fd", Shade: "", Special: false }, { Title: "Blue 100", Value: "blue-100", Color: "#bbdefb", Shade: "", Special: false }, { Title: "Blue 200", Value: "blue-200", Color: "#90caf9", Shade: "", Special: false }, { Title: "Blue 300", Value: "blue-300", Color: "#64b5f6", Shade: "", Special: false }, { Title: "Blue 400", Value: "blue-400", Color: "#42a5f5", Shade: "", Special: false }, { Title: "Blue 500", Value: "blue-500", Color: "#2196f3", Shade: "", Special: false }, { Title: "Blue 600", Value: "blue-600", Color: "#1e88e5", Shade: "", Special: false }, { Title: "Blue 700", Value: "blue-700", Color: "#1976d2", Shade: "", Special: false }, { Title: "Blue 800", Value: "blue-800", Color: "#1565c0", Shade: "", Special: false }, { Title: "Blue 900", Value: "blue-900", Color: "#0d47a1", Shade: "", Special: false }, { Title: "Blue A100", Value: "blue-A100", Color: "#82b1ff", Shade: "", Special: false }, { Title: "Blue A200", Value: "blue-A200", Color: "#448aff", Shade: "", Special: false }, { Title: "Blue A400", Value: "blue-A400", Color: "#2979ff", Shade: "", Special: false }, { Title: "Blue A700", Value: "blue-A700", Color: "#2962ff", Shade: "", Special: false }, { Title: "Blue grey", Value: "blue-grey", Color: "#607d8b", Shade: "", Special: false }], LightBlue: [{ Title: "Light Blue 50", Value: "light-blue-50", Color: "#e1f5fe", Shade: "50", Special: false }, { Title: "Light Blue 100", Value: "light-blue-100", Color: "#b3e5fc", Shade: "100", Special: false }, { Title: "Light Blue 200", Value: "light-blue-200", Color: "#81d4fa", Shade: "200", Special: false }, { Title: "Light Blue 300", Value: "light-blue-300", Color: "#4fc3f7", Shade: "300", Special: false }, { Title: "Light Blue 400", Value: "light-blue-400", Color: "#29b6f6", Shade: "400", Special: false }, { Title: "Light Blue 500", Value: "light-blue-500", Color: "#03a9f4", Shade: "500", Special: false }, { Title: "Light Blue 600", Value: "light-blue-600", Color: "#039be5", Shade: "600", Special: false }, { Title: "Light Blue 700", Value: "light-blue-700", Color: "#0288d1", Shade: "700", Special: false }, { Title: "Light Blue 800", Value: "light-blue-800", Color: "#0277bd", Shade: "800", Special: false }, { Title: "Light Blue 900", Value: "light-blue-900", Color: "#01579b", Shade: "900", Special: false }, { Title: "Light Blue A100", Value: "light-blue-A100", Color: "#80d8ff", Shade: "A100", Special: true }, { Title: "Light Blue A200", Value: "light-blue-A200", Color: "#40c4ff", Shade: "A200", Special: true }, { Title: "Light Blue A400", Value: "light-blue-A400", Color: "#00b0ff", Shade: "A400", Special: true }, { Title: "Light blue", Value: "light-blue", Color: "#03a9f4", Shade: "", Special: false }, { Title: "Light Blue A700", Value: "light-blue-A700", Color: "#0091ea", Shade: "A700", Special: true }], Cyan: [{ Title: "Cyan 50", Value: "cyan-50", Color: "#e0f7fa", Shade: "", Special: false }, { Title: "Cyan 100", Value: "cyan-100", Color: "#b2ebf2", Shade: "", Special: false }, { Title: "Cyan 200", Value: "cyan-200", Color: "#80deea", Shade: "", Special: false }, { Title: "Cyan 300", Value: "cyan-300", Color: "#4dd0e1", Shade: "", Special: false }, { Title: "Cyan 400", Value: "cyan-400", Color: "#26c6da", Shade: "", Special: false }, { Title: "Cyan 500", Value: "cyan-500", Color: "#00bcd4", Shade: "", Special: false }, { Title: "Cyan 600", Value: "cyan-600", Color: "#00acc1", Shade: "", Special: false }, { Title: "Cyan 700", Value: "cyan-700", Color: "#0097a7", Shade: "", Special: false }, { Title: "Cyan 800", Value: "cyan-800", Color: "#00838f", Shade: "", Special: false }, { Title: "Cyan 900", Value: "cyan-900", Color: "#006064", Shade: "", Special: false }, { Title: "Cyan A100", Value: "cyan-A100", Color: "#84ffff", Shade: "", Special: false }, { Title: "Cyan A200", Value: "cyan-A200", Color: "#18ffff", Shade: "", Special: false }, { Title: "Cyan A400", Value: "cyan-A400", Color: "#00e5ff", Shade: "", Special: false }, { Title: "Cyan A700", Value: "cyan-A700", Color: "#00b8d4", Shade: "", Special: false }], Teal: [{ Title: "Teal 50", Value: "teal-50", Color: "#e0f2f1", Shade: "", Special: false }, { Title: "Teal 100", Value: "teal-100", Color: "#b2dfdb", Shade: "", Special: false }, { Title: "Teal 200", Value: "teal-200", Color: "#80cbc4", Shade: "", Special: false }, { Title: "Teal 300", Value: "teal-300", Color: "#4db6ac", Shade: "", Special: false }, { Title: "Teal 400", Value: "teal-400", Color: "#26a69a", Shade: "", Special: false }, { Title: "Teal 500", Value: "teal-500", Color: "#009688", Shade: "", Special: false }, { Title: "Teal 600", Value: "teal-600", Color: "#00897b", Shade: "", Special: false }, { Title: "Teal 700", Value: "teal-700", Color: "#00796b", Shade: "", Special: false }, { Title: "Teal 800", Value: "teal-800", Color: "#00695c", Shade: "", Special: false }, { Title: "Teal 900", Value: "teal-900", Color: "#004d40", Shade: "", Special: false }, { Title: "Teal A100", Value: "teal-A100", Color: "#a7ffeb", Shade: "", Special: false }, { Title: "Teal A200", Value: "teal-A200", Color: "#64ffda", Shade: "", Special: false }, { Title: "Teal A400", Value: "teal-A400", Color: "#1de9b6", Shade: "", Special: false }, { Title: "Teal A700", Value: "teal-A700", Color: "#00bfa5", Shade: "", Special: false }], Green: [{ Title: "Green 50", Value: "green-50", Color: "#e8f5e9", Shade: "", Special: false }, { Title: "Green 100", Value: "green-100", Color: "#c8e6c9", Shade: "", Special: false }, { Title: "Green 200", Value: "green-200", Color: "#a5d6a7", Shade: "", Special: false }, { Title: "Green 300", Value: "green-300", Color: "#81c784", Shade: "", Special: false }, { Title: "Green 400", Value: "green-400", Color: "#66bb6a", Shade: "", Special: false }, { Title: "Green 500", Value: "green-500", Color: "#4caf50", Shade: "", Special: false }, { Title: "Green 600", Value: "green-600", Color: "#43a047", Shade: "", Special: false }, { Title: "Green 700", Value: "green-700", Color: "#388e3c", Shade: "", Special: false }, { Title: "Green 800", Value: "green-800", Color: "#2e7d32", Shade: "", Special: false }, { Title: "Green 900", Value: "green-900", Color: "#1b5e20", Shade: "", Special: false }, { Title: "Green A100", Value: "green-A100", Color: "#b9f6ca", Shade: "", Special: false }, { Title: "Green A200", Value: "green-A200", Color: "#69f0ae", Shade: "", Special: false }, { Title: "Green A400", Value: "green-A400", Color: "#00e676", Shade: "", Special: false }, { Title: "Green A700", Value: "green-A700", Color: "#00c853", Shade: "", Special: false }], LightGreen: [{ Title: "Light Green 50", Value: "light-green-50", Color: "#f1f8e9", Shade: "50", Special: false }, { Title: "Light Green 100", Value: "light-green-100", Color: "#dcedc8", Shade: "100", Special: false }, { Title: "Light green", Value: "light-green", Color: "#8bc34a", Shade: "", Special: false }, { Title: "Light Green 200", Value: "light-green-200", Color: "#c5e1a5", Shade: "200", Special: false }, { Title: "Light Green 300", Value: "light-green-300", Color: "#aed581", Shade: "300", Special: false }, { Title: "Light Green 400", Value: "light-green-400", Color: "#9ccc65", Shade: "400", Special: false }, { Title: "Light Green 500", Value: "light-green-500", Color: "#8bc34a", Shade: "500", Special: false }, { Title: "Light Green 600", Value: "light-green-600", Color: "#7cb342", Shade: "600", Special: false }, { Title: "Light Green 700", Value: "light-green-700", Color: "#689f38", Shade: "700", Special: false }, { Title: "Light Green 800", Value: "light-green-800", Color: "#558b2f", Shade: "800", Special: false }, { Title: "Light Green 900", Value: "light-green-900", Color: "#33691e", Shade: "900", Special: false }, { Title: "Light Green A100", Value: "light-green-A100", Color: "#ccff90", Shade: "A100", Special: true }, { Title: "Light Green A200", Value: "light-green-A200", Color: "#b2ff59", Shade: "A200", Special: true }, { Title: "Light Green A400", Value: "light-green-A400", Color: "#76ff03", Shade: "A400", Special: true }, { Title: "Light Green A700", Value: "light-green-A700", Color: "#64dd17", Shade: "A700", Special: true }], Lime: [{ Title: "Lime 50", Value: "lime-50", Color: "#f9fbe7", Shade: "", Special: false }, { Title: "Lime 100", Value: "lime-100", Color: "#f0f4c3", Shade: "", Special: false }, { Title: "Lime 200", Value: "lime-200", Color: "#e6ee9c", Shade: "", Special: false }, { Title: "Lime 300", Value: "lime-300", Color: "#dce775", Shade: "", Special: false }, { Title: "Lime 400", Value: "lime-400", Color: "#d4e157", Shade: "", Special: false }, { Title: "Lime 500", Value: "lime-500", Color: "#cddc39", Shade: "", Special: false }, { Title: "Lime 600", Value: "lime-600", Color: "#c0ca33", Shade: "", Special: false }, { Title: "Lime 700", Value: "lime-700", Color: "#afb42b", Shade: "", Special: false }, { Title: "Lime 800", Value: "lime-800", Color: "#9e9d24", Shade: "", Special: false }, { Title: "Lime 900", Value: "lime-900", Color: "#827717", Shade: "", Special: false }, { Title: "Lime A100", Value: "lime-A100", Color: "#f4ff81", Shade: "", Special: false }, { Title: "Lime A200", Value: "lime-A200", Color: "#eeff41", Shade: "", Special: false }, { Title: "Lime A400", Value: "lime-A400", Color: "#c6ff00", Shade: "", Special: false }, { Title: "Lime A700", Value: "lime-A700", Color: "#aeea00", Shade: "", Special: false }], Yellow: [{ Title: "Yellow 50", Value: "yellow-50", Color: "#fffde7", Shade: "", Special: false }, { Title: "Yellow 100", Value: "yellow-100", Color: "#fff9c4", Shade: "", Special: false }, { Title: "Yellow 200", Value: "yellow-200", Color: "#fff59d", Shade: "", Special: false }, { Title: "Yellow 300", Value: "yellow-300", Color: "#fff176", Shade: "", Special: false }, { Title: "Yellow 400", Value: "yellow-400", Color: "#ffee58", Shade: "", Special: false }, { Title: "Yellow 500", Value: "yellow-500", Color: "#ffeb3b", Shade: "", Special: false }, { Title: "Yellow 600", Value: "yellow-600", Color: "#fdd835", Shade: "", Special: false }, { Title: "Yellow 700", Value: "yellow-700", Color: "#fbc02d", Shade: "", Special: false }, { Title: "Yellow 800", Value: "yellow-800", Color: "#f9a825", Shade: "", Special: false }, { Title: "Yellow 900", Value: "yellow-900", Color: "#f57f17", Shade: "", Special: false }, { Title: "Yellow A100", Value: "yellow-A100", Color: "#ffff8d", Shade: "", Special: false }, { Title: "Yellow A200", Value: "yellow-A200", Color: "#ffff00", Shade: "", Special: false }, { Title: "Yellow A400", Value: "yellow-A400", Color: "#ffea00", Shade: "", Special: false }, { Title: "Yellow A700", Value: "yellow-A700", Color: "#ffd600", Shade: "", Special: false }], Amber: [{ Title: "Amber 50", Value: "amber-50", Color: "#fff8e1", Shade: "", Special: false }, { Title: "Amber 100", Value: "amber-100", Color: "#ffecb3", Shade: "", Special: false }, { Title: "Amber 200", Value: "amber-200", Color: "#ffe082", Shade: "", Special: false }, { Title: "Amber 300", Value: "amber-300", Color: "#ffd54f", Shade: "", Special: false }, { Title: "Amber 400", Value: "amber-400", Color: "#ffca28", Shade: "", Special: false }, { Title: "Amber 500", Value: "amber-500", Color: "#ffc107", Shade: "", Special: false }, { Title: "Amber 600", Value: "amber-600", Color: "#ffb300", Shade: "", Special: false }, { Title: "Amber 700", Value: "amber-700", Color: "#ffa000", Shade: "", Special: false }, { Title: "Amber 800", Value: "amber-800", Color: "#ff8f00", Shade: "", Special: false }, { Title: "Amber 900", Value: "amber-900", Color: "#ff6f00", Shade: "", Special: false }, { Title: "Amber A100", Value: "amber-A100", Color: "#ffe57f", Shade: "", Special: false }, { Title: "Amber A200", Value: "amber-A200", Color: "#ffd740", Shade: "", Special: false }, { Title: "Amber A400", Value: "amber-A400", Color: "#ffc400", Shade: "", Special: false }, { Title: "Amber A700", Value: "amber-A700", Color: "#ffab00", Shade: "", Special: false }], Orange: [{ Title: "Orange 50", Value: "orange-50", Color: "#fff3e0", Shade: "", Special: false }, { Title: "Deep orange", Value: "deep-orange", Color: "#ff5722", Shade: "", Special: false }, { Title: "Orange 100", Value: "orange-100", Color: "#ffe0b2", Shade: "", Special: false }, { Title: "Orange 200", Value: "orange-200", Color: "#ffcc80", Shade: "", Special: false }, { Title: "Orange 300", Value: "orange-300", Color: "#ffb74d", Shade: "", Special: false }, { Title: "Orange 400", Value: "orange-400", Color: "#ffa726", Shade: "", Special: false }, { Title: "Orange 500", Value: "orange-500", Color: "#ff9800", Shade: "", Special: false }, { Title: "Orange 600", Value: "orange-600", Color: "#fb8c00", Shade: "", Special: false }, { Title: "Orange 700", Value: "orange-700", Color: "#f57c00", Shade: "", Special: false }, { Title: "Orange 800", Value: "orange-800", Color: "#ef6c00", Shade: "", Special: false }, { Title: "Orange 900", Value: "orange-900", Color: "#e65100", Shade: "", Special: false }, { Title: "Orange A100", Value: "orange-A100", Color: "#ffd180", Shade: "", Special: false }, { Title: "Orange A200", Value: "orange-A200", Color: "#ffab40", Shade: "", Special: false }, { Title: "Orange A400", Value: "orange-A400", Color: "#ff9100", Shade: "", Special: false }, { Title: "Orange A700", Value: "orange-A700", Color: "#ff6d00", Shade: "", Special: false }], DeepOrange: [{ Title: "Deep Orange 50", Value: "deep-orange-50", Color: "#fbe9e7", Shade: "50", Special: false }, { Title: "Deep Orange 100", Value: "deep-orange-100", Color: "#ffccbc", Shade: "100", Special: false }, { Title: "Deep Orange 200", Value: "deep-orange-200", Color: "#ffab91", Shade: "200", Special: false }, { Title: "Deep Orange 300", Value: "deep-orange-300", Color: "#ff8a65", Shade: "300", Special: false }, { Title: "Deep Orange 400", Value: "deep-orange-400", Color: "#ff7043", Shade: "400", Special: false }, { Title: "Deep Orange 500", Value: "deep-orange-500", Color: "#ff5722", Shade: "500", Special: false }, { Title: "Deep Orange 600", Value: "deep-orange-600", Color: "#f4511e", Shade: "600", Special: false }, { Title: "Deep Orange 700", Value: "deep-orange-700", Color: "#e64a19", Shade: "700", Special: false }, { Title: "Deep Orange 800", Value: "deep-orange-800", Color: "#d84315", Shade: "800", Special: false }, { Title: "Deep Orange 900", Value: "deep-orange-900", Color: "#bf360c", Shade: "900", Special: false }, { Title: "Deep Orange A100", Value: "deep-orange-A100", Color: "#ff9e80", Shade: "A100", Special: true }, { Title: "Deep Orange A200", Value: "deep-orange-A200", Color: "#ff6e40", Shade: "A200", Special: true }, { Title: "Deep Orange A400", Value: "deep-orange-A400", Color: "#ff3d00", Shade: "A400", Special: true }, { Title: "Deep Orange A700", Value: "deep-orange-A700", Color: "#dd2c00", Shade: "A700", Special: true }], Brown: [{ Title: "Brown 50", Value: "brown-50", Color: "#efebe9", Shade: "", Special: false }, { Title: "Brown 100", Value: "brown-100", Color: "#d7ccc8", Shade: "", Special: false }, { Title: "Brown 200", Value: "brown-200", Color: "#bcaaa4", Shade: "", Special: false }, { Title: "Brown 300", Value: "brown-300", Color: "#a1887f", Shade: "", Special: false }, { Title: "Brown 400", Value: "brown-400", Color: "#8d6e63", Shade: "", Special: false }, { Title: "Brown 500", Value: "brown-500", Color: "#795548", Shade: "", Special: false }, { Title: "Brown 600", Value: "brown-600", Color: "#6d4c41", Shade: "", Special: false }, { Title: "Brown 700", Value: "brown-700", Color: "#5d4037", Shade: "", Special: false }, { Title: "Brown 800", Value: "brown-800", Color: "#4e342e", Shade: "", Special: false }, { Title: "Brown 900", Value: "brown-900", Color: "#3e2723", Shade: "", Special: false }, { Title: "Brown A100", Value: "brown-A100", Color: "#d7ccc8", Shade: "", Special: false }, { Title: "Brown A200", Value: "brown-A200", Color: "#bcaaa4", Shade: "", Special: false }, { Title: "Brown A400", Value: "brown-A400", Color: "#8d6e63", Shade: "", Special: false }, { Title: "Brown A700", Value: "brown-A700", Color: "#5d4037", Shade: "", Special: false }], Grey: [{ Title: "Grey 50", Value: "grey-50", Color: "#fafafa", Shade: "", Special: false }, { Title: "Grey 100", Value: "grey-100", Color: "#f5f5f5", Shade: "", Special: false }, { Title: "Grey 200", Value: "grey-200", Color: "#eeeeee", Shade: "", Special: false }, { Title: "Grey 300", Value: "grey-300", Color: "#e0e0e0", Shade: "", Special: false }, { Title: "Grey 400", Value: "grey-400", Color: "#bdbdbd", Shade: "", Special: false }, { Title: "Grey 500", Value: "grey-500", Color: "#9e9e9e", Shade: "", Special: false }, { Title: "Grey 600", Value: "grey-600", Color: "#757575", Shade: "", Special: false }, { Title: "Grey 700", Value: "grey-700", Color: "#616161", Shade: "", Special: false }, { Title: "Grey 800", Value: "grey-800", Color: "#424242", Shade: "", Special: false }, { Title: "Grey 900", Value: "grey-900", Color: "#212121", Shade: "", Special: false }, { Title: "Grey A100", Value: "grey-A100", Color: "#f5f5f5", Shade: "", Special: false }, { Title: "Grey A200", Value: "grey-A200", Color: "#eeeeee", Shade: "", Special: false }, { Title: "Grey A400", Value: "grey-A400", Color: "#bdbdbd", Shade: "", Special: false }, { Title: "Grey A700", Value: "grey-A700", Color: "#616161", Shade: "", Special: false }], BlueGrey: [{ Title: "Blue Grey 50", Value: "blue-grey-50", Color: "#eceff1", Shade: "50", Special: false }, { Title: "Blue Grey 100", Value: "blue-grey-100", Color: "#cfd8dc", Shade: "100", Special: false }, { Title: "Blue Grey 200", Value: "blue-grey-200", Color: "#b0bec5", Shade: "200", Special: false }, { Title: "Blue Grey 300", Value: "blue-grey-300", Color: "#90a4ae", Shade: "300", Special: false }, { Title: "Blue Grey 400", Value: "blue-grey-400", Color: "#78909c", Shade: "400", Special: false }, { Title: "Blue Grey 500", Value: "blue-grey-500", Color: "#607d8b", Shade: "500", Special: false }, { Title: "Blue Grey 600", Value: "blue-grey-600", Color: "#546e7a", Shade: "600", Special: false }, { Title: "Blue Grey 700", Value: "blue-grey-700", Color: "#455a64", Shade: "700", Special: false }, { Title: "Blue Grey 800", Value: "blue-grey-800", Color: "#37474f", Shade: "800", Special: false }, { Title: "Blue Grey 900", Value: "blue-grey-900", Color: "#263238", Shade: "900", Special: false }, { Title: "Blue Grey A100", Value: "blue-grey-A100", Color: "#cfd8dc", Shade: "A100", Special: true }, { Title: "Blue Grey A200", Value: "blue-grey-A200", Color: "#b0bec5", Shade: "A200", Special: true }, { Title: "Blue Grey A400", Value: "blue-grey-A400", Color: "#78909c", Shade: "A400", Special: true }, { Title: "Blue Grey A700", Value: "blue-grey-A700", Color: "#455a64", Shade: "A700", Special: true }], White: [{ Title: "White", Value: "white", Color: "#ffffff", Shade: "", Special: false }], Black: [{ Title: "Black", Value: "black", Color: "#000000", Shade: "", Special: false }] }
            , TextsObjects: { Red: [{ Title: "Red 50", Value: "text-red-50", Color: "#ffebee", Shade: "", Special: false }, { Title: "Red 100", Value: "text-red-100", Color: "#ffcdd2", Shade: "", Special: false }, { Title: "Red 200", Value: "text-red-200", Color: "#ef9a9a", Shade: "", Special: false }, { Title: "Red 300", Value: "text-red-300", Color: "#e57373", Shade: "", Special: false }, { Title: "Red 400", Value: "text-red-400", Color: "#ef5350", Shade: "", Special: false }, { Title: "Red 500", Value: "text-red-500", Color: "#f44336", Shade: "", Special: false }, { Title: "Red 600", Value: "text-red-600", Color: "#e53935", Shade: "", Special: false }, { Title: "Red 700", Value: "text-red-700", Color: "#d32f2f", Shade: "", Special: false }, { Title: "Red 800", Value: "text-red-800", Color: "#c62828", Shade: "", Special: false }, { Title: "Red 900", Value: "text-red-900", Color: "#b71c1c", Shade: "", Special: false }, { Title: "Red A100", Value: "text-red-A100", Color: "#ff8a80", Shade: "", Special: false }, { Title: "Red A200", Value: "text-red-A200", Color: "#ff5252", Shade: "", Special: false }, { Title: "Red A400", Value: "text-red-A400", Color: "#ff1744", Shade: "", Special: false }, { Title: "Red A700", Value: "text-red-A700", Color: "#d50000", Shade: "", Special: false }], Pink: [{ Title: "Pink 50", Value: "text-pink-50", Color: "#fce4ec", Shade: "", Special: false }, { Title: "Pink 100", Value: "text-pink-100", Color: "#f8bbd0", Shade: "", Special: false }, { Title: "Pink 200", Value: "text-pink-200", Color: "#f48fb1", Shade: "", Special: false }, { Title: "Pink 300", Value: "text-pink-300", Color: "#f06292", Shade: "", Special: false }, { Title: "Pink 400", Value: "text-pink-400", Color: "#ec407a", Shade: "", Special: false }, { Title: "Pink 500", Value: "text-pink-500", Color: "#e91e63", Shade: "", Special: false }, { Title: "Pink 600", Value: "text-pink-600", Color: "#d81b60", Shade: "", Special: false }, { Title: "Pink 700", Value: "text-pink-700", Color: "#c2185b", Shade: "", Special: false }, { Title: "Pink 800", Value: "text-pink-800", Color: "#ad1457", Shade: "", Special: false }, { Title: "Pink 900", Value: "text-pink-900", Color: "#880e4f", Shade: "", Special: false }, { Title: "Pink A100", Value: "text-pink-A100", Color: "#ff80ab", Shade: "", Special: false }, { Title: "Pink A200", Value: "text-pink-A200", Color: "#ff4081", Shade: "", Special: false }, { Title: "Pink A400", Value: "text-pink-A400", Color: "#f50057", Shade: "", Special: false }, { Title: "Pink A700", Value: "text-pink-A700", Color: "#c51162", Shade: "", Special: false }], Purple: [{ Title: "Purple 50", Value: "text-purple-50", Color: "#f3e5f5", Shade: "", Special: false }, { Title: "Purple 100", Value: "text-purple-100", Color: "#e1bee7", Shade: "", Special: false }, { Title: "Purple 200", Value: "text-purple-200", Color: "#ce93d8", Shade: "", Special: false }, { Title: "Purple 300", Value: "text-purple-300", Color: "#ba68c8", Shade: "", Special: false }, { Title: "Purple 400", Value: "text-purple-400", Color: "#ab47bc", Shade: "", Special: false }, { Title: "Purple 500", Value: "text-purple-500", Color: "#9c27b0", Shade: "", Special: false }, { Title: "Purple 600", Value: "text-purple-600", Color: "#8e24aa", Shade: "", Special: false }, { Title: "Purple 700", Value: "text-purple-700", Color: "#7b1fa2", Shade: "", Special: false }, { Title: "Purple 800", Value: "text-purple-800", Color: "#6a1b9a", Shade: "", Special: false }, { Title: "Purple 900", Value: "text-purple-900", Color: "#4a148c", Shade: "", Special: false }, { Title: "Purple A100", Value: "text-purple-A100", Color: "#ea80fc", Shade: "", Special: false }, { Title: "Purple A200", Value: "text-purple-A200", Color: "#e040fb", Shade: "", Special: false }, { Title: "Purple A400", Value: "text-purple-A400", Color: "#d500f9", Shade: "", Special: false }, { Title: "Purple A700", Value: "text-purple-A700", Color: "#aa00ff", Shade: "", Special: false }], DeepPurple: [{ Title: "Deep Purple 50", Value: "text-deep-purple-50", Color: "#ede7f6", Shade: "50", Special: false }, { Title: "Deep Purple 100", Value: "text-deep-purple-100", Color: "#d1c4e9", Shade: "100", Special: false }, { Title: "Deep Purple 200", Value: "text-deep-purple-200", Color: "#b39ddb", Shade: "200", Special: false }, { Title: "Deep Purple 300", Value: "text-deep-purple-300", Color: "#9575cd", Shade: "300", Special: false }, { Title: "Deep Purple 400", Value: "text-deep-purple-400", Color: "#7e57c2", Shade: "400", Special: false }, { Title: "Deep Purple 500", Value: "text-deep-purple-500", Color: "#673ab7", Shade: "500", Special: false }, { Title: "Deep Purple 600", Value: "text-deep-purple-600", Color: "#5e35b1", Shade: "600", Special: false }, { Title: "Deep Purple 700", Value: "text-deep-purple-700", Color: "#512da8", Shade: "700", Special: false }, { Title: "Deep Purple 800", Value: "text-deep-purple-800", Color: "#4527a0", Shade: "800", Special: false }, { Title: "Deep Purple 900", Value: "text-deep-purple-900", Color: "#311b92", Shade: "900", Special: false }, { Title: "Deep Purple A100", Value: "text-deep-purple-A100", Color: "#b388ff", Shade: "A100", Special: true }, { Title: "Deep purple", Value: "text-deep-purple", Color: "#673ab7", Shade: "", Special: false }, { Title: "Deep Purple A200", Value: "text-deep-purple-A200", Color: "#7c4dff", Shade: "A200", Special: true }, { Title: "Deep Purple A400", Value: "text-deep-purple-A400", Color: "#651fff", Shade: "A400", Special: true }, { Title: "Deep Purple A700", Value: "text-deep-purple-A700", Color: "#6200ea", Shade: "A700", Special: true }], Indigo: [{ Title: "Indigo 50", Value: "text-indigo-50", Color: "#e8eaf6", Shade: "", Special: false }, { Title: "Indigo 100", Value: "text-indigo-100", Color: "#c5cae9", Shade: "", Special: false }, { Title: "Indigo 200", Value: "text-indigo-200", Color: "#9fa8da", Shade: "", Special: false }, { Title: "Indigo 300", Value: "text-indigo-300", Color: "#7986cb", Shade: "", Special: false }, { Title: "Indigo 400", Value: "text-indigo-400", Color: "#5c6bc0", Shade: "", Special: false }, { Title: "Indigo 500", Value: "text-indigo-500", Color: "#3f51b5", Shade: "", Special: false }, { Title: "Indigo 600", Value: "text-indigo-600", Color: "#3949ab", Shade: "", Special: false }, { Title: "Indigo 700", Value: "text-indigo-700", Color: "#303f9f", Shade: "", Special: false }, { Title: "Indigo 800", Value: "text-indigo-800", Color: "#283593", Shade: "", Special: false }, { Title: "Indigo 900", Value: "text-indigo-900", Color: "#1a237e", Shade: "", Special: false }, { Title: "Indigo A100", Value: "text-indigo-A100", Color: "#8c9eff", Shade: "", Special: false }, { Title: "Indigo A200", Value: "text-indigo-A200", Color: "#536dfe", Shade: "", Special: false }, { Title: "Indigo A400", Value: "text-indigo-A400", Color: "#3d5afe", Shade: "", Special: false }, { Title: "Indigo A700", Value: "text-indigo-A700", Color: "#304ffe", Shade: "", Special: false }], Blue: [{ Title: "Blue 50", Value: "text-blue-50", Color: "#e3f2fd", Shade: "", Special: false }, { Title: "Blue 100", Value: "text-blue-100", Color: "#bbdefb", Shade: "", Special: false }, { Title: "Blue 200", Value: "text-blue-200", Color: "#90caf9", Shade: "", Special: false }, { Title: "Blue 300", Value: "text-blue-300", Color: "#64b5f6", Shade: "", Special: false }, { Title: "Blue 400", Value: "text-blue-400", Color: "#42a5f5", Shade: "", Special: false }, { Title: "Blue 500", Value: "text-blue-500", Color: "#2196f3", Shade: "", Special: false }, { Title: "Blue 600", Value: "text-blue-600", Color: "#1e88e5", Shade: "", Special: false }, { Title: "Blue 700", Value: "text-blue-700", Color: "#1976d2", Shade: "", Special: false }, { Title: "Blue 800", Value: "text-blue-800", Color: "#1565c0", Shade: "", Special: false }, { Title: "Blue 900", Value: "text-blue-900", Color: "#0d47a1", Shade: "", Special: false }, { Title: "Blue A100", Value: "text-blue-A100", Color: "#82b1ff", Shade: "", Special: false }, { Title: "Blue A200", Value: "text-blue-A200", Color: "#448aff", Shade: "", Special: false }, { Title: "Blue A400", Value: "text-blue-A400", Color: "#2979ff", Shade: "", Special: false }, { Title: "Blue A700", Value: "text-blue-A700", Color: "#2962ff", Shade: "", Special: false }, { Title: "Blue grey", Value: "text-blue-grey", Color: "#607d8b", Shade: "", Special: false }], LightBlue: [{ Title: "Light Blue 50", Value: "text-light-blue-50", Color: "#e1f5fe", Shade: "50", Special: false }, { Title: "Light Blue 100", Value: "text-light-blue-100", Color: "#b3e5fc", Shade: "100", Special: false }, { Title: "Light Blue 200", Value: "text-light-blue-200", Color: "#81d4fa", Shade: "200", Special: false }, { Title: "Light Blue 300", Value: "text-light-blue-300", Color: "#4fc3f7", Shade: "300", Special: false }, { Title: "Light Blue 400", Value: "text-light-blue-400", Color: "#29b6f6", Shade: "400", Special: false }, { Title: "Light Blue 500", Value: "text-light-blue-500", Color: "#03a9f4", Shade: "500", Special: false }, { Title: "Light Blue 600", Value: "text-light-blue-600", Color: "#039be5", Shade: "600", Special: false }, { Title: "Light Blue 700", Value: "text-light-blue-700", Color: "#0288d1", Shade: "700", Special: false }, { Title: "Light Blue 800", Value: "text-light-blue-800", Color: "#0277bd", Shade: "800", Special: false }, { Title: "Light Blue 900", Value: "text-light-blue-900", Color: "#01579b", Shade: "900", Special: false }, { Title: "Light Blue A100", Value: "text-light-blue-A100", Color: "#80d8ff", Shade: "A100", Special: true }, { Title: "Light blue", Value: "text-light-blue", Color: "#03a9f4", Shade: "", Special: false }, { Title: "Light Blue A200", Value: "text-light-blue-A200", Color: "#40c4ff", Shade: "A200", Special: true }, { Title: "Light Blue A400", Value: "text-light-blue-A400", Color: "#00b0ff", Shade: "A400", Special: true }, { Title: "Light Blue A700", Value: "text-light-blue-A700", Color: "#0091ea", Shade: "A700", Special: true }], Cyan: [{ Title: "Cyan 50", Value: "text-cyan-50", Color: "#e0f7fa", Shade: "", Special: false }, { Title: "Cyan 100", Value: "text-cyan-100", Color: "#b2ebf2", Shade: "", Special: false }, { Title: "Cyan 200", Value: "text-cyan-200", Color: "#80deea", Shade: "", Special: false }, { Title: "Cyan 300", Value: "text-cyan-300", Color: "#4dd0e1", Shade: "", Special: false }, { Title: "Cyan 400", Value: "text-cyan-400", Color: "#26c6da", Shade: "", Special: false }, { Title: "Cyan 500", Value: "text-cyan-500", Color: "#00bcd4", Shade: "", Special: false }, { Title: "Cyan 600", Value: "text-cyan-600", Color: "#00acc1", Shade: "", Special: false }, { Title: "Cyan 700", Value: "text-cyan-700", Color: "#0097a7", Shade: "", Special: false }, { Title: "Cyan 800", Value: "text-cyan-800", Color: "#00838f", Shade: "", Special: false }, { Title: "Cyan 900", Value: "text-cyan-900", Color: "#006064", Shade: "", Special: false }, { Title: "Cyan A100", Value: "text-cyan-A100", Color: "#84ffff", Shade: "", Special: false }, { Title: "Cyan A200", Value: "text-cyan-A200", Color: "#18ffff", Shade: "", Special: false }, { Title: "Cyan A400", Value: "text-cyan-A400", Color: "#00e5ff", Shade: "", Special: false }, { Title: "Cyan A700", Value: "text-cyan-A700", Color: "#00b8d4", Shade: "", Special: false }], Teal: [{ Title: "Teal 50", Value: "text-teal-50", Color: "#e0f2f1", Shade: "", Special: false }, { Title: "Teal 100", Value: "text-teal-100", Color: "#b2dfdb", Shade: "", Special: false }, { Title: "Teal 200", Value: "text-teal-200", Color: "#80cbc4", Shade: "", Special: false }, { Title: "Teal 300", Value: "text-teal-300", Color: "#4db6ac", Shade: "", Special: false }, { Title: "Teal 400", Value: "text-teal-400", Color: "#26a69a", Shade: "", Special: false }, { Title: "Teal 500", Value: "text-teal-500", Color: "#009688", Shade: "", Special: false }, { Title: "Teal 600", Value: "text-teal-600", Color: "#00897b", Shade: "", Special: false }, { Title: "Teal 700", Value: "text-teal-700", Color: "#00796b", Shade: "", Special: false }, { Title: "Teal 800", Value: "text-teal-800", Color: "#00695c", Shade: "", Special: false }, { Title: "Teal 900", Value: "text-teal-900", Color: "#004d40", Shade: "", Special: false }, { Title: "Teal A100", Value: "text-teal-A100", Color: "#a7ffeb", Shade: "", Special: false }, { Title: "Teal A200", Value: "text-teal-A200", Color: "#64ffda", Shade: "", Special: false }, { Title: "Teal A400", Value: "text-teal-A400", Color: "#1de9b6", Shade: "", Special: false }, { Title: "Teal A700", Value: "text-teal-A700", Color: "#00bfa5", Shade: "", Special: false }], Green: [{ Title: "Green 50", Value: "text-green-50", Color: "#e8f5e9", Shade: "", Special: false }, { Title: "Green 100", Value: "text-green-100", Color: "#c8e6c9", Shade: "", Special: false }, { Title: "Green 200", Value: "text-green-200", Color: "#a5d6a7", Shade: "", Special: false }, { Title: "Green 300", Value: "text-green-300", Color: "#81c784", Shade: "", Special: false }, { Title: "Green 400", Value: "text-green-400", Color: "#66bb6a", Shade: "", Special: false }, { Title: "Green 500", Value: "text-green-500", Color: "#4caf50", Shade: "", Special: false }, { Title: "Green 600", Value: "text-green-600", Color: "#43a047", Shade: "", Special: false }, { Title: "Green 700", Value: "text-green-700", Color: "#388e3c", Shade: "", Special: false }, { Title: "Green 800", Value: "text-green-800", Color: "#2e7d32", Shade: "", Special: false }, { Title: "Green 900", Value: "text-green-900", Color: "#1b5e20", Shade: "", Special: false }, { Title: "Green A100", Value: "text-green-A100", Color: "#b9f6ca", Shade: "", Special: false }, { Title: "Green A200", Value: "text-green-A200", Color: "#69f0ae", Shade: "", Special: false }, { Title: "Green A400", Value: "text-green-A400", Color: "#00e676", Shade: "", Special: false }, { Title: "Green A700", Value: "text-green-A700", Color: "#00c853", Shade: "", Special: false }], LightGreen: [{ Title: "Light Green 50", Value: "text-light-green-50", Color: "#f1f8e9", Shade: "50", Special: false }, { Title: "Light Green 100", Value: "text-light-green-100", Color: "#dcedc8", Shade: "100", Special: false }, { Title: "Light green", Value: "text-light-green", Color: "#8bc34a", Shade: "", Special: false }, { Title: "Light Green 200", Value: "text-light-green-200", Color: "#c5e1a5", Shade: "200", Special: false }, { Title: "Light Green 300", Value: "text-light-green-300", Color: "#aed581", Shade: "300", Special: false }, { Title: "Light Green 400", Value: "text-light-green-400", Color: "#9ccc65", Shade: "400", Special: false }, { Title: "Light Green 500", Value: "text-light-green-500", Color: "#8bc34a", Shade: "500", Special: false }, { Title: "Light Green 600", Value: "text-light-green-600", Color: "#7cb342", Shade: "600", Special: false }, { Title: "Light Green 700", Value: "text-light-green-700", Color: "#689f38", Shade: "700", Special: false }, { Title: "Light Green 800", Value: "text-light-green-800", Color: "#558b2f", Shade: "800", Special: false }, { Title: "Light Green 900", Value: "text-light-green-900", Color: "#33691e", Shade: "900", Special: false }, { Title: "Light Green A100", Value: "text-light-green-A100", Color: "#ccff90", Shade: "A100", Special: true }, { Title: "Light Green A200", Value: "text-light-green-A200", Color: "#b2ff59", Shade: "A200", Special: true }, { Title: "Light Green A400", Value: "text-light-green-A400", Color: "#76ff03", Shade: "A400", Special: true }, { Title: "Light Green A700", Value: "text-light-green-A700", Color: "#64dd17", Shade: "A700", Special: true }], Lime: [{ Title: "Lime 50", Value: "text-lime-50", Color: "#f9fbe7", Shade: "", Special: false }, { Title: "Lime 100", Value: "text-lime-100", Color: "#f0f4c3", Shade: "", Special: false }, { Title: "Lime 200", Value: "text-lime-200", Color: "#e6ee9c", Shade: "", Special: false }, { Title: "Lime 300", Value: "text-lime-300", Color: "#dce775", Shade: "", Special: false }, { Title: "Lime 400", Value: "text-lime-400", Color: "#d4e157", Shade: "", Special: false }, { Title: "Lime 500", Value: "text-lime-500", Color: "#cddc39", Shade: "", Special: false }, { Title: "Lime 600", Value: "text-lime-600", Color: "#c0ca33", Shade: "", Special: false }, { Title: "Lime 700", Value: "text-lime-700", Color: "#afb42b", Shade: "", Special: false }, { Title: "Lime 800", Value: "text-lime-800", Color: "#9e9d24", Shade: "", Special: false }, { Title: "Lime 900", Value: "text-lime-900", Color: "#827717", Shade: "", Special: false }, { Title: "Lime A100", Value: "text-lime-A100", Color: "#f4ff81", Shade: "", Special: false }, { Title: "Lime A200", Value: "text-lime-A200", Color: "#eeff41", Shade: "", Special: false }, { Title: "Lime A400", Value: "text-lime-A400", Color: "#c6ff00", Shade: "", Special: false }, { Title: "Lime A700", Value: "text-lime-A700", Color: "#aeea00", Shade: "", Special: false }], Yellow: [{ Title: "Yellow 50", Value: "text-yellow-50", Color: "#fffde7", Shade: "", Special: false }, { Title: "Yellow 100", Value: "text-yellow-100", Color: "#fff9c4", Shade: "", Special: false }, { Title: "Yellow 200", Value: "text-yellow-200", Color: "#fff59d", Shade: "", Special: false }, { Title: "Yellow 300", Value: "text-yellow-300", Color: "#fff176", Shade: "", Special: false }, { Title: "Yellow 400", Value: "text-yellow-400", Color: "#ffee58", Shade: "", Special: false }, { Title: "Yellow 500", Value: "text-yellow-500", Color: "#ffeb3b", Shade: "", Special: false }, { Title: "Yellow 600", Value: "text-yellow-600", Color: "#fdd835", Shade: "", Special: false }, { Title: "Yellow 700", Value: "text-yellow-700", Color: "#fbc02d", Shade: "", Special: false }, { Title: "Yellow 800", Value: "text-yellow-800", Color: "#f9a825", Shade: "", Special: false }, { Title: "Yellow 900", Value: "text-yellow-900", Color: "#f57f17", Shade: "", Special: false }, { Title: "Yellow A100", Value: "text-yellow-A100", Color: "#ffff8d", Shade: "", Special: false }, { Title: "Yellow A200", Value: "text-yellow-A200", Color: "#ffff00", Shade: "", Special: false }, { Title: "Yellow A400", Value: "text-yellow-A400", Color: "#ffea00", Shade: "", Special: false }, { Title: "Yellow A700", Value: "text-yellow-A700", Color: "#ffd600", Shade: "", Special: false }], Amber: [{ Title: "Amber 50", Value: "text-amber-50", Color: "#fff8e1", Shade: "", Special: false }, { Title: "Amber 100", Value: "text-amber-100", Color: "#ffecb3", Shade: "", Special: false }, { Title: "Amber 200", Value: "text-amber-200", Color: "#ffe082", Shade: "", Special: false }, { Title: "Amber 300", Value: "text-amber-300", Color: "#ffd54f", Shade: "", Special: false }, { Title: "Amber 400", Value: "text-amber-400", Color: "#ffca28", Shade: "", Special: false }, { Title: "Amber 500", Value: "text-amber-500", Color: "#ffc107", Shade: "", Special: false }, { Title: "Amber 600", Value: "text-amber-600", Color: "#ffb300", Shade: "", Special: false }, { Title: "Amber 700", Value: "text-amber-700", Color: "#ffa000", Shade: "", Special: false }, { Title: "Amber 800", Value: "text-amber-800", Color: "#ff8f00", Shade: "", Special: false }, { Title: "Amber 900", Value: "text-amber-900", Color: "#ff6f00", Shade: "", Special: false }, { Title: "Amber A100", Value: "text-amber-A100", Color: "#ffe57f", Shade: "", Special: false }, { Title: "Amber A200", Value: "text-amber-A200", Color: "#ffd740", Shade: "", Special: false }, { Title: "Amber A400", Value: "text-amber-A400", Color: "#ffc400", Shade: "", Special: false }, { Title: "Amber A700", Value: "text-amber-A700", Color: "#ffab00", Shade: "", Special: false }], Orange: [{ Title: "Orange 50", Value: "text-orange-50", Color: "#fff3e0", Shade: "", Special: false }, { Title: "Orange 100", Value: "text-orange-100", Color: "#ffe0b2", Shade: "", Special: false }, { Title: "Orange 200", Value: "text-orange-200", Color: "#ffcc80", Shade: "", Special: false }, { Title: "Orange 300", Value: "text-orange-300", Color: "#ffb74d", Shade: "", Special: false }, { Title: "Orange 400", Value: "text-orange-400", Color: "#ffa726", Shade: "", Special: false }, { Title: "Orange 500", Value: "text-orange-500", Color: "#ff9800", Shade: "", Special: false }, { Title: "Orange 600", Value: "text-orange-600", Color: "#fb8c00", Shade: "", Special: false }, { Title: "Orange 700", Value: "text-orange-700", Color: "#f57c00", Shade: "", Special: false }, { Title: "Orange 800", Value: "text-orange-800", Color: "#ef6c00", Shade: "", Special: false }, { Title: "Orange 900", Value: "text-orange-900", Color: "#e65100", Shade: "", Special: false }, { Title: "Orange A100", Value: "text-orange-A100", Color: "#ffd180", Shade: "", Special: false }, { Title: "Orange A200", Value: "text-orange-A200", Color: "#ffab40", Shade: "", Special: false }, { Title: "Orange A400", Value: "text-orange-A400", Color: "#ff9100", Shade: "", Special: false }, { Title: "Orange A700", Value: "text-orange-A700", Color: "#ff6d00", Shade: "", Special: false }], DeepOrange: [{ Title: "Deep Orange 50", Value: "text-deep-orange-50", Color: "#fbe9e7", Shade: "50", Special: false }, { Title: "Deep Orange 100", Value: "text-deep-orange-100", Color: "#ffccbc", Shade: "100", Special: false }, { Title: "Deep Orange 200", Value: "text-deep-orange-200", Color: "#ffab91", Shade: "200", Special: false }, { Title: "Deep Orange 300", Value: "text-deep-orange-300", Color: "#ff8a65", Shade: "300", Special: false }, { Title: "Deep Orange 400", Value: "text-deep-orange-400", Color: "#ff7043", Shade: "400", Special: false }, { Title: "Deep Orange 500", Value: "text-deep-orange-500", Color: "#ff5722", Shade: "500", Special: false }, { Title: "Deep Orange 600", Value: "text-deep-orange-600", Color: "#f4511e", Shade: "600", Special: false }, { Title: "Deep Orange 700", Value: "text-deep-orange-700", Color: "#e64a19", Shade: "700", Special: false }, { Title: "Deep orange", Value: "text-deep-orange", Color: "#ff5722", Shade: "", Special: false }, { Title: "Deep Orange 800", Value: "text-deep-orange-800", Color: "#d84315", Shade: "800", Special: false }, { Title: "Deep Orange 900", Value: "text-deep-orange-900", Color: "#bf360c", Shade: "900", Special: false }, { Title: "Deep Orange A100", Value: "text-deep-orange-A100", Color: "#ff9e80", Shade: "A100", Special: true }, { Title: "Deep Orange A200", Value: "text-deep-orange-A200", Color: "#ff6e40", Shade: "A200", Special: true }, { Title: "Deep Orange A400", Value: "text-deep-orange-A400", Color: "#ff3d00", Shade: "A400", Special: true }, { Title: "Deep Orange A700", Value: "text-deep-orange-A700", Color: "#dd2c00", Shade: "A700", Special: true }], Brown: [{ Title: "Brown 50", Value: "text-brown-50", Color: "#efebe9", Shade: "", Special: false }, { Title: "Brown 100", Value: "text-brown-100", Color: "#d7ccc8", Shade: "", Special: false }, { Title: "Brown 200", Value: "text-brown-200", Color: "#bcaaa4", Shade: "", Special: false }, { Title: "Brown 300", Value: "text-brown-300", Color: "#a1887f", Shade: "", Special: false }, { Title: "Brown 400", Value: "text-brown-400", Color: "#8d6e63", Shade: "", Special: false }, { Title: "Brown 500", Value: "text-brown-500", Color: "#795548", Shade: "", Special: false }, { Title: "Brown 600", Value: "text-brown-600", Color: "#6d4c41", Shade: "", Special: false }, { Title: "Brown 700", Value: "text-brown-700", Color: "#5d4037", Shade: "", Special: false }, { Title: "Brown 800", Value: "text-brown-800", Color: "#4e342e", Shade: "", Special: false }, { Title: "Brown 900", Value: "text-brown-900", Color: "#3e2723", Shade: "", Special: false }, { Title: "Brown A100", Value: "text-brown-A100", Color: "#d7ccc8", Shade: "", Special: false }, { Title: "Brown A200", Value: "text-brown-A200", Color: "#bcaaa4", Shade: "", Special: false }, { Title: "Brown A400", Value: "text-brown-A400", Color: "#8d6e63", Shade: "", Special: false }, { Title: "Brown A700", Value: "text-brown-A700", Color: "#5d4037", Shade: "", Special: false }], Grey: [{ Title: "Grey 50", Value: "text-grey-50", Color: "#fafafa", Shade: "", Special: false }, { Title: "Grey 100", Value: "text-grey-100", Color: "#f5f5f5", Shade: "", Special: false }, { Title: "Grey 200", Value: "text-grey-200", Color: "#eeeeee", Shade: "", Special: false }, { Title: "Grey 300", Value: "text-grey-300", Color: "#e0e0e0", Shade: "", Special: false }, { Title: "Grey 400", Value: "text-grey-400", Color: "#bdbdbd", Shade: "", Special: false }, { Title: "Grey 500", Value: "text-grey-500", Color: "#9e9e9e", Shade: "", Special: false }, { Title: "Grey 600", Value: "text-grey-600", Color: "#757575", Shade: "", Special: false }, { Title: "Grey 700", Value: "text-grey-700", Color: "#616161", Shade: "", Special: false }, { Title: "Grey 800", Value: "text-grey-800", Color: "#424242", Shade: "", Special: false }, { Title: "Grey 900", Value: "text-grey-900", Color: "#212121", Shade: "", Special: false }, { Title: "Grey A100", Value: "text-grey-A100", Color: "#f5f5f5", Shade: "", Special: false }, { Title: "Grey A200", Value: "text-grey-A200", Color: "#eeeeee", Shade: "", Special: false }, { Title: "Grey A400", Value: "text-grey-A400", Color: "#bdbdbd", Shade: "", Special: false }, { Title: "Grey A700", Value: "text-grey-A700", Color: "#616161", Shade: "", Special: false }], BlueGrey: [{ Title: "Blue Grey 50", Value: "text-blue-grey-50", Color: "#eceff1", Shade: "50", Special: false }, { Title: "Blue Grey 100", Value: "text-blue-grey-100", Color: "#cfd8dc", Shade: "100", Special: false }, { Title: "Blue Grey 200", Value: "text-blue-grey-200", Color: "#b0bec5", Shade: "200", Special: false }, { Title: "Blue Grey 300", Value: "text-blue-grey-300", Color: "#90a4ae", Shade: "300", Special: false }, { Title: "Blue Grey 400", Value: "text-blue-grey-400", Color: "#78909c", Shade: "400", Special: false }, { Title: "Blue Grey 500", Value: "text-blue-grey-500", Color: "#607d8b", Shade: "500", Special: false }, { Title: "Blue Grey 600", Value: "text-blue-grey-600", Color: "#546e7a", Shade: "600", Special: false }, { Title: "Blue Grey 700", Value: "text-blue-grey-700", Color: "#455a64", Shade: "700", Special: false }, { Title: "Blue Grey 800", Value: "text-blue-grey-800", Color: "#37474f", Shade: "800", Special: false }, { Title: "Blue Grey 900", Value: "text-blue-grey-900", Color: "#263238", Shade: "900", Special: false }, { Title: "Blue Grey A100", Value: "text-blue-grey-A100", Color: "#cfd8dc", Shade: "A100", Special: true }, { Title: "Blue Grey A200", Value: "text-blue-grey-A200", Color: "#b0bec5", Shade: "A200", Special: true }, { Title: "Blue Grey A400", Value: "text-blue-grey-A400", Color: "#78909c", Shade: "A400", Special: true }, { Title: "Blue Grey A700", Value: "text-blue-grey-A700", Color: "#455a64", Shade: "A700", Special: true }], White: [{ Title: "White", Value: "text-white", Color: "#ffffff", Shade: "", Special: false }], Black: [{ Title: "Black", Value: "text-black", Color: "#000000", Shade: "", Special: false }] }
            , Opacities: [{ Title: "100% Opacity", Value: "o100" }, { Title: "90% Opacity", Value: "o90" }, { Title: "80% Opacity", Value: "o80" }, { Title: "70% Opacity", Value: "o70" }, { Title: "60% Opacity", Value: "o60" }, { Title: "50% Opacity", Value: "o50" }, { Title: "40% Opacity", Value: "o40" }, { Title: "30% Opacity", Value: "o30" }, { Title: "20% Opacity", Value: "o20" }, { Title: "10% Opacity", Value: "o10" }, { Title: "0% Opacity", Value: "o0" }]
            , Text: "text-grey-a100"
            , Background: "grey-a700"
            , BodyBackgrounds: "transparent"
            , Opacity: "o100"
            , ChangeBackgroundColor: function (value) {
                $rootScope.Colors.Background = value.Value;
            }
            , ChangeTextColor: function (value) {
                $rootScope.Colors.Text = value.Value;
            }
            , IsColorsFilled: function () {
                return ($rootScope.Check.IsStringFilled($rootScope.Colors.Text) && $rootScope.Check.IsStringFilled($rootScope.Colors.Background));
            }
            , IsColorsEmpty: function () {
                return !$rootScope.Colors.IsColorsFilled();
            }
            , Save: function (text, background, opacity, bodybackgrounds) {
                $rootScope.Loader.PageLoader.Show();
                if ($rootScope.Colors.IsColorsEmpty()) {
                    $rootScope.Notify.Notification(null, "Failed to save colors.", $rootScope.Notify.NotifyType.Error);
                    return null;
                }
                var objOfColors = {
                    Text: $rootScope.Colors.Text
                    , Background: $rootScope.Colors.Background
                    , BodyBackgrounds: $rootScope.Colors.BodyBackgrounds
                    , Opacity: $rootScope.Colors.Opacity
                };
                if (text)
                { objOfColors.Text = text; }
                if (background)
                { objOfColors.Background = background; }
                if (bodybackgrounds)
                { objOfColors.BodyBackgrounds = bodybackgrounds; }
                if (opacity)
                { objOfColors.Opacity = opacity; }

                $rootScope.Save.SaveDynamic("colors", objOfColors, "Colors");
            }
            , Get: function () {
                chrome.storage.local.get("Colors", function (colors) {
                    if (colors.Colors != undefined && colors.Colors != null) {
                        $rootScope.Colors.Text = colors.Colors.Text;
                        $rootScope.Colors.Background = colors.Colors.Background;
                        $rootScope.Colors.BodyBackgrounds = colors.Colors.BodyBackgrounds;
                        $rootScope.Colors.Opacity = colors.Colors.Opacity;
                    }
                });
            }
        };

        $rootScope.Youtube = {
            Videos: []
            , Video: {
                Title: null
            , Value: null
            }
            , Regex: /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/
            , RegexCode: /([a-zA-Z0-9_-]{6,11})/
            , TestRegex: function (value) {
                var match = $rootScope.Youtube.Regex.exec(value, "i");
                return match
            }
            , TestRegexCode: function (value) {
                var match = $rootScope.Youtube.RegexCode.exec(value, "i");
                return match
            }
            , FormatURL: function (value) {
                return "https://www.youtube.com/watch?v=" + value;
            }
            , IsVideoFilled: function () {
                return ($rootScope.Check.IsStringFilled($rootScope.Youtube.Video.Value) && $rootScope.Check.IsStringFilled($rootScope.Youtube.Video.Title));
            }
            , IsVideoEmpty: function () {
                return !$rootScope.Youtube.IsVideoFilled()
            }
            , Save: function () {
                if ($rootScope.Youtube.IsVideoEmpty()) {
                    $rootScope.Notify.Notification(null, "Image faild to update.", $rootScope.Notify.NotifyType.Error);
                    $rootScope.Loader.PageLoader.Hide();
                    return false;
                }
                var videoCode = null;
                var regexMatches = $rootScope.Youtube.TestRegex($rootScope.Youtube.Video.Value);
                if (regexMatches) {
                    videoCode = regexMatches[1];
                }
                else {
                    var regexCodeMatches = $rootScope.Youtube.TestRegexCode($rootScope.Youtube.Video.Value);
                    if (regexCodeMatches) {
                        videoCode = regexCodeMatches[1];
                    }
                }
                if ((regexMatches == null && regexCodeMatches == null) || videoCode == null) {
                    $rootScope.Notify.Notification(null, "Could not detect youtube video code.", $rootScope.Notify.NotifyType.Error);
                    $rootScope.Loader.PageLoader.Hide();
                    return false;
                }
                var object = {
                    Value: videoCode
                    , Title: $rootScope.Youtube.Video.Title
                    , Id: $rootScope.Utils.ToId(videoCode)
                };
                var doesExist = $rootScope.Check.FindObjectInArrayOfObjects($rootScope.Youtube.Videos, object, null, true);
                if (!angular.isNumber(doesExist)) {
                    $rootScope.Youtube.Videos.push(object);
                    $rootScope.Save.SaveDynamic("Youtube video", $rootScope.Youtube.Videos, "Youtube");
                    $rootScope.Youtube.Video.Value = null;
                    $rootScope.Youtube.Video.Title = null;
                    $rootScope.Youtube.Video.Id = null;
                } else {
                    $rootScope.Notify.Notification(null, "Failed to add video, it already exists.", $rootScope.Notify.NotifyType.Error);
                }
            }
            , Get: function () {
                chrome.storage.local.get("Youtube", function (youtube) {
                    if (youtube.Youtube != undefined && youtube.Youtube != null) {
                        $rootScope.Youtube.Videos = youtube.Youtube;
                    }
                    else {
                        $rootScope.Youtube.Videos = [];
                    }
                });
            }
            , RemoveAll: function () {
                $rootScope.Loader.PageLoader.Show();
                chrome.storage.local.remove("Youtube", function () {
                    $rootScope.Notify.Notification(null, "Youtube videos deleted.", $rootScope.Notify.NotifyType.Warning);
                    $rootScope.RefreshData();
                });
            }
            , Remove: function (value) {
                var doesExist = $rootScope.Check.FindObjectInArrayOfObjects($rootScope.Youtube.Videos, value, null, true);
                if (angular.isNumber(doesExist)) {
                    $rootScope.Youtube.Videos.splice(doesExist, 1);
                    $rootScope.Save.SaveDynamic("Youtube video", $rootScope.Youtube.Videos, "Youtube");
                    $rootScope.Notify.Notification(null, "Video removed.", $rootScope.Notify.NotifyType.Warning);
                }
            }
            , youtubeEmbedUtils: youtubeEmbedUtils
            , GetIdFromURL: function (value) {
                return youtubeEmbedUtils.getIdFromURL(value)
            }
            , GetTimeFromURL: function (value) {
                return youtubeEmbedUtils.getTimeFromURL(value)
            }
            , PlayerVars: {
                controls: 2//0 //1 //2
            , autoplay: 0
            , autohide: 0
            , cc_load_policy: 0
            , color: "white"
            , disablekb: 1
            , enablejsapi: 1
                //, end: seconds
            , fs: 1
            , iv_load_policy: 3 //1
            , loop: 0
            , modestbranding: 0
            , rel: 1
            , showinfo: 1
            , theme: "dark" //light
            , origin: (window.location.origin.indexOf(chrome.runtime.id) != -1) ? window.location.origin : "chrome-extension://" + chrome.runtime.id
            }
            , Size: {
                Width: "100%"
                , Heigh: "100%"
            }
        };

        $rootScope.Settings = {
            Options: {
                format: 'yyyy-mm-dd'
                , disable: [true, { from: [1980, 01, 01], to: true }]
                , closeOnSelect: true
                , closeOnClear: true
                , containerHidden: '#hidden-input-outlet'
                , formatSubmit: 'yyyy/mm/dd'
                , labelMonthNext: 'Go to the next month'
                , labelMonthPrev: 'Go to the previous month'
                , labelMonthSelect: 'Pick a month from the dropdown'
                , labelYearSelect: 'Pick a year from the dropdown'
                , selectMonths: true
                , selectYears: true
            }
            , Settings: {
                User: {
                    FirstName: null
               , LastName: null
               , DateOfBirth: null
               , Image: {
                   base64: null
                   , filename: null
                   , filesize: null
                   , filetype: null
               }
                }
                , Visibility: {
                    ClearData: "true"
                   , Backgrounds: "true"
                   , Local: "false"
                   , LiveEdit: "false"
                   , Shipment: "false"
                   , BlockedUrls: "true"
                   , Colors: "true"
                   , Youtube: "false"
                   , WelcomeScreen: "true"
                   , Footer: "true"
                   , AppList: "true"
                   , InsertCSS: "true"
                   , ChromeLinks: "true"
                   , FooterFavorites: "true"
                   , NavType: "navbar-fixed-top"
                   , LinksSizeExtraSmall: "col-xs-3"
                   , LinksSizeSmall: "col-sm-2"
                   , LinksSizeMedium: "col-md-1"
                   , AppsSizeExtraSmall: "col-xs-3"
                   , AppsSizeSmall: "col-sm-2"
                   , AppsSizeMedium: "col-md-1"
                   , WelcomePageTimer: 30
                    ,Downloads:"false"
                }
            }
            , DefaultSettings: {
                User: {
                    FirstName: null
               , LastName: null
               , DateOfBirth: null
                    , Image: {
                        base64: null
                  , filename: null
                  , filesize: null
                  , filetype: null
                    }
                }
                , Visibility: {
                    ClearData: "true"
                   , Backgrounds: "true"
                   , Local: "false"
                   , LiveEdit: "false"
                   , Shipment: "false"
                   , Colors: "BlockedUrls"
                   , Colors: "true"
                   , Youtube: "false"
                   , WelcomeScreen: "true"
                   , Footer: "true"
                   , AppList: "true"
                   , InsertCSS: "true"
                   , ChromeLinks: "true"
                   , FooterFavorites: "true"
                   , NavType: "navbar-fixed-top"
                   , LinksSizeExtraSmall: "col-xs-3"
                   , LinksSizeSmall: "col-sm-2"
                   , LinksSizeMedium: "col-md-1"
                   , AppsSizeExtraSmall: "col-xs-3"
                   , AppsSizeSmall: "col-sm-2"
                   , AppsSizeMedium: "col-md-1"
                   , WelcomePageTimer: 30
                    ,Downloads:"false"
                }
            }
            , Select: {
                YesNo: [{ Title: "Yes", Value: "true" }, { Title: "No", Value: "false" }]
                , NavType: [{ Title: "Fixed", Value: "navbar-fixed-top" }, { Title: "Not Fixed", Value: "" }]
                , SizesMD: [{ Title: "1", Value: "col-md-1" }, { Title: "2", Value: "col-md-2" }, { Title: "3", Value: "col-md-3" }, { Title: "4", Value: "col-md-4" }, { Title: "5", Value: "col-md-5" }, { Title: "6", Value: "col-md-6" }, { Title: "7", Value: "col-md-7" }, { Title: "8", Value: "col-md-8" }, { Title: "9", Value: "col-md-9" }, { Title: "10", Value: "col-md-10" }, { Title: "11", Value: "col-md-11" }, { Title: "12", Value: "col-md-12" }]
                , SizesSM: [{ Title: "1", Value: "col-sm-1" }, { Title: "2", Value: "col-sm-2" }, { Title: "3", Value: "col-sm-3" }, { Title: "4", Value: "col-sm-4" }, { Title: "5", Value: "col-sm-5" }, { Title: "6", Value: "col-sm-6" }, { Title: "7", Value: "col-sm-7" }, { Title: "8", Value: "col-sm-8" }, { Title: "9", Value: "col-sm-9" }, { Title: "10", Value: "col-sm-10" }, { Title: "11", Value: "col-sm-11" }, { Title: "12", Value: "col-sm-12" }]
                , SizesXS: [{ Title: "1", Value: "col-xs-1" }, { Title: "2", Value: "col-xs-2" }, { Title: "3", Value: "col-xs-3" }, { Title: "4", Value: "col-xs-4" }, { Title: "5", Value: "col-xs-5" }, { Title: "6", Value: "col-xs-6" }, { Title: "7", Value: "col-xs-7" }, { Title: "8", Value: "col-xs-8" }, { Title: "9", Value: "col-xs-9" }, { Title: "10", Value: "col-xs-10" }, { Title: "11", Value: "col-xs-11" }, { Title: "12", Value: "col-xs-12" }]
            }
            , SaveVisibility: function () {
                if (angular.isNumber($rootScope.Settings.Settings.Visibility.WelcomePageTimer)) {
                    if ($rootScope.Settings.Settings.Visibility.WelcomePageTimer < 15) {
                        $rootScope.Notify.Notification(null, "Welcome Page Timer cannot be less than 15 seconds", $rootScope.Notify.NotifyType.Warning);
                        $rootScope.Settings.Settings.Visibility.WelcomePageTimer = $rootScope.Settings.DefaultSettings.Visibility.WelcomePageTimer;
                    }
                    else {
                        $rootScope.Loader.PageLoader.Show();
                        $rootScope.Save.SaveDynamic("visibility", $rootScope.Settings.Settings.Visibility, "Visibility");

                        if (!$rootScope.Utils.ParseBool($rootScope.Settings.Settings.Visibility.Backgrounds)) {
                            $rootScope.Background.RemoveAll();
                            $rootScope.Background.ChangeBackground("/images/defaultbackground.png")
                        }
                        if (!$rootScope.Utils.ParseBool($rootScope.Settings.Settings.Visibility.Shipment)) {
                            $rootScope.Shipment.RemoveAll();
                        }
                        if (!$rootScope.Utils.ParseBool($rootScope.Settings.Settings.Visibility.Colors)) {
                            $rootScope.Colors.Save($rootScope.Colors.Text, $rootScope.Colors.Background, $rootScope.Colors.Opacity);
                        }
                        if (!$rootScope.Utils.ParseBool($rootScope.Settings.Settings.Visibility.Youtube)) {
                            $rootScope.Youtube.RemoveAll();
                        }
                    }
                }
                else {
                    $rootScope.Notify.Notification(null, "Welcome Page Timer should be a number", $rootScope.Notify.NotifyType.Warning);
                    $rootScope.Settings.Settings.Visibility.WelcomePageTimer = $rootScope.Settings.DefaultSettings.Visibility.WelcomePageTimer;
                }
            }
            , GetVisibility: function () {
                chrome.storage.local.get("Visibility", function (visibility) {
                    if (visibility.Visibility != undefined && visibility.Visibility != null) {
                        $rootScope.Settings.Settings.Visibility = visibility.Visibility;
                        $rootScope.Settings.LinksSizeExtraSmall = parseInt($rootScope.Settings.Settings.Visibility.LinksSizeExtraSmall.replace("col-xs-",""));
                        $rootScope.Settings.LinksSizeSmall = parseInt($rootScope.Settings.Settings.Visibility.LinksSizeSmall.replace("col-sm-", ""));
                        $rootScope.Settings.LinksSizeMedium = parseInt($rootScope.Settings.Settings.Visibility.LinksSizeMedium.replace("col-md-", ""));
                        $rootScope.Settings.AppsSizeExtraSmall = parseInt($rootScope.Settings.Settings.Visibility.AppsSizeExtraSmall.replace("col-xs-", ""));
                        $rootScope.Settings.AppsSizeSmall = parseInt($rootScope.Settings.Settings.Visibility.AppsSizeSmall.replace("col-sm-", ""));
                        $rootScope.Settings.AppsSizeMedium = parseInt($rootScope.Settings.Settings.Visibility.AppsSizeMedium.replace("col-md-", ""));
                    }
                });
            }
            , ToDefaultVisibility: function () {
                $rootScope.Settings.Settings.Visibility = $rootScope.Settings.DefaultSettings.Visibility;
                $rootScope.Settings.SaveVisibility();
            }
            , SaveUser: function () {
                $rootScope.Loader.PageLoader.Show();
                $rootScope.Save.SaveDynamic("user info", $rootScope.Settings.Settings.User, "User");
            }
            , GetUser: function () {
                chrome.storage.local.get("User", function (user) {
                    if (user.User != undefined && user.User != null) {
                        $rootScope.Settings.Settings.User = user.User;
                    }
                });
            }
            , RemoveLink: function (link) {
            }
            , RemoveLinks: function () {
            }
            , LinksOptionsExtraSmall: {
                floor: 0,
                ceil: 12,
                step: 1,
                showSelectionBar: true,
                onChange: function (sliderId, modelValue, highValue, pointerType) {
                    $rootScope.Settings.Settings.Visibility.LinksSizeExtraSmall = "col-xs-" + modelValue;
                }
            }
            , LinksOptionsSmall: {
                floor: 0,
                ceil: 12,
                step: 1,
                showSelectionBar: true,
                onChange: function (sliderId, modelValue, highValue, pointerType) {
                    $rootScope.Settings.Settings.Visibility.LinksSizeSmall = "col-sm-" + modelValue;

                }
            }
            , LinksOptionsMedium: {
                floor: 0,
                ceil: 12,
                step: 1,
                showSelectionBar: true,
                onChange: function (sliderId, modelValue, highValue, pointerType) {
                    $rootScope.Settings.Settings.Visibility.LinksSizeMedium = "col-md-" + modelValue;
                }
            }
            , AppsOptionsExtraSmall: {
                floor: 0,
                ceil: 12,
                step: 1,
                showSelectionBar: true,
                onChange: function (sliderId, modelValue, highValue, pointerType) {
                    $rootScope.Settings.Settings.Visibility.AppsSizeExtraSmall = "col-xs-" + modelValue;
                }
            }
            , AppsOptionsSmall: {
            floor: 0,
            ceil: 12,
            step: 1,
            showSelectionBar: true,
            onChange: function (sliderId, modelValue, highValue, pointerType) {
                $rootScope.Settings.Settings.Visibility.AppsSizeSmall = "col-sm-" + modelValue;

            }
        }
            , AppsOptionsMedium: {
            floor: 0,
            ceil: 12,
            step: 1,
            showSelectionBar: true,
            onChange: function (sliderId, modelValue, highValue, pointerType) {
                $rootScope.Settings.Settings.Visibility.AppsSizeMedium = "col-md-" + modelValue;
            }
            }
            , LinksSizeExtraSmall: 0
            , LinksSizeSmall: 0
            , LinksSizeMedium: 0
            , AppsSizeExtraSmall: 0
            , AppsSizeSmall: 0
            , AppsSizeMedium: 0
        };


        $rootScope.Welcome = {
            Show: function () {
                $rootScope.Welcome.InputPassword = false;
                $rootScope.Welcome.Visibile = "showwelcome";
            }
          , Hide: function () {
              if (isDataLoaded) {
                  if ($rootScope.Check.IsStringFilled($rootScope.Password.Passwords.Password)) {
                      $rootScope.Welcome.InputPassword = true;
                  }
                  else {
                      $rootScope.Welcome.Visibile = "";
                  }
              }
          }
            , ForceHide: function () {
                $rootScope.Welcome.InputPassword = false;
                $rootScope.Welcome.Visibile = "";
            }
          , InputPassword: false
          , GetInputPassword: function () {
              return $rootScope.Welcome.InputPassword;
          }
          , MouseMove: function () {
          }
          , Timeout: function () {
              $rootScope.Welcome.Show();
          }
          , Visibile: ""
          , Visibility: function () {
              return $rootScope.Welcome.Visibile;
          }
          , SetDetectionInterval: function (seconds) {
              if (!seconds) { seconds = $rootScope.Settings.Settings.Visibility.WelcomePageTimer; }
              chrome.idle.setDetectionInterval(seconds);
          }
          , Clock: function () {
              return $rootScope.dateTimeClock;
          }
          , Time: function () {
              return $rootScope.timeClock;
          }
          , Date: function () {
              return $rootScope.dateClock;
          }

            /*
             User: {
                    FirstName: null
               , LastName: null
               , DateOfBirth: null
               , Image: {
                   base64: null
                   , filename: null
                   , filesize: null
                   , filetype: null
               }
            */


          , Quote: function () {
              switch ($rootScope.ampmQuote.toLowerCase()) {
                  case "am":
                      switch ($rootScope.hourQuote) {
                          case "12":
                          case "1":
                          case "2":
                          case "3":
                          case "4":
                              return "Sleep Time"
                              break;
                          case "5":
                          case "6":
                          case "7":
                          case "8":
                          case "9":
                          case "10":
                          case "11":
                              return "Good Morning"
                              break;
                          default:
                              return "Good Day"
                              break;
                      }
                      break;
                  case "pm":
                      switch ($rootScope.hourQuote) {
                          case "12":
                              return "It's Noon"
                              break;
                          case "1":
                          case "2":
                          case "3":
                              return "Good Afternoon"
                              break;
                          case "4":
                          case "5":
                          case "6":
                              return "It's pre Evening"
                              break;
                          case "7":
                          case "8":
                              return "Good Evening"
                              break;
                          case "9":
                          case "10":
                          case "11":
                              return "Good Night";
                              break;
                          default:
                              return "Hello Dear";
                              break;
                      }
                      break;
                  default:
                      break;
              }
          }
        , QuoteWrapper: function () {
            return ($rootScope.Settings.Settings.User.FirstName) ?
         $rootScope.Welcome.Quote() + " " + $rootScope.Settings.Settings.User.FirstName
                : $rootScope.Welcome.Quote();
        }
        };

        $rootScope.Password = {
            Passwords: {
                OldPassword: null
                , Password: null
                , RepeatPassword: null
                , LockOnLoad: false
            }
            , LoginPassword: null
            , Select: {
                TrueFalse: [{ Title: "Yes", Value: true }, { Title: "No", Value: false }]
            }
            , Unlock: function (value) {
                if ($rootScope.Password.Passwords.Password == value) {
                    $rootScope.Welcome.Visibile = "";
                    $rootScope.Welcome.InputPassword = false;
                }
                else {
                    $rootScope.Notify.Notification(null, "Wrong password", $rootScope.Notify.NotifyType.Error);
                }
            }
            , ValidPassword: function () {
                if ($rootScope.Password.Passwords.Password == $rootScope.Password.Passwords.RepeatPassword && $rootScope.Password.TestPasswordRegex()) {
                    return true;
                }
                return false;
            }
            , NotValidPassword: function () {
                return !$rootScope.Password.ValidPassword();
            }
            , KeyUp: function (event, loginPassword) {
                if (event.keyCode == 13) {
                    $rootScope.Password.Unlock(loginPassword);
                }
            }
            , Regex: /([a-zA-Z]+[a-zA-Z0-1@#$_&*()+-/?!;:^%~]+)/
            , TestRegex: function (value) {
                var match = $rootScope.Password.Regex.exec(value, "i");
                return match
            }
            , TestPasswordRegex: function () {
                return $rootScope.Password.TestRegex($rootScope.Password.Passwords.Password);
            }
            , Save: function () {
                $rootScope.Loader.PageLoader.Show();
                if ($rootScope.Password.ValidPassword()) {
                    $rootScope.Password.Passwords.LockOnLoad = $rootScope.Utils.ToBool($rootScope.Password.Passwords.LockOnLoad);
                    $rootScope.Save.SaveDynamic("password", $rootScope.Password.Passwords, "Passwords");
                }
                else {
                    $rootScope.Loader.PageLoader.Hide();
                    $rootScope.Notify.Notification(null, "Password invalid, nothing was updated.", $rootScope.Notify.NotifyType.Warning);
                }
            }
            , Get: function () {
                chrome.storage.local.get("Passwords", function (password) {
                    if (password.Passwords != undefined && password.Passwords != null) {
                        $rootScope.Password.Passwords = password.Passwords;
                        $rootScope.Password.Passwords.LockOnLoad = $rootScope.Utils.ToBool($rootScope.Password.Passwords.LockOnLoad);
                        if ($rootScope.Check.IsStringFilled($rootScope.Password.Passwords.Password)) {
                            if (!$rootScope.Password.Passwords.LockOnLoad) {
                                $rootScope.Welcome.ForceHide();
                            }
                        }
                        else {
                            $rootScope.Welcome.ForceHide();
                        }
                    } else {
                        $rootScope.Welcome.ForceHide();
                    }
                    isDataLoaded = true;
                });
            }
        };

        $rootScope.Angular = {
            sce: $sce
            , params: $stateParams
            , location: $location
            , state: $state
            , http: $http
            , interval: $interval
            , timeout: $timeout
            , Notification: Notification
            , log: $log
            , baseUrl: base_url
            , baseServicesUrl: base_url_user_services
            , filter: $filter
            , youtubeEmbedUtils: youtubeEmbedUtils
        };

        $rootScope.DeleteAll = function () {
            chrome.storage.local.remove("Youtube", function () { });
            chrome.storage.local.remove("Location", function () { });
            chrome.storage.local.remove("Colors", function () { });
            chrome.storage.local.remove("Shipment", function () { });
            chrome.storage.local.remove("BackgroundUrl", function () { });
            chrome.storage.local.remove("Backgrounds", function () { });
            chrome.storage.local.remove("Visibility", function () { });
            $rootScope.RefreshData();
        };
        //$rootScope.DeleteAll();//Youtube//DesktopprPaging//Desktoppr//Bing//Unsplash//Location//Colors//Shipment//BackgroundUrl//Backgrounds//Links//

        $rootScope.Embed = {
            FilterOption: {
                fontSmiley: true,      //convert ascii smileys into font smileys
                emoji: true,      //convert emojis short names into images
                link: true,      //convert links into anchor tags
                linkTarget: '_self',   //_blank|_self|_parent|_top|framename
                pdf: {
                    embed: true                 //to show pdf viewer.
                },
                image: {
                    embed: false                //to allow showing image after the text gif|jpg|jpeg|tiff|png|svg|webp.
                },
                audio: {
                    embed: true                 //to allow embedding audio player if link to
                },
                code: {
                    highlight: true,        //to allow code highlighting of code written in markdown
                    lineNumbers: false        //to show line numbers
                },
                basicVideo: false,     //to allow embedding of mp4/ogg format videos
                video: {
                    embed: false,    //to allow youtube/vimeo video embedding
                    width: null,     //width of embedded player
                    height: null,     //height of embedded player
                    ytTheme: 'dark',   //youtube player theme (light/dark)
                    details: false,    //to show video details (like title, description etc.)
                    autoPlay: true,     //to autoplay embedded videos
                },
                twitchtvEmbed: true,
                dailymotionEmbed: true,
                tedEmbed: true,
                dotsubEmbed: true,
                liveleakEmbed: true,
                soundCloudEmbed: true,
                soundCloudOptions: {
                    height: 160, themeColor: 'f50000',   //Hex Code of the player theme color
                    autoPlay: false,
                    hideRelated: false,
                    showComments: true,
                    showUser: true,
                    showReposts: false,
                    visual: false,         //Show/hide the big preview image
                    download: false          //Show/Hide download buttons
                },
                spotifyEmbed: true,
                codepenEmbed: true,        //set to true to embed codepen
                codepenHeight: 300,
                jsfiddleEmbed: true,        //set to true to embed jsfiddle
                jsfiddleHeight: 300,
                jsbinEmbed: true,        //set to true to embed jsbin
                jsbinHeight: 300,
                plunkerEmbed: true,        //set to true to embed plunker
                githubgistEmbed: true,
                ideoneEmbed: true,        //set to true to embed ideone
                ideoneHeight: 300
            }
        };

        $rootScope.Notes = {
            Note: {
                Id: null
            , Title: null
            , Value: null
            , Date: null
            , Tags: []
            }
            , Notes: []
            , AlarmNote: {
                Id: null
            , Title: null
            , Value: null
            , Date: null
            , Tags: []
            }
            , IsValid: function () {
                return ($rootScope.Check.IsStringFilled($rootScope.Notes.Note.Value))
            }
            , NotValid: function () {
                return !$rootScope.Notes.IsValid();
            }
            , Save: function () {
                $rootScope.Loader.PageLoader.Show();
                if ($rootScope.Notes.IsValid()) {
                    $rootScope.Notes.Note.Id = $rootScope.Utils.Generate.RandomString(8, 4) + "-" + $rootScope.Utils.Generate.Guid();
                    var doesExist = $rootScope.Check.FindObjectInArrayOfObjects($rootScope.Notes.Notes, $rootScope.Notes.Note, null, true);
                    if (!angular.isNumber(doesExist)) {
                        $rootScope.Notes.Notes.push(angular.copy($rootScope.Notes.Note));
                        $rootScope.Save.SaveDynamic("note", $rootScope.Notes.Notes, "Notes");
                        $rootScope.Notes.AddAlarm(angular.copy($rootScope.Notes.Note));
                        $rootScope.Notes.Note.Id = null;
                        $rootScope.Notes.Note.Title = null;
                        $rootScope.Notes.Note.Value = null;
                        $rootScope.Notes.Note.Date = null;
                        $rootScope.Notes.Note.Tags = null;
                        $rootScope.RefreshData();
                    } else {
                        $rootScope.Notify.Notification(null, "Failed to add note, it already exists.", $rootScope.Notify.NotifyType.Error);
                    }
                }
                else {
                    $rootScope.Loader.PageLoader.Hide();
                    $rootScope.Notify.Notification(null, "Note invalid, nothing was updated.", $rootScope.Notify.NotifyType.Warning);
                }
            }
            , AddAlarm: function (value) {
                chrome.alarms.get(value.Id, function (alarm) {
                    if (!alarm) {
                        if (!!value.Date) {
                            chrome.alarms.create(value.Id, { when: new Date(value.Date).getTime() });
                        }
                        else {
                            chrome.alarms.create(value.Id, { when: null });
                        }
                    }
                });
            }
            , ClearAlarm: function (value) {
                chrome.alarms.clear(value, function (wasCleared) {
                    if (wasCleared) {
                    }
                });
            }
            , ClearAllAlarm: function () {
                chrome.alarms.clearAll(function (wasCleared) {
                    if (wasCleared) {
                    }
                });
            }
            , Get: function () {
                chrome.storage.local.get("Notes", function (notes) {
                    if (notes.Notes != undefined && notes.Notes != null) {
                        $rootScope.Notes.Notes = notes.Notes;
                        //$rootScope.Notes.CheckMissedAlarms();
                    }
                    else {
                        $rootScope.Notes.Notes = [];
                    }
                });
            }
            , RemoveAll: function () {
                $rootScope.Loader.PageLoader.Show();
                chrome.storage.local.remove("Notes", function () {
                    $rootScope.Notify.Notification(null, "Notes deleted.", $rootScope.Notify.NotifyType.Warning);
                    $rootScope.RefreshData();
                });
            }
            , Remove: function (value) {
                var doesExist = $rootScope.Check.FindObjectInArrayOfObjects($rootScope.Notes.Notes, value, null, true);
                if (angular.isNumber(doesExist)) {
                    $rootScope.Notes.Notes.splice(doesExist, 1);
                    $rootScope.Save.SaveDynamic("note", $rootScope.Notes.Notes, "Notes");
                    $rootScope.Notify.Notification(null, "note removed.", $rootScope.Notify.NotifyType.Warning);
                }
                $('#alarmnote').modal('hide');
            }
            , CheckMissedAlarms: function () {
                chrome.alarms.getAll(function (alarms) {
                    angular.forEach(alarms, function (value, key) {
                        var timeDiff = (value.scheduledTime - new Date().getTime());
                        if (timeDiff < 0) {
                            $rootScope.Notes.MissedAlarms.push(value.name);
                        }
                    });
                    // show model of missed alarms
                });
            }
            , MissedAlarms: []
            , Aralm: function (id) {
                var watchalarms = $rootScope.$watch(function ($rootScope) { return ($rootScope.Notes && $rootScope.Notes.Notes) ? $rootScope.Notes.Notes : [] }, function (newValue, oldValue) {
                    if (newValue != oldValue && newValue) {
                        var indexOfObject = $rootScope.Check.FindStringInArrayOfObjects($rootScope.Notes.Notes, id, "Id");
                        if (angular.isNumber(indexOfObject)) {
                            $rootScope.Notes.AlarmNote = $rootScope.Notes.Notes[indexOfObject];
                            $('#alarmnote').modal({ show: true, keyboard: true })
                            //$('#alarmnote').modal('hide')
                            $rootScope.Sounds.MilitaryTelephone.play();
                            watchalarms();
                        }
                    }
                });
            }
            , DateType: function (value) {
                if (!value || (typeof value == "object" && !value._isAMomentObject)) {
                    return "panel-default";
                }
                else {
                    var timeDiff = (moment(value) - moment());
                    if (timeDiff < -60000) {
                        return "panel-danger";
                    }
                    else if (timeDiff > 60000) {
                        return "panel-success";
                    }
                    else {
                        return "panel-warning";
                    }
                }
            }
        };
        $rootScope.sound = ngAudio.load("audio/button-4.mp3");
        $rootScope.Sounds = {
            MilitaryTelephone: ngAudio.load("audio/military_telephone.mp3")
        };

        $rootScope.History = {
            Search: function () {
                $rootScope.History.Histories = [];
                var microseconds = 1000 * 60 * 60 * 24 * 7 * 4;
                var oneWeekAgo = (new Date).getTime() - microseconds;
                chrome.history.search({ 'text': '', 'startTime': oneWeekAgo }, function (historyItems) {
                    for (var i = 0; i < historyItems.length; ++i) {
                        var url = historyItems[i].url;
                        var title = historyItems[i].title;
                        var visitCount = historyItems[i].visitCount;
                        if (!!url && !!title) {
                            $rootScope.History.Histories.push({ Title: title, Value: url, VisitCount: visitCount });
                        }
                    }
                });
            },
            Histories: [],
            History: {
                Title: "",
                Value: "",
                VisitCount: ""
            },
            HistoryClick: function (value) {
                chrome.tabs.create({
                    selected: true,
                    url: value
                });
            }
        };


        $rootScope.ChromeApps = {
            AppList: []
            , App: {
                AppLaunchUrl: ""
                , AvailableLaunchTypes: []
                , Description: ""
                , HomepageUrl: ""
                , Icons: [
                          { Size: 16, URL: "" },
                          { Size: 128, URL: "" }
                ]
                , Id: ""
                , LaunchType: ""
                , Name: ""
                , ShortName: ""
            }
            , LaunchApp: function (id) {
                chrome.management.launchApp(id);
                window.close();
            }
            , GetApps: function () {
                $rootScope.ChromeApps.AppList = [];
                if ($rootScope.ChromeApps.Visibility()) {
                    chrome.management.getAll(function (info) {
                        for (var i = 0; i < info.length; i++) {
                            var app = angular.copy(info[i]);
                            if (app.isApp && app.enabled) {
                                var tempApp = {
                                    AppLaunchUrl: app.appLaunchUrl
                                    , AvailableLaunchTypes: app.availableLaunchTypes
                                    , Description: app.description
                                    , HomepageUrl: app.homepageUrl
                                    , Icons: ""
                                    , Id: app.id
                                    , LaunchType: app.launchType
                                    , Name: app.name
                                    , ShortName: app.shortName
                                };
                                var size = 0;
                                angular.forEach(app.icons, function (value, key) {
                                    if (value.size > size) {
                                        tempApp.Icons = value.url;
                                    }
                                });
                                $rootScope.ChromeApps.AppList.push(tempApp);
                            }
                        }
                    });
                }
            }
            , Visibility: function () {
                return $rootScope.Settings.Settings.Visibility.AppList;
            }
        };


        $rootScope.HeaderButtons = {
            targetWindow: null
         , tabCount: 0
         , MergeWindows: function () {
             chrome.windows.getCurrent(function (win) {
                 $rootScope.HeaderButtons.targetWindow = win;
                 chrome.tabs.getAllInWindow($rootScope.HeaderButtons.targetWindow.id, function (tabs) {
                     $rootScope.HeaderButtons.tabCount = tabs.length;
                     // We require all the tab information to be populated.
                     chrome.windows.getAll({ "populate": true }, function (windows) {
                         var numWindows = windows.length;
                         var tabPosition = $rootScope.HeaderButtons.tabCount;

                         for (var i = 0; i < numWindows; i++) {
                             var win = windows[i];

                             if ($rootScope.HeaderButtons.targetWindow.id != win.id) {
                                 var numTabs = win.tabs.length;

                                 for (var j = 0; j < numTabs; j++) {
                                     var tab = win.tabs[j];
                                     // Move the tab into the window that triggered the browser action.
                                     chrome.tabs.move(tab.id,
                                         { "windowId": $rootScope.HeaderButtons.targetWindow.id, "index": tabPosition });
                                     tabPosition++;
                                 }
                             }
                         }
                     });
                 });
             });
         }
        };

        $rootScope.CaptureScreenshot = {
            Capture: function () {
                chrome.tabs.captureVisibleTab(function (screenshotUrl) {
                    chrome.tabs.create({ url: screenshotUrl }, function (tab) {
                        targetId = tab.id;
                    });
                });
            }
        };



        $rootScope.DownloadManager = {
            Search: function () {
                //"in_progress", "interrupted", or "complete"
              


                var downloadsTodayeDate = new Date();
                downloadsTodayeDate.setDate(downloadsTodayeDate.getDate() - $rootScope.DownloadManager.DownloadDays);
                chrome.downloads.search({}, function (results) {
                    var _Downloads = [];
                    var _DownloadsInProgress = [];
                    var _DownloadsInterrupted = [];
                    var _DownloadsComplete = [];
                    var _DownloadsPaused = [];


                    angular.forEach(results, function (value, key) {
                        var download = angular.copy($rootScope.DownloadManager.Download);
                        download.BytesReceived = value.bytesReceived;
                        download.CanResume = value.canResume;
                        download.Danger = value.danger;
                        download.EndTime = value.endTime;
                        download.Exists = value.exists;
                        download.FileSize = value.fileSize;
                        download.Filename = value.filename;
                        download.FinalUrl = value.finalUrl;
                        download.Id = value.id;
                        download.Incognito = value.incognito;
                        download.Mime = value.mime;
                        download.Paused = value.paused;
                        download.Referrer = value.referrer;
                        download.StartTime = value.startTime;
                        download.State = value.state;
                        download.TotalBytes = value.totalBytes;
                        download.URL = value.url;
                        download.EstimatedEndTime = value.estimatedEndTime;
                        download.Progress = $rootScope.DownloadManager.DownloadProgress(value.bytesReceived, value.totalBytes);

                        if (download.State == "complete") {
                            _DownloadsComplete.push(download);
                        }
                        if (download.State == "interrupted") {
                            _DownloadsInterrupted.push(download);
                        }
                        if (download.State == "in_progress") {
                            if (download.Paused) {
                                _DownloadsPaused.push(download);
                            } else {
                                _DownloadsInProgress.push(download);
                            }
                        }
                        _Downloads.push(download);
                    });
                    $rootScope.DownloadManager.Downloads = _Downloads;
                    $rootScope.DownloadManager.DownloadsInProgress = _DownloadsInProgress;
                    $rootScope.DownloadManager.DownloadsInterrupted = _DownloadsInterrupted;
                    $rootScope.DownloadManager.DownloadsComplete = _DownloadsComplete;
                    $rootScope.DownloadManager.DownloadsPaused = _DownloadsPaused;
                });
            }
            , DownloadDays: 5
            , Downloads: []
            , DownloadsInProgress: []
            , DownloadsInterrupted: []
            , DownloadsComplete: []
            , DownloadsPaused: []
            , Download: {
                BytesReceived: 0,
                CanResume: false,
                Danger: ""/*safe*/,
                EndTime: "",
                Exists: true,
                FileSize: 0,
                Filename: "",
                FinalUrl: "",
                Id: 0,
                Incognito: false,
                Mime: "",
                Paused: false,
                Referrer: "",
                StartTime: "",
                State: "",
                TotalBytes: 0,
                URL: "",
                EstimatedEndTime: "",
                Progress: 0,
            }
            , Pause: function (download) {
                if (download.State == 'in_progress' && !download.CanResume) {
                    chrome.downloads.pause(download.Id, function () { })
                }
            }
            , Resume: function (download) {
                if (download.State == 'in_progress' && download.CanResume) {
                    chrome.downloads.resume(download.Id, function () { })
                }
            }
            , Cancel: function (download) {
                chrome.downloads.cancel(download.Id, function () { })
            }
            , GetFileIcon: function (download) {
                chrome.downloads.getFileIcon(download.Id, function (iconURL) {

                })
            }
            , Open: function (download) {
                if (download.State == "complete") {
                    chrome.downloads.open(download.Id);
                }
            }
            , Show: function (download) {
                if (download.State == "complete") {
                    chrome.downloads.open(download.Id)
                }
            }
            , ShowDefaultFolder: function () {
                chrome.downloads.showDefaultFolder()
            }
            , Erase: function (download) {
                chrome.downloads.erase({ id: download.Id }, function (erasedIds) {

                });
            }
            , Delete: function (download) {
                if (download.State == "complete") {
                    chrome.downloads.removeFile(download.Id, function () {

                    });
                }
            }
            , DownloadProgress: function (bytesReceived, totalBytes) {
                if (!!bytesReceived && bytesReceived >= 0 && !!totalBytes && totalBytes > 0)
                { return (100 * bytesReceived) / totalBytes; }
                else
                { return 0; }
            }
            , SearchInterval: function () {
                if ($scope.Settings.Settings.Visibility.Downloads == "true") {
                    $scope.stopDownloadInterval = $interval(function () {
                        if ($state.current.name == "home")
                        {
                            $rootScope.DownloadManager.Search();
                        }
                        if ($scope.Settings.Settings.Visibility.Downloads == "false") {
                            $scope.stopDownloadInterval();
                        }
                    }, 1000);
                }
            }
        };


        $rootScope.InsertCSS = {
            InsertCss: function (css) {
                chrome.tabs.insertCSS({ code: css }, function () {
                    if (chrome.runtime.lastError) {
                        $rootScope.Notify.Notification(null, "Failed to apply CSS", $rootScope.Notify.NotifyType.Error);
                    } else {
                        $rootScope.Notify.Notification(null, "Css applied succefully", $rootScope.Notify.NotifyType.Success);
                    }
                });
            }
            , CSS: ""
            , Save: function () {
                $rootScope.Save.SaveDynamic("css", $rootScope.InsertCSS.CSS, "InsertCss");
            }
            , LoadCss: function () {
                chrome.storage.local.get("InsertCss", function (css) {
                    if (css.InsertCss != undefined && css.InsertCss != null) {
                        $rootScope.InsertCSS.CSS = css.InsertCss;
                    }
                    else {
                        $rootScope.InsertCSS.CSS = "";
                    }
                });
            }
            , Get: function () {
                chrome.storage.local.get("InsertCss", function (css) {
                    if (css.InsertCss != undefined && css.InsertCss != null) {
                        $rootScope.InsertCSS.CSS = css.InsertCss;
                        $rootScope.InsertCSS.InsertCss(css.InsertCss);
                    }
                });
            }
        };

        $rootScope.BlockedUrls = {
            BlockedUrls: [],
            BlockedUrl: {
                Title:""
                ,Value:""
                , Whole: "false"
            },
            IsEmpty: function () {
                return (!$rootScope.Check.IsStringFilled($rootScope.BlockedUrls.BlockedUrl.Title)
                 || !$rootScope.Check.IsStringFilled($rootScope.BlockedUrls.BlockedUrl.Value));
            },
            Save: function () {
                $rootScope.Loader.PageLoader.Show();
                var aBlockedUrlsLoading = document.createElement('a');
                aBlockedUrlsLoading.href = $rootScope.BlockedUrls.BlockedUrl.Value.trim();
                var finalUrlBlockedUrlsLoading = aBlockedUrlsLoading.protocol + '//' + aBlockedUrlsLoading.hostname;

                if ($rootScope.BlockedUrls.IsEmpty()) {
                    $rootScope.Notify.FaildToAdd("Blocked link");
                    $rootScope.Loader.PageLoader.Hide();
                    return false;
                }
                if (!$rootScope.Links.TestRegex(finalUrlBlockedUrlsLoading)) {
                    $rootScope.Notify.Notification(null, "URL has wrong format, it should start with http:// or https://", $rootScope.Notify.NotifyType.Error);
                    $rootScope.Loader.PageLoader.Hide();
                    return false;
                }
                $rootScope.BlockedUrls.BlockedUrl.Value = finalUrlBlockedUrlsLoading;
                if (!$rootScope.BlockedUrls.BlockedUrls[finalUrlBlockedUrlsLoading])
                {
                    $rootScope.BlockedUrls.BlockedUrls[finalUrlBlockedUrlsLoading] = angular.copy($rootScope.BlockedUrls.BlockedUrl);
                    $rootScope.Save.SaveDynamic("Blocked Urls", $rootScope.BlockedUrls.BlockedUrls, "BlockedUrls");
                }
                $rootScope.BlockedUrls.BlockedUrl.Title = "";
                $rootScope.BlockedUrls.BlockedUrl.Value = "";
                $rootScope.BlockedUrls.BlockedUrl.Whole = "false";
            },
            Remove: function (value) {
                $rootScope.BlockedUrls.BlockedUrls[value.Value] = undefined;
                $rootScope.Save.SaveDynamic("Blocked Urls", $rootScope.BlockedUrls.BlockedUrls, "BlockedUrls");
            },
            RemoveALL: function (value) {

            },
            Get: function () {
                chrome.storage.local.get("BlockedUrls", function (blockedUrls) {
                    if (!!blockedUrls.BlockedUrls) {
                        $rootScope.BlockedUrls.BlockedUrls = blockedUrls.BlockedUrls;
                    }
                });
            },
            EmptyBlockedUrls: function () {
                $rootScope.BlockedUrls.BlockedUrl.Title = "";
                $rootScope.BlockedUrls.BlockedUrl.Value = "";
                $rootScope.BlockedUrls.BlockedUrl.Whole = "false";
                $rootScope.BlockedUrls.BlockedUrl.Enabled = "true";
            }
        };


        //chrome.tabs.getAllInWindow(function (tabs) {
        //    console.log(tabs.length)
        //    console.log(tabs)
        //    chrome.tabs.create({ index: 0, active: true, selected: true }, function (tab) {

        //    });
        //});


        //DateObject {
        //    utcDateValue: Number - UTC time value of this date object. It does NOT contain time zone information so take that into account when comparing to other dates (or use localDateValue function).
        //        localDateValue: FUNCTION that returns a Number - local time value of this date object - same as moment.valueOf() or Date.getTime().
        //            display: String - the way this value will be displayed on the calendar.
        //            active: true | false | undefined - indicates that date object is part of the model value.
        //            selectable: true | false | undefined - indicates that date value is selectable by the user.
        //            past: true | false | undefined - indicates that date value is prior to the date range of the current view.
        //            future: true | false | undefined - indicates that date value is after the date range of the current view.
        //    }

        $rootScope.data = {};

        chrome.idle.onStateChanged.addListener(function (newState) {
            if (newState == "idle") {
                $rootScope.Welcome.Timeout();
            }
            else if (newState == "locked") {
                $rootScope.Welcome.Timeout();
            }
            else if (newState == "active") {
                $timeout.cancel(stopWelccome);
                stopWelccome = null;
            }
        });
        $rootScope.Welcome.SetDetectionInterval();
        var _updateClock = function () {
            $('.showDateTimeNow').html(moment().format('dddd, MMMM DD, YYYY hh:mm:ss A'));
        }

        /*
           $scope.$on('youtube.player.ready', function ($event, player) {
           });
           $scope.$on('youtube.player.playing', function ($event, player) {
           });
           $scope.$on('youtube.player.paused', function ($event, player) {
           });
           $scope.$on('youtube.player.buffering', function ($event, player) {
           });
           $scope.$on('youtube.player.queued', function ($event, player) {
           });
           $scope.$on('youtube.player.error', function ($event, player) {
           });
           $scope.$on('youtube.player.ended', function ($event, player) {
               //player.playVideo();
               //player.stopVideo();
           });
           */

        /*
        chrome.alarms.create("zackry", { when: Date.now() + 1 , periodInMinutes: 1 });

        chrome.alarms.getAll(function (alarms) {
            console.log(alarms);
        });

        chrome.alarms.onAlarm.addListener(function (alarm) {
            console.log(alarm);
        });

        chrome.alarms.clear("zackry", function (wasCleared) {
            console.log(wasCleared);
        });

        chrome.alarms.clearAll(function (wasCleared) {
            console.log(wasCleared);
        });
        */

        var paramToObjctFrom = function (url) {
            var vars = [], hash;
            var hashes = url.slice(url.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        };

        //$rootScope.Notify.Notification(null, "Hello zackry", null, 120000, 0, 0);

        var initialize = function () {
            var params = paramToObjct();
            var backupAlarm = paramToObjctFrom(window.location.href);
            if (params != null) {
                if (params.action) {
                    if (params.action === "alarm") {
                        if (params.id) {
                            $rootScope.Notes.Aralm(params.id);
                        }
                    }
                }
            } else {
                if (backupAlarm.action) {
                    if (backupAlarm.action === "alarm") {
                        if (backupAlarm.id) {
                            $rootScope.Notes.Aralm(backupAlarm.id);
                        }
                    }
                }
            }
            //chrome.tabs.getCurrent(function (tab) {
            //    console.log(tab);
            //});
        };

        $rootScope.Welcome.Show();
        $rootScope.RefreshData();
        initialize();


        //chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        //    console.log(tabId);
        //    console.log(changeInfo);
        //    console.log(tab);
        //});


        //$rootScope.Notes.ClearAllAlarm();




        //chrome.storage.local.get("Icons", function (icons) {
        //    console.log(icons.Icons);
        //});



        //var setObjct = {}; setObjct["BlockedUrls"] = {
        //    "https://9gag.com":{Whole:true}
        //};
        //chrome.storage.local.set(setObjct, function () {/*console.log("Saved");*/ });






        //END **** END **** END **** END **** END **** END
        //END **** END **** END **** END **** END **** END
        //END **** END **** END **** END **** END **** END
        //END **** END **** END **** END **** END **** END
        //END **** END **** END **** END **** END **** END
        //END **** END **** END **** END **** END **** END
        //END **** END **** END **** END **** END **** END
        //END **** END **** END **** END **** END **** END
    }]);







