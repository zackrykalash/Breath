appManager

    .config(function ($stateProvider, $urlRouterProvider, $compileProvider) {
        $stateProvider
            .state('index', {
                url: "",
                templateUrl: "pages/home.html",
            })
            .state('home', {
                url: "/",
                templateUrl: "pages/home.html",
            })
            .state('addlink', {
                url: "/addlink",
                templateUrl: "pages/addlink.html",
            })
            .state('editlinks', {
                url: "/editlinks",
                templateUrl: "pages/editlinks.html",
            })
            .state('cleardata', {
                url: "/cleardata",
                templateUrl: "pages/cleardata.html",
            })
            .state('background', {
                url: "/background",
                templateUrl: "pages/background.html",
            })
            .state('liveedit', {
                url: "/liveedit",
                templateUrl: "pages/liveedit.html",
            })
            .state('addshipment', {
                url: "/addshipment",
                templateUrl: "pages/addshipment.html",
            })
            .state('shipment', {
                url: "/shipment",
                templateUrl: "pages/shipment.html",
            })
            .state('colors', {
                url: "/colors",
                templateUrl: "pages/colors.html",
            })
            .state('weather', {
                url: "/weather",
                templateUrl: "pages/weather.html",
            })
            .state('settings', {
                url: "/settings",
                templateUrl: "pages/settings.html",
            })
            .state('addyoutube', {
                url: "/addyoutube",
                templateUrl: "pages/addyoutube.html",
            })
            .state('youtube', {
                url: "/youtube",
                templateUrl: "pages/youtube.html",
            })
            .state('addnotes', {
                url: "/addnotes",
                templateUrl: "pages/addnotes.html",
            })
            .state('notes', {
                url: "/notes",
                templateUrl: "pages/notes.html",
            }) 

        ;

        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript|http|chrome|chrome-extension|data):/);
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript|http|chrome|chrome-extension|data):/);
    })

;