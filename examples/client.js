var WebSocket = require('../lib/faye/websocket'),
    fs = require('fs');

var DELAY = {
  createClientSession: function () {
    return new ClientSession;
  },
  name: 'permessage-delay',
  type: 'permessage',
  rsv1: false,
  rsv2: false,
  rsv3: false
};

var ClientSession = function () {
};
ClientSession.prototype.generateOffer = function () {
  return [{}];
};
ClientSession.prototype.activate = function (params) {
  return true;
};
ClientSession.prototype.processIncomingMessage = function (message, cb) {
  cb(null, message);
};
ClientSession.prototype.processOutgoingMessage = function (message, cb) {
  cb(null, message);
};
ClientSession.prototype.close = function () {
};


var url     = process.argv[2],
    headers = {Origin: 'http://faye.jcoglan.com'},
    ca      = fs.readFileSync(__dirname + '/../spec/server.crt'),
    proxy   = {origin: process.argv[3], headers: {'User-Agent': 'Echo'}, tls: {ca: ca}},
    ws      = new WebSocket.Client(url, null, {headers: headers, tls: {ca: ca}, extensions: [DELAY]});

ws.onopen = function() {
  console.log('[open]', ws.headers);
  ws.send('mic check');
};

ws.onclose = function(close) {
  console.log('[close]', close.code, close.reason);
};

ws.onerror = function(error) {
  console.log('[error]', error.message);
};

ws.onmessage = function(message) {
  console.log('[message]', message.data);
};
