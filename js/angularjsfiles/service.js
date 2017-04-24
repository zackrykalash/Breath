appManager.service('entityService', ['$log', '$location', '$http', '$routeParams', '$resource', function ($log, $location, $http, $routeParams, $resource) {
    var thisService = this;
    thisService.webapiUrl = "api/";

    thisService.getAll = function (item) {
        var promise = $http({
            method: 'GET', url: thisService.webapiUrl + item
        }).success(function (data, status, headers, config) {
            return data;
        });
        return promise;
    };

    thisService.get = function (item, id) {
        if (id === '0')
            id = '';
        var promise = $http({
            method: 'GET', url: thisService.webapiUrl + item + '/' + id
        }).success(function (data, status, headers, config) {
            return data;
        });
        return promise;
    };

    thisService.getPerPage = function (item, starts, ends) {
        var promise = $http({
            method: 'GET', url: thisService.webapiUrl + item + '/page/' + starts + '/' + ends
        }).success(function (data, status, headers, config) {
            return data;
        });
        return promise;
    };

    thisService.getPagesNbr = function (item) {
        var promise = $http({
            method: 'GET', url: thisService.webapiUrl + item + '/pages/1'
        }).success(function (data, status, headers, config) {
            return data;
        });
        return promise;
    };
}]);

appManager.service('blog', ['$log', '$location', '$http', function ($log, $location, $http) {
    var thisService = this;

    thisService.ArticleManageList = function (data) {
        var promise = $http({
            method: 'POST', url: base_url_user_services,
            data:  'action=article_manage_list',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
            return data;
        });
        return promise;
    };

    thisService.ArticleList = function (data) {console.log(base_url_user_services+"?action=article_list");
        dataString = "";
        if(data.date != undefined && data.go != undefined)
        {
            dataString = 'action=article_list&date='+data.date+'&go='+data.go
        }
        else
        {
            dataString = 'action=article_list';
        }

        var promise = $http({
            method: 'POST', url: base_url_user_services,
            data:  dataString,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
            return data;
        });
        return promise;
    };

    thisService.ArticleSubmit = function (data) {
        var promise = $http({
            method: 'POST', url: base_url_user_services,
            data:  'action=article_submit&id='+data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
            return data;
        });
        return promise;
    };

    thisService.ArticleUnSubmit = function (data) {
        var promise = $http({
            method: 'POST', url: base_url_user_services,
            data:  'action=article_unsubmit&id='+data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
            return data;
        });
        return promise;
    };
}]);

appManager.service('satc', ['$log', '$location', '$http', function ($log, $location, $http) {
    var thisService = this;

    thisService.SATCList = function (data) {
        var promise = $http({
            method: 'POST', url: base_url_user_services,
            data:  'action=satc_list',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
            return data;
        });
        return promise;
    };

    thisService.SATCAdd = function (data) {
        var promise = $http({
            method: 'POST', url: base_url_user_services+'?action=satc_add',
            data: $.param(data),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
            return data;
        });
        return promise;
    };
}]);

appManager.service('category', ['$log', '$location', '$http', function ($log, $location, $http) {
    var thisService = this;

    thisService.Add = function (data) {
        var promise = $http({
            method: 'POST', url: base_url_user_services+'?action=category_add',
            data: $.param(data),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
            return data;
        });
        return promise;
    };
}]);