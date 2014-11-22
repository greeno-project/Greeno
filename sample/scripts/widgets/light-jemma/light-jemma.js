/*
 * The MIT License
 * 
 * Copyright (c) 2013, Sebastian Sdorra
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

angular.module('sample.widgets.light-jemma', ['adf.provider', 'adf.services'])
  .value('lightJemmaServiceUrl', 'http://localhost:8080/api/functions/ZigBee:ColorLight%201:ah.app.36276195726903800-1:OnOff')
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('light-jemma', {
        title: 'Light Jemma',
        description: 'Display the current status of the light',
        templateUrl: 'scripts/widgets/light-jemma/light-jemma.html',
        controller: 'lightJemmaCtrl',
        reload: false,
        resolve: {
          /*data: function(lightJemmaSvc, config){
              return lightJemmaSvc.get();
          }*/
        },
        edit: {
          templateUrl: 'scripts/widgets/light-jemma/edit.html'
        }
      });
  })
  .service('lightJemmaSvc', function($q, $http, lightJemmaServiceUrl){
    return {
      get: function(){
        return true;
      }
    };
  })
  .controller('lightJemmaCtrl', ['$scope', 'CONFIG', '$q', '$http', 'lightJemmaSvc', 'webSocketSvc', 'httpReqSvc',
    function($scope, CONFIG, $q, $http, lightJemmaSvc, webSocketSvc, httpReqSvc) {
      $scope.lightState = true;
      var functionUID = 'ZigBee:ColorLight 1:ah.app.36276195726903800-1:OnOff';
      var functionUID2 = 'ZigBee:MAC light:ah.app.36276195726903800-1:OnOff';
      var lightJemmaServiceUrl = CONFIG.functions + functionUID;

      // set reverse button callback
      $scope.onCb = function() {
        var deferred = $q.defer();
        var data = {operation: "setTrue"};
        $http({
          method: 'post',
          url: lightJemmaServiceUrl,
          data: data})
        .success(function(data){
          if (data && data.code === 200){
            deferred.resolve(data);
          } else {
            deferred.reject();
          }
        })
        .error(function(){
          deferred.reject();
        });

        $scope.postResult = deferred.promise;
      }

      // set reverse button callback
      $scope.offCb = function() {
        var deferred = $q.defer();
        var data = {operation: "setFalse"};
        $http({
          method: 'post',
          url: lightJemmaServiceUrl,
          data: data})
        .success(function(data){
          if (data && data.code === 200){
            deferred.resolve(data);
          } else {
            deferred.reject();
          }
        })
        .error(function(){
          deferred.reject();
        });

        $scope.postResult = deferred.promise;
      }

      // set reverse button callback
      $scope.reverseCb = function() {
        var deferred = $q.defer();
        var data = {operation: "reverse"};
        $http({
          method: 'post',
          url: lightJemmaServiceUrl,
          data: data})
        .success(function(data){
          if (data && data.code === 200){
            deferred.resolve(data);
          } else {
            deferred.reject();
          }
        })
        .error(function(){
          deferred.reject();
        });

        $scope.postResult = deferred.promise;
      }

      // attach ws channel
      $scope.initWs = function(functionUID) {
        // istantiate the websocket
        webSocketSvc.initWebSocket(functionUID);
        
        // initialize the web socket
        webSocketSvc.subscriptChannel(functionUID, 'data', function(res) {
          var date = new Date(res.timestamp);
          $scope.lastUpdate = date.toDateString();
          $scope.lightState = res.value;
        });
      }

      // connect the WebSocket channel
      $scope.initWs(functionUID);

      // set initial status
      httpReqSvc.get(functionUID, 'Data').then(function(res){
        var data = res.result;

        var date = new Date(data.timestamp);
        $scope.lastUpdate = date.toDateString();
        $scope.lightState = data.value;
      });
    }
  ]);