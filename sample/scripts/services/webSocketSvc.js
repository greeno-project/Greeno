'use strict';

angular.module('adf.services')
  .service('webSocketSvc', ['CONFIG', function(CONFIG) {
        var webSocketUrl = 'ws://localhost:8080/ws';
        webSocketUrl = 'ws://' + CONFIG.ip + ':' + CONFIG.port + '/ws';
        var websocketList = {};

        // callbacks dictionary
        var callbacks = {};

        var channelConnected = false;

        // web socket subscription requests in pending
        var pendingRequests = [];

        this.initWebSocket = function(func) {
            websocketList[func] = new WebSocket(webSocketUrl);
            var websocket = websocketList[func];
            websocket.onopen = function(evt) { onOpen(evt) };
            websocket.onclose = function(evt) { onClose(evt, func) };
            websocket.onerror = function(evt) { onError(evt) };
            websocket.onmessage = function(evt) { onMessage(evt) };
        }

        function onOpen (evt) {
            console.log("CONNECTED");
            channelConnected = true;
            processPendingSubscriptions();
        }

        function onClose (evt, func) {
            console.log("DISCONNECTED");
            channelConnected = false;
            setTimeout(function(){
                initWebSocket(func);
            }, 1000);
        }

        function onMessage (evt) {
            //update events text area when a message have been received from websocket
            var data = JSON.parse(evt.data);
            var func = data.properties['dal.function.UID'];
            var property = data.properties['dal.function.property.name'];
            var value = data.properties['dal.function.property.value'];

            callbacks[func][property](value);
        }

        function onError (evt) {
            //$("#eventsTextArea").append('<span style="color: red;">ERROR:</span> ' + JSON.stringify(evt));
            var s = JSON.stringify(evt);
            //addMessageToTable(s);
            console.error(s);
        }

        function doSendSubscriptionString(functionUID, property, callback) {
            console.log("Subscribing to: "+functionUID+" "+property);

            // set custom callback
            callbacks[functionUID] = {};
            callbacks[functionUID][property] = callback;
            websocketList[functionUID].send('{"dal.function.UID":"'+functionUID+'","dal.function.property.name":"'+property+'"}');
        }

        function processPendingSubscriptions() {
            for (var i = 0; i < pendingRequests.length; i ++) {
                var r = pendingRequests[i];
                doSendSubscriptionString(r.f, r.p, r.c);
            }

            // flush array
            pendingRequests = [];
        }

        this.subscriptChannel = function(functionUID, property, cb) {
            if (channelConnected) {
                doSendSubscriptionString(functionUID, property, cb);
            } else {
                pendingRequests.push({f: functionUID, p: property, c: cb});
            }
        }
    }
]);