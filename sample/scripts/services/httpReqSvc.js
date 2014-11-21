'use strict';

angular.module('adf.services')
  .service('httpReqSvc', ['$http', '$q', 'CONFIG', function($http, $q, CONFIG) {
        // generic jemma get
        this.get = function (functionUID, property) {
            var deferred = $q.defer();
            var data = {operation: "get" + property};

            $http({
              method: 'post',
              url: CONFIG.functions + functionUID,
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

            return deferred.promise;
        }

        // generic jemma set
        this.set = function (functionUID, property) {
            var deferred = $q.defer();
            var data = {operation: "set" + property};
            
            $http({
              method: 'post',
              url: CONFIG.functions + functionUID,
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

            return deferred.promise;
        }
    }
]);