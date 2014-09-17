/**! 
 * @license angular-bugsnag v0.1.2
 * Copyright (c) 2013 Luke Bunselmeyer <wmlukeb@gmail.com>. https://github.com/wmluke/angular-bugsnag
 * License: MIT
 */
(function () {
    'use strict';

    var _bugsnag;

    angular.module('angular-bugsnag', [])
        .config(['$provide', function ($provide) {
            $provide.provider({
                bugsnag: function () {
                    _bugsnag = _bugsnag || Bugsnag.noConflict();
                    var _self = this;
                    var _beforeNotify;

                    this.apiKey = function (apiKey) {
                        _bugsnag.apiKey = apiKey;
                        return _self;
                    };

                    this.releaseStage = function (releaseStage) {
                        _bugsnag.releaseStage = releaseStage;
                        return _self;
                    };

                    this.notifyReleaseStages = function (notifyReleaseStages) {
                        _bugsnag.notifyReleaseStages = notifyReleaseStages;
                        return _self;
                    };

                    this.appVersion = function (appVersion) {
                        _bugsnag.appVersion = appVersion;
                        return _self;
                    };

                    this.user = function (user) {
                        _bugsnag.user = user;
                        return _self;
                    };

                    this.metaData = function (metaData) {
                        _bugsnag.metaData = metaData;
                        return _self;
                    };

                    this.autoNotify = function (autoNotify) {
                        _bugsnag.autoNotify = autoNotify;
                        return _self;
                    };

                    this.beforeNotify = function (beforeNotify) {
                        _beforeNotify = beforeNotify;
                        return _self;
                    };

                    this._testRequest = function (testRequest) {
                        _bugsnag.testRequest = testRequest;
                        return _self;
                    };

                    this.refresh = function () {
                        _bugsnag.refresh();
                    }

                    this.$get = ['$injector', function ($injector) {
                        if (_beforeNotify) {
                            _bugsnag.beforeNotify = angular.isString(_beforeNotify) ? $injector.get(_beforeNotify) : $injector.invoke(_beforeNotify);
                        }
                        return _bugsnag;
                    }];

                },
                $exceptionHandler: function () {
                    this.$get = ['$log', 'bugsnag', function ($log, bugsnag) {
                        return function (exception, cause) {
                            $log.error.apply($log, arguments);
                            bugsnag.fixContext();
                            if (angular.isString(exception)) {
                                bugsnag.notify(exception);
                            } else {
                                bugsnag.notifyException(exception);
                            }
                        };
                    }];
                }
            });
        }])
        .run(['bugsnag', '$location', function (bugsnag, $location) {
            // Set the context from $location.url().  We cannot do this above b/c injecting $location creates a circular dependency.
            bugsnag.fixContext = function () {
                bugsnag.context = $location.url();
            };
        }]);
}());
