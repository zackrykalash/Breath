appManager.directive("showDateTimeNow", function () {
    var _updateClock = function () {
        $('.showDateTimeNow').html(moment().format('dddd, MMMM DD, YYYY hh:mm:ss A'));
    }
    return {
        restrict: "E",
        templateUrl: "/templates/ShowDateTimeNow.html",
        replace: true,
        transclude: true,
        scope: {},
        controller: function ($scope) {
        },
        link: function (scope, elem, attrs) {
            setInterval(_updateClock, 1000);
        }
    };
});

appManager.directive("zackryFooter", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryFooter.html",
        replace: true,
        transclude: true,
        scope: {
            zshow:"="
        },
        controller: function ($scope) {
            this.parent = "i am dad";
            this.child = "you are my grandchild";
        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive("zackryFooterButtonsList", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryFooterButtonsList.html",
        replace: true,
        transclude: true,
        require: '^zackryFooter',
        scope:{},
        controller: function ($scope) {
        },
        link: function (scope, elem, attrs, zackryFooterCtrl) {
        }
    };
});

appManager.directive("zackryFooterButtons", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryFooterButtons.html",
        replace: true,
        transclude: true,
        require: ['^zackryFooter','^zackryFooterButtonsList'],
        scope:{
            title: '@',
            clickhandler: '&'
        },
        controller: function ($scope) {
        },
        link: function (scope, elem, attrs, zackryFooterButtonsListCtrl) {
        }
    };
});

appManager.directive("zackryClearFloats", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryClearFloats.html",
        replace: true,
        transclude: true,
        scope:{},
        controller: function ($scope) {
        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive("zackryNav", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryNav.html",
        replace: true,
        transclude: true,
        scope:{
            navclass:"@"
        },
        controller: function ($scope) {
        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive("zackryBrand", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryBrand.html",
        replace: true,
        transclude: true,
        controller: function ($scope) {
        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive("zackryNavModalButtons", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryNavModalButtons.html",
        replace: true,
        transclude: true,
        scope:{
            btntype:'@',
            btndatatoggle:'@',
            btndatatarget:'@',
            btntitle:'@',
            btnclass:'@'
        },
        controller: function ($scope) {
        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive("zackryNavModals", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryNavModals.html",
        replace: true,
        transclude: true,
        scope:{
            modalid:'@',
            modaltitle:'@'
        },
        controller: function ($scope) {
        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive("zackryModalButtons", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryModalButtons.html",
        replace: true,
        transclude: true,
        scope: {
            zclass: '@',
            zisfocused: '@',
            zisempty: '@',
            zid: '@',
            zlabel: '@',
            zname: '@',
            ztype: '@',
            zhelp: '@',
            zhref: '@',
            zonclick: '&',
            zonchange: '&',
            zshow: '=',
            zhide: '=',
            zif: '=',
            zmodel: '=',
            zdatatoggle: '@',
            zdatatarget: '@'
        },
        controller: function ($scope) {
        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive("zackryNavButtons", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryNavButtons.html",
        replace: true,
        transclude: true,
        scope:{
            btntype:'@',
            btnhref:'@',
            btntitle:'@',
            btnclass:'@'
        },
        controller: function ($scope) {
        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive("zackryPanel", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryPanel.html",
        replace: true,
        transclude: true,
        scope:{
            paneltitle:'@',
            zclass:'@',
            zshow: '=',
            ztextclass:'@'
        },
        controller: function ($scope) {
            var parseBool = function (value) {
                return (value && ((typeof value == "boolean" && value == true) || (typeof value == "string" && value.toLowerCase() == "true"))) ? true : false;
            }
            $scope.show = function () {
                if ($scope.zshow != undefined && $scope.zshow != null) {
                    return parseBool($scope.zshow)
                }
                else {return true; }
            };
        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive("zackryFormGroupInput", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryFormGroupInput.html",
        replace: true,
        transclude: true,
        scope: {
            zclass: '@',
            ztextclass: '@',
            zisfocused: '@',
            zisempty: '@',
            zid: '@',
            ztype: '@',
            zname: '@',
            zlabel: '@',
            zmodel: '=',
            zshow: '=',
            zhide: '=',
            zif: '=',
            zevent: '=',
            zonchange: '&',
            zonclick: '&',
            zkeyup: '&',
            zhelp: '@'
        },
        controller: function ($scope) {
            $scope.setevent=function(event){
                var watch = $scope.$watch(function ($scope) { return $scope.zevent }, function (newValue, oldValue) {
                    if ((newValue != undefined) && (newValue != null)) {
                        $scope.zkeyup(newValue);
                        watch();
                    }
                });
            };
        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive("zackryFormGroupInputFile", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryFormGroupInputFile.html",
        replace: true,
        transclude: true,
        scope: {
            zclass: '@',
            ztextclass: '@',
            zisfocused: '@',
            zisempty: '@',
            zid: '@',
            ztype: '@',
            zname: '@',
            zlabel: '@',
            zmodel: '=',
            zshow: '=',
            zhide: '=',
            zif: '=',
            zonchange: '&',
            zonclick: '&',
            zkeyup: '&',
            zhelp: '@',
            zmaxsize: '@',
            zminsize: '@',
            zmaxnum: '@',
            zminnum: '@',
            zaccept: '@',
        },
        controller: function ($scope) {
            ///*|video/*|file-extension|media_type|image/*
            $scope.zmodel = {
                base64: null
              , filename: null
              , filesize: null
              , filetype: null
            };
        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive("zackryFormGroupInputFileMultiple", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryFormGroupInputFileMultiple.html",
        replace: true,
        transclude: true,
        scope: {
            zclass: '@',
            ztextclass: '@',
            zisfocused: '@',
            zisempty: '@',
            zid: '@',
            ztype: '@',
            zname: '@',
            zlabel: '@',
            zmodel: '=',
            zshow: '=',
            zhide: '=',
            zif: '=',
            zonchange: '&',
            zonclick: '&',
            zkeyup: '&',
            zhelp: '@',
            zmaxsize: '@',
            zminsize: '@',
            zmaxnum: '@',
            zminnum: '@',
            zaccept: '@',
        },
        controller: function ($scope) {
            ///*|video/*|file-extension|media_type|image/*
            $scope.zmodel = [];
            $scope.titles = function () {
                var titles = "";
                if (angular.isArray($scope.zmodel) && $scope.zmodel.length > 0) {
                    for (var i = 0; i < $scope.zmodel.length ; i++) {
                        if (titles == undefined || titles == null || titles == "") {
                            titles = $scope.zmodel.length + " Image(s): "
                        }

                        if (i == $scope.zmodel.length - 1)
                        { titles += $scope.zmodel[i].filename + ""; }
                        else
                        { titles += $scope.zmodel[i].filename + " | "; }
                    }
                    angular.forEach($scope.zmodel, function (value, key) {
                        titles += value.filename + " |";
                    });
                }
                return titles;
            };
        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive("zackryFormGroupChoiceInput", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryFormGroupChoiceInput.html",
        replace: true,
        transclude: true,
        scope:{
            zclass: '@',
            ztextclass: '@',
            zisfocused:'@',
            zisempty:'@',
            zid:'@',
            ztype:'@',
            zname:'@',
            zlabel:'@',
            zmodel:'=',
            zchoices:'=',
            zinitial:'=',
            zshow:'=',
            zhide:'=',
            zif:'=',
            zonchange:'&',
            zonclick:'&',
            zhelp:'@'
        },
        controller: function ($scope) {
        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive("zackryFormGroupToggle", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryFormGroupToggle.html",
        replace: true,
        transclude: true,
        scope: {
            zclass: '@',
            ztextclass: '@',
            zisfocused: '@',
            zisempty: '@',
            zid: '@',
            ztype: '@',
            zname: '@',
            zlabel: '@',
            zmodel: '=',
            zshow: '=',
            zhide: '=',
            zif: '=',
            zevent: '=',
            zchecked: '=',
            zonchange: '&',
            zonclick: '&',
            zkeyup: '&',
            zhelp: '@',
            ztexton: '@',
            ztextoff: '@',
            zicon: '@'
        },
        controller: function ($scope) {
            //toggle--push toggle--push--glow
            //toggle--text
            //toggle--knob
            //toggle--switch
            //toggle--neon
        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive("zackryFormGroupSelect", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryFormGroupSelect.html",
        replace: true,
        transclude: true,
        scope:{
            zclass: '@',
            ztextclass: '@',
            zisfocused:'@',
            zisempty:'@',
            zid:'@',
            ztype:'@',
            zname:'@',
            zlabel:'@',
            zmodel:'=',
            zchoices:'=',
            zinitial:'=',
            zshow:'=',
            zhide:'=',
            zif:'=',
            zonchange:'&',
            zoncclick:'&',
            zhelp:'@'
        },
        controller: function ($scope) {
            $scope.equals = function (value1, value2) {
                return angular.equals(value1, value2);
            };
        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive("zackryFormGroupSelectMultiple", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryFormGroupSelectMultiple.html",
        replace: true,
        transclude: true,
        scope:{
            zclass: '@',
            ztextclass: '@',
            zisfocused:'@',
            zisempty:'@',
            zid:'@',
            ztype:'@',
            zname:'@',
            zlabel:'@',
            zmodel:'=',
            zchoices:'=',
            zinitial:'=',
            zshow:'=',
            zhide:'=',
            zif:'=',
            zonchange:'&',
            zoncclick:'&',
            zhelp:'@'
        },
        controller: function ($scope) {
        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive("zackryButtons", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryButtons.html",
        replace: true,
        transclude: true,
        scope:{
            zclass:'@',
            zisfocused:'@',
            zisempty:'@',
            zid:'@',
            zlabel:'@',
            zname:'@',
            ztype:'@',
            zhelp:'@',
            zhref:'@',
            zdatadismiss: '@',
            zonclick:'&',
            zonchange:'&',
            zshow:'=',
            zhide:'=',
            zif:'=',
            zmodel: '=',
            zdisabled: '='
        },
        controller: function ($scope) {
        },
        link: function (scope, elem, attrs) {
        }
    };
});


appManager.directive("zackrySimpleButtons", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackrySimpleButtons.html",
        replace: true,
        transclude: true,
        scope: {
            zclass: '@',
            zid: '@',
            zlabel: '@',
            zname: '@',
            ztype: '@',
            zhref: '@',
            zdatadismiss: '@',
            zonclick: '&',
            zonchange: '&',
            zshow: '=',
            zhide: '=',
            zif: '=',
            zmodel: '=',
            zdisabled: '='
        },
        controller: function ($scope) {
        },
        link: function (scope, elem, attrs) {
        }
    };
});


appManager.directive("zackryInputFileUpload", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryInputFileUpload.html",
        replace: true,
        transclude: true,
        scope: {
            zclass: '@',
            zisfocused: '@',
            zisempty: '@',
            zid: '@',
            zlabel: '@',
            zname: '@',
            ztype: '@',
            zhelp: '@',
            zhref: '@',
            zonclick: '&',
            zonchange: '&',
            zshow: '=',
            zhide: '=',
            zif: '=',
            zmodel: '=',
            zmode: '@',
            zcallback: '&'
        },
        controller: function ($scope) {
            $scope.callback = function (file) {
                var watch = $scope.$watch(function ($scope) { return $scope.zmodel }, function (newValue, oldValue) {
                    if ((newValue != undefined) && (newValue != null))
                    {
                        $scope.zcallback(angular.copy(file))
                        watch();
                        $scope.zmodel = undefined;
                    }
                });
            }
        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive('ngThumb', ['$window', function($window) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function(item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function(file) {
            var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function(scope, element, attributes) {
            if (!helper.support) return;

            var params = scope.$eval(attributes.ngThumb);

            if (!helper.isFile(params.file)) return;
            if (!helper.isImage(params.file)) return;

            var canvas = element.find('canvas');
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                var img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
            }

            function onLoadImage() {
                var width = params.width || this.width / this.height * params.height;
                var height = params.height || this.height / this.width * params.width;
                canvas.attr({ width: width, height: height });
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
            }
        }
    };
}]);

appManager.directive("zackryTextarea", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryTextarea.html",
        replace: true,
        transclude: true,
        scope:{
            zclass: '@',
            ztextclass: '@',
            zisfocused:'@',
            zisempty:'@',
            zid:'@',
            ztype:'@',
            zname:'@',
            zlabel:'@',
            zmodel:'=',
            zchoices:'=',
            zinitial:'=',
            zshow:'=',
            zhide:'=',
            zif:'=',
            zonchange:'&',
            zoncclick:'&',
            zhelp:'@',
            zrows:'@'
        },
        controller: function ($scope) {
        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive("zackryEducation", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryEducation.html",
        replace: true,
        transclude: true,
        scope:{
            counter:'@'
        },
        controller: function ($scope) {
        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive("zackryChipdsInput", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryChipdsInput.html",
        replace: true,
        transclude: true,
        scope:{
            ztype: '@'
            , zlabel: '@'
            , zname: '@'
            , zid: '@'
            , zhelp: '@'
            , zbtntitle: '@'
            , zclass: '@'
            , zdivclass: '@'
            , ztextclass: '@'
            , zisfocused: '@'
            , zisempty: '@'
            , zshow: '@'
            , zinputmodel: '='
            ,zarraymodel:'='
        },
        controller: function ($scope, $rootScope) {
            $scope.remove = function(value, index){
                $scope.zarraymodel.splice(index, 1);
                $rootScope.Notify.Notification(value + " removed from " + $scope.zlabel, $rootScope.Notify.NotifyType.Info);
            };
            $scope.add = function(value){
                if ($scope.zinputmodel != undefined && $scope.zinputmodel != null)
                {
                    var exists = false;
                    var tagsLength = $scope.zarraymodel.length;
                    for(var i = 0; i < tagsLength ; i ++)
                    {
                        if ($scope.zarraymodel[i] == $scope.zinputmodel)
                        {
                            exists = true;
                            break;
                        }
                    }
                    if(exists == false)
                    {
                        $scope.zarraymodel.push($scope.zinputmodel);
                        $scope.zinputmodel = null;
                    }
                    else
                    {
                        $rootScope.Notify.Notification($scope.zinputmodel + " already exists in " + $scope.zlabel, $rootScope.Notify.NotifyType.Error);
                    }
                }
                else
                {
                    $rootScope.Notify.Notification($scope.zlabel + " is empty.", $rootScope.Notify.NotifyType.Error);
                }
            };
            $scope.onKeyUp = function (value) {
                if (event.keyCode == 13)
                {
                    $scope.add();
                }
            };
        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive('zackryDatepicker', function() {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryDatepicker.html",
        replace: true,
        transclude: true,
        scope: {
            zclass: '@',
            ztextclass: '@',
            zisfocused: '@',
            zisempty: '@',
            zid: '@',
            ztype: '@',
            zname: '@',
            zlabel: '@',
            zmodel: '=',
            zshow: '=',
            zhide: '=',
            zif: '=',
            zonchange: '&',
            zonclick: '&',
            zkeyup: '&',
            zhelp: '@',
            zformat:'@',
            zoptions:'='
        },
        controller: function ($scope,$filter) {
            //$scope.transformDate = function(input)
            //{
            //    var _dateTitleFormat = $scope.datepickerformat;
            //    if(_dateTitleFormat == null)
            //    {
            //        _dateTitleFormat = "MMM dd yyyy";
            //    }
            //    //'MMM dd yyyy'
            //    var _date = $filter('date')(new Date(input), _dateTitleFormat);
            //    return _date;
            //};
            var _dateTitleFormat = $scope.zformat;
            if(!_dateTitleFormat)
            {
                _dateTitleFormat = "MMM dd yyyy";
            }
            $scope.formatzlable = function(){
                if ($scope.zmodel != undefined && $scope.zmodel != null && $scope.zmodel != "")
                {
                    return $scope.zlabel + " - ( " + $filter('date')(new Date($scope.zmodel), _dateTitleFormat) + " )";
                }
                else
                {
                    return $scope.zlabel;
                }
            };
            $scope.formatzhelp = function(){
                if ($scope.zmodel != undefined && $scope.zmodel != null && $scope.zmodel != "")
                {
                    return $scope.zhelp + " - ( " + $filter('date')(new Date($scope.zmodel), _dateTitleFormat) + " )";
                }
                else
                {
                    return $scope.zhelp;
                }
            };
        },
        link: function (scope, elem, attrs) {
        }
    };
});


appManager.directive('zackryDateTimePicker', function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryDateTimePicker.html",
        replace: true,
        transclude: true,
        scope: {
            zclass: '@',
            ztextclass: '@',
            zisfocused: '@',
            zisempty: '@',
            zid: '@',
            ztype: '@',
            zname: '@',
            ztuggleid: '@',
            ztugglename: '@',
            zlabel: '@',
            zmodel: '=',
            zshow: '=',
            zhide: '=',
            zif: '=',
            zonchange: '&',
            zonclick: '&',
            zkeyup: '&',
            zhelp: '@',
            zformat: '@',
            zoptions: '='
        },
        controller: function ($scope, $filter) {
 
            $scope.validate = function () {
                var m = moment($scope.zmodel);
                if (m.isValid() == false)
                {
                    $scope.clearDate();
                }
            };

            var _dateTitleFormat = "dddd DD MMMM, YYYY hh:mm:ss A";
            if ($scope.zformat) {
                _dateTitleFormat = $scope.zformat;
            }

            $scope.formatzlable = function () {
                if ($scope.zmodel != undefined && $scope.zmodel != null && $scope.zmodel != "") {
                    return $scope.zlabel + " - (  " + moment($scope.zmodel).format(_dateTitleFormat) + " )";
                }
                else {
                    return $scope.zlabel;
                }
            };
            $scope.formatzhelp = function () {
                if ($scope.zmodel != undefined && $scope.zmodel != null && $scope.zmodel != "") {
                    return $scope.zhelp + " - (  " + moment($scope.zmodel).format(_dateTitleFormat) + " )";
                }
                else {
                    return $scope.zhelp;
                }
            };
            $scope.zconfig = {
                configureOn: null
                , dropdownSelector: '#' + $scope.ztuggleid
                , renderOn: 'start-date-changed'
                , screenReader: {
                    'previous': 'go previous'
                    , 'next': 'go next'
                }
                , minuteStep: 1 //5
                , minView: 'minute' //minute//hour//day//month//year
                , startView: 'year' //minute//hour//day//month//year
                , modelType: 'MM-DD-YYYY hh:mm:ss A' //Date//moment//milliseconds//MM-DD-YYYY
            };

            $scope.clearDate = function () {
                $scope.zmodel = null;
            };


            $scope.endDateBeforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
                if ($scope.zmodel) {
                    var activeDate = moment($scope.zmodel).subtract(1, $view).add(1, 'minute');
                    $dates.filter(function (date) {
                        return date.localDateValue() <= activeDate.valueOf()
                    }).forEach(function (date) {
                        date.selectable = false;
                    })
                }
            };
            //$scope.endDateBeforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
            //    var index = Math.floor(Math.random() * $dates.length);
            //    $dates[index].selectable = false;
            //}
            $scope.endDateOnSetTime = function() {
                //console.log($scope.zmodel);
            };


        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive("zackryTextEditor", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryTextEditor.html",
        replace: true,
        transclude: true,
        scope: {
            zclass: '@',
            ztextclass: '@',
            zisfocused: '@',
            zisempty: '@',
            zid: '@',
            ztype: '@',
            zname: '@',
            zlabel: '@',
            zmodel: '=',
            zshow: '=',
            zhide: '=',
            zif: '=',
            zevent: '=',
            zonchange: '&',
            zonclick: '&',
            zkeyup: '&',
            zhelp: '@'
        },
        controller: function ($scope) {
            $scope.editorConfig = {
                sanitize: false,
                toolbar: [
                    //{ name: 'basicStyling', items: ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', '-', 'leftAlign', 'centerAlign', 'rightAlign', 'blockJustify', '-'] },
                    { name: 'basicStyling', items: ['bold', 'italic', 'underline', 'strikethrough', '-', 'leftAlign', 'centerAlign', 'rightAlign', 'blockJustify', '-'] },
                    { name: 'paragraph', items: ['orderedList', 'unorderedList', 'outdent', 'indent', '-'] },
                    { name: 'doers', items: ['removeFormatting', 'undo', 'redo', '-'] },
                    { name: 'colors', items: ['fontColor', 'backgroundColor', '-'] },
                    //{ name: 'links', items: ['image', 'hr', 'symbols', 'link', 'unlink', '-'] },
                    { name: 'links', items: ['hr', 'link', 'unlink', '-'] },
                    //{ name: 'tools', items: ['print', '-'] },
                    { name: 'styling', items: ['font', 'size', 'format'] },
                ]
            };
            $scope.fix = function () {
                var myRegexpGlobal = /(<span style="([a-zA-Z-]+): ([a-zA-Z-]+);">([^<>*]+)<\/span>)/ig;
                var myRegexp = /(<span style="([a-zA-Z-]+): ([a-zA-Z-]+);">([^<>*]+)<\/span>)/i;

                var match = $scope.zmodel.match(myRegexpGlobal);
                console.log(match);
                angular.forEach(match, function (value, key) {
                    var exec = myRegexp.exec(value);
                    if (exec[3] == "bold") {
                        $scope.zmodel = $scope.zmodel.replace(exec[1], "<b>" + exec[4] + "</b>");
                    }
                    if (exec[3] == "italic") {
                        $scope.zmodel = $scope.zmodel.replace(exec[1], "<i>" + exec[4] + "</i>");
                    }
                    if (exec[3] == "underline") {
                        $scope.zmodel = $scope.zmodel.replace(exec[1], "<u>" + exec[4] + "</u>");
                    }
                    if (exec[3] == "line-through") {
                        $scope.zmodel = $scope.zmodel.replace(exec[1], "<s>" + exec[4] + "</s>");
                    }
                    console.log(exec);
                });
                //$scope.zmodel = $scope.zmodel.replace("stackover","NO");
            };
            //$scope.$watch(function ($scope) { return $scope.zmodel }, function (newValue, oldValue) {
            //    if (newValue != oldValue && (newValue))
            //    {
            //        $scope.fix();
            //    }
            //});


        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive("zackryWeather", function () {
    return {
        restrict: "E",
        replace: true,
        scope:{
            type:'='
            ,costtype:'@'
        },
        controller: function ($scope) {
        },
        link: function (scope, elem, attrs) {
            var template = null;
            switch ((scope.type) ? scope.type : scope.costtype)
            {
                case "mostlysunny":
                case "partlycloudy":
                {
                    template = '<div class="partlycloudy mostlysunny weather-icons sun-shower"><div class="weather-icons-sun"><div class="weather-icons-rays"></div></div><div class="weather-icons-cloud"></div></div>'
                }
                    break;
                case "scatteredshowers":
                {
                    template = '<div class="scatteredshowers weather-icons sun-shower"><div class="weather-icons-cloud"></div><div class="weather-icons-sun"><div class="weather-icons-rays"></div></div><div class="weather-icons-rain"></div></div>';
                }
                    break;
                case "mostlycloudy":
                {
                    template = '<div class="mostlycloudy weather-icons sun-shower"><div class="weather-icons-cloud"></div><div class="weather-icons-sun"><div class="weather-icons-rays"></div></div></div>';
                }
                    break;
                case "thunderstorms":
                case "scatteredthunderstorms":
                {
                    template = '<div class="thunderstorms scatteredthunderstorms weather-icons thunder-storm"><div class="weather-icons-cloud"></div><div class="weather-icons-lightning"><div class="weather-icons-bolt"></div><div class="weather-icons-bolt"></div></div></div>';
                }
                    break;
                case "windy":
                case "cloudy":
                case "breezy":
                {
                    template = '<div class="breezy cloudy windy weather-icons cloudy"><div class="weather-icons-cloud"></div><div class="weather-icons-cloud"></div></div>';
                }
                    break;
                case "snow":
                {
                    template = '<div class="snow weather-icons flurries"><div class="weather-icons-cloud"></div><div class="weather-icons-snow"><div class="weather-icons-flake"></div><div class="weather-icons-flake"></div></div></div>';
                }
                    break;
                case "clear":
                case "sunny":
                {
                    template = '<div class="sunny weather-icons sunny"><div class="weather-icons-sun"><div class="weather-icons-rays"></div></div></div>';
                }
                    break;
                case "rain":
                {
                    template = '<div class="rain weather-icons rainy"><div class="weather-icons-cloud"></div><div class="weather-icons-rain"></div></div>';
                }
                    break;
                default :
                {
                    template = "<span></span>";
                }
                    break;
            }
            elem.html(template);
            $compile(elem.contents())(scope);
        }
    };
});


appManager.directive("zackryPageLoader", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryPageLoader.html",
        replace: true,
        transclude: true,
        scope: {
            zif: '='
        },
        controller: function ($scope) {
        },
        link: function (scope, elem, attrs) {
        }
    };
});



appManager.directive("zackryModals", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryModals.html",
        replace: true,
        transclude: true,
        scope: {
            modalid: '@',
            modaltitle: '@',
            zclass: '@',
            ztextclass: '@'
        },
        controller: function ($scope) {
        },
        link: function (scope, elem, attrs) {
        }
    };
});

appManager.directive("zackryConfirmationModal", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/ZackryConfirmationModal.html",
        replace: true,
        transclude: true,
        scope:{
            modalid:'@',
            modaltitle: '@',
            modalmessage: '@',
            ztextclass: '@',
            zclass: '@',
            zbtnclass: '@',
            zisfocused: '@',
            zisempty: '@',
            zid: '@',
            zlabel: '@',
            zname: '@',
            ztype: '@',
            zhelp: '@',
            zhref: '@',
            zonclick: '&',
            zonchange: '&',
            zshow: '=',
            zhide: '=',
            zif: '=',
            zmodel: '=',
            zdisabled: '=',
            zdatatoggle: '@',
            zdatatarget: '@',
            


            zbuttonclass: '@',
            zbuttonisfocused: '@',
            zbuttonisempty: '@',
            zbuttonid: '@',
            zbuttonlabel: '@',
            zbuttonname: '@',
            zbuttontype: '@',
            zbuttonhelp: '@',
            zbuttonhref: '@',
            zbuttondatadismiss: '@',
            zbuttononclick: '&',
            zbuttononchange: '&',
            zbuttonshow: '=',
            zbuttonhide: '=',
            zbuttonif: '=',
            zbuttonmodel: '=',
            zbuttondisabled: '='
        },
        controller: function ($scope) {
        },
        link: function (scope, elem, attrs) {
        }
    };
});




