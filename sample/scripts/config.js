/*
 * Application configuration values
 */

var host = 'http://localhost';
var port = '8080';
var config_data = {
    'CONFIG': {
        'host': host,
        'port': port,
        'api': host + ':' + port + '/api',
        'functions': host + ':' + port + '/api/functions/'
    }
}



/*
 * Wrapping inside a module
 */
var config_module = angular.module('adf.config', []);

angular.forEach(config_data, function(key, value) {
    config_module.constant(value, key);
});
