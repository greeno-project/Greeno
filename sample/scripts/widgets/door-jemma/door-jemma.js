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

angular.module('sample.widgets.door-jemma', ['adf.provider', 'adf.services'])
  .value('doorJemmaServiceUrl', 'http://localhost:8080/api/functions/ZigBee:Door%20Lock:ah.app.12345195726903800-1:DoorLock')
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('door-jemma', {
        title: 'Door Jemma',
        description: 'Display the current status of the door',
        templateUrl: 'scripts/widgets/door-jemma/door-jemma.html',
        controller: 'doorJemmaCtrl',
        reload: false,
        resolve: {
          /*data: function(lightJemmaSvc, config){
              return lightJemmaSvc.get();
          }*/
        },
        edit: {
          templateUrl: 'scripts/widgets/door-jemma/edit.html'
        }
      });
  })
  .service('doorJemmaSvc', function($q, $http, doorJemmaServiceUrl){
    return {
      get: function(){
        return true;
      }
    };
  })
  .controller('doorJemmaCtrl', ['$scope', 'CONFIG', '$q', '$http', 'doorJemmaSvc', 'webSocketSvc', 'httpReqSvc',
    function($scope, CONFIG, $q, $http, lightJemmaSvc, webSocketSvc, httpReqSvc) {
      var functionUID = 'ZigBee:Door Lock:ah.app.12345195726903800-1:DoorLock';
      var doorJemmaServiceUrl = CONFIG.functions + functionUID;

      // set reverse button callback
      $scope.open = function() {
        var deferred = $q.defer();
        var data = {operation: "open"};
        $http({
          method: 'post',
          url: doorJemmaServiceUrl,
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
      $scope.close = function() {
        var deferred = $q.defer();
        var data = {operation: "close"};
        $http({
          method: 'post',
          url: doorJemmaServiceUrl,
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
      $scope.connectWs = function() {
        // initialize the web socket
        webSocketSvc.subscriptChannel(functionUID, 'status', function(res) {
          var data = JSON.parse(res);
          data = data.properties['dal.function.property.value'];

          var date = new Date(data.timestamp);
          $scope.lastUpdate = date.toDateString();
          $scope.doorState = data.status;
        });
      }

      // connect the WebSocket channel
      $scope.connectWs();

      // set initial status
      httpReqSvc.get(functionUID, 'Status').then(function(res){
        var data = res.result;

        var date = new Date(data.timestamp);
        $scope.lastUpdate = date.toDateString();
        $scope.doorState = data.status;
      });
    }
  ]);