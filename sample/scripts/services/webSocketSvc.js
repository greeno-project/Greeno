'use strict';

angular.module('adf.services')
  .service('webSocketSvc', [function() {
        var webSocketUrl = 'ws://localhost:8080/ws';
        var websocket;

        var channelConnected = false;

        // web socket subscription requests in pending
        var pendingRequests = [];

        function initWebSocket() {
            websocket = new WebSocket(webSocketUrl);
            websocket.onopen = function(evt) { onOpen(evt) };
            websocket.onclose = function(evt) { onClose(evt) };
            websocket.onerror = function(evt) { onError(evt) };
        }

        function onOpen (evt) {
            console.log("CONNECTED");
            channelConnected = true;
            processPendingSubscriptions();
        }

        function onClose (evt) {
            console.log("DISCONNECTED");
            channelConnected = false;
            setTimeout(function(){
                initWebSocket();
            }, 1000);
        }

        function onMessage (evt, callback) {
            //update events text area when a message have been received from websocket
            //$("#eventsTextArea").val($("#eventsTextArea").val()+evt.data);
            callback(evt.data);
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
            websocket.onmessage = function(evt) { onMessage(evt, callback) };
            websocket.send('{"dal.function.UID":"'+functionUID+'","dal.function.property.name":"'+property+'"}');
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

        // start
        initWebSocket();
    }
]);