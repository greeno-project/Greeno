/*
 * Application configuration values
 */

var ip = 'localhost'; //'192.168.10.103';
var host = 'http://' + ip;
var port = '8080'; //'80';


var config_data = {
    'CONFIG': {
        'ip': ip,
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
