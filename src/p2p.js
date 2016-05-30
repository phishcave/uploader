var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription;

var P2P = function(sessionID, callbacks) {
  var config = { 'iceServers': [{'urls': 'stun:23.21.150.121'}] };
  var conArgs = { 'optional': [{'DtlsSrtpKeyAgreement': true}] };
  var connection = new RTCPeerConnection(config, conArgs);
  var connected = false;
  var data = null; // wrapper arounder sender / receiver.

  this.connected = function() {
    return connected;
  };

  this.createAnswer = function() {
    data.createAnswer();
  };

  this.create = function() {
    data = new P2PSender(connection, callbacks);
  };

  this.receive = function() {
    data = new P2PReceiver(connection, sessionID, callbacks);
  };
};

var P2PComponent = function(sessionID) {
  var container = div({cls: 'status'});
  var data = null;
  var p2p = null;

  var init = function() {
    var callbacks = {
      connect: onConnect.bind(this),
      disconnect: onDisconnect.bind(this),
      sessionExists: onSessionExists.bind(this),
      sessionNotFound: onSessionNotFound.bind(this),
      sessionCreated: onSessionCreated.bind(this)
    };

    p2p = new P2P(sessionID, callbacks);

    if (!isSender()) {
      p2p.receive();
    }
  };

  var onSessionCreated = function(sessionID) {
    H.empty(container);
    container.appendChild(div("Session Created, send the following link to the person hwo should receive the file"));
    container.appendChild(dominate.tags.a({href: "/direct/" + sessionID}, "dooad"));
  };

  var onSessionExists = function() {
    console.log("sessionExists");
    p2p.createAnswer();
  };

  var onSessionNotFound = function() {
    console.log("sessionDoesNotExist");
    H.empty(container);
    container.appendChild(div("Session does not exist!"));
  };

  var onConnect = function() {
    console.log("Connect");
    H.empty(container);
    container.appendChild(div("Connected!"));
  };

  var onDisconnect = function() {
    console.log("Disconnect");
    H.empty(container);
    container.appendChild(div("Disconnected!"));
  };

  var isSender = function() {
    return sessionID.length == 0;
  };

  var drawStatus = function() {
    H.empty(container);

    if ( data.connected() ) {
      container.appendChild(div('connected'));
    } else {
      container.appendChild(div('disconnected'));
    }
  };

  var onSendClick = function() {
    console.log('send click');
    p2p.create();
  };

  var onReceiveClick = function() {
    console.log('receive click');
    p2p.receive();
  };

  var sendButton = div({onclick: onSendClick.bind(this), cls: 'btn'}, "Send File...");
  var receiveButton = div({onclick: onReceiveClick.bind(this), cls: 'btn'}, "Receive");

  this.render = function() {
    if (isSender()) {
      container.appendChild(sendButton);
    } else {
      container.appendChild(
        div('Attempting to receive file with id ' + sessionID)
      )
    }
    return container;
  };

  init();
};
