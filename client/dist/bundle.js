/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";

	//NAVIGATION BAR LAYOUT
	var AppBar = React.createClass({
	    displayName: "AppBar",
	    render: function render() {
	        return React.createElement(
	            "div",
	            { className: "navbaar-fixed" },
	            React.createElement(
	                "navv",
	                null,
	                React.createElement(									//NAVIGATIONAL WRAPPER DIV
	                    "div",
	                    { className: "nav-wrapper" },
	                    React.createElement(								//MAIN APP DIV FRAME
	                        "div",
	                        { className: "App"},
	                        React.createElement(							//HEADING DIV
	                        	"div",
	                        	{ className: "HeaderTitle" },
	                        	React.createElement(						//HEADING TITLE TEXT
	                        		"h1",
	                        		{},
	                        		"欠 C H A T"
	                        	),
	                        	React.createElement(
	                        		"h2",
	                        		{},
	                        		"[欠 を 食べる!]"
	                        	)
	                        )
	                    )
	                    
	                )
	            )
	        );

	    }
	});


	//BODY CONTENT LAYOUT
	var PresencePane = React.createClass({
	    displayName: "PresencePane",
	    render: function render() {
	        return React.createElement(
	            "div",
	            null,
	            React.createElement(
	                "h4",
	                null,
	                "Active Users"
	            ),
	            React.createElement(
	                "table",
	                { className: "striped" },
	                React.createElement(
	                    "thead",
	                    null,
	                    React.createElement(
	                        "tr",
	                        null,
	                        React.createElement(
	                            "th",
	                            { "data-field": "id" },
	                            "Nickname"
	                        ),
	                        React.createElement(
	                            "th",
	                            { "data-field": "name" },
	                            "Time joined"
	                        )
	                    )
	                ),
	                React.createElement(
	                    "tbody",
	                    null,
	                    this.props.data.map(function (user, index) {
	                        return React.createElement(
	                            "tr",
	                            { key: user.nickname },
	                            React.createElement(
	                                "td",
	                                null,
	                                user.nickname
	                            ),
	                            React.createElement(
	                                "td",
	                                null,
	                                moment(user.connectTime).format('YYYY-MM-DD HH:mm:ss')
	                            )
	                        );
	                    })
	                )
	            )
	        );
	    }
	});
	/*
	var GameBox = React.createClass({
		displayName: "GameBox",
		 testfunc: function testfunc() {
		 	var state = {
		 		board: "nignog"
		 	}
		 	return state.board
		 },
		 render: function(){
		 	return(
		 		React.createElement("div", {className: "board"}, this.testfunc())
		 	);

		 }
	});
	*/

	//MESSAGE BOX CONTENT LAYOUT
	var ChatPane = React.createClass({
	    displayName: "ChatPane",
	    componentDidMount: function componentDidMount() {
	        var _this = this;

	        var button = document.getElementById('sendBtn');
	        var textField = document.getElementById('message-input');

	        var clickStream = Rx.Observable.fromEvent(button, 'click').map(function (e) {
	            return true;
	        });
	        var enterKeyPressedStream = Rx.Observable.fromEvent(textField, 'keyup').filter(function (e) {
	            return e.keyCode == 13;
	        });
	        var textEnteredStream = Rx.Observable.fromEvent(textField, 'keyup').map(function (e) {
	            return e.target.value;
	        });
	        var sendMessageStream = Rx.Observable.merge(clickStream, enterKeyPressedStream);

	        var mergedStream = textEnteredStream.takeUntil(sendMessageStream);

	        var text = '';
	        var onNext = function onNext(t) {
	            text = t;
	        };
	        var onError = function onError(e) {};
	        var onComplete = function onComplete() {
	            $.post('/message', { 'message': text, 'who': _this.props.data.nickname, 'timestamp': Date.now() });
	            textField.value = '';
	            textField.focus();
	            mergedStream.subscribe(onNext, onError, onComplete);
	        };

	        mergedStream.subscribe(onNext, onError, onComplete);
	    },
	    render: function render() {
	        return React.createElement(
	            "div",
	            null,
	            React.createElement(
	                "h4",
	                null,
	                "Your nickname is ",
	                this.props.data.nickname
	            ),
	            React.createElement(
	                "ul",
	                { className: "collection" },
	                this.props.data.messages.map(function (message, index) {
	                    return React.createElement(
	                        "li",
	                        { className: "collection-item", key: message.timestamp },
	                        React.createElement(
	                            "span",
	                            { className: "title" },
	                            message.who,
	                            "  ",
	                            React.createElement(
	                                "i",
	                                null,
	                                moment(parseInt(message.timestamp)).format('YYYY-MM-DD HH:mm:ss')
	                            )
	                        ),
	                        React.createElement(
	                            "p",
	                            null,
	                            React.createElement(
	                                "strong",
	                                null,
	                                message.message
	                            )
	                        )
	                    );
	                })
	            ),
	            React.createElement(
	                "div",
	                { className: "row" },
	                React.createElement(
	                    "div",
	                    { className: "input-field col s10" },
	                    React.createElement("input", { id: "message-input", type: "text", className: "validate", ref: "message" }),
	                    React.createElement(
	                        "label",
	                        { className: "active", htmlFor: "message-input" },
	                        "Type your chat, enter/return or hit button to send"
	                    )
	                ),
	                React.createElement(
	                    "div",
	                    { className: "input-field col s2" },
	                    React.createElement(
	                        "a",
	                        { id: "sendBtn", className: "btn-floating btn-large waves-effect waves-light red" },
	                        React.createElement(
	                            "i",
	                            { className: "material-icons" },
	                            "send"
	                        )
	                    )
	                )
	            )
	        );
	    }
	});

	var Main = React.createClass({
	    displayName: "Main",
	    getInitialState: function getInitialState() {
	        return {
	            users: [],
	            messages: [],
	            P_ONE_SYM: "X",
	            P_TWO_SYM: "O",
	            currTurn: "X",
	            board: [
	            	"X", "O", "", "", "", "", "", "", ""
	            ],
	            clearBoard: [
	            	"", "", "", "", "", "", "", "", ""
	            ]
	        };
	    },
	    componentDidMount: function componentDidMount() {
	        var socket = io();

	        var props = this.props;
	        var users = this.state.users;
	        var messages = this.state.messages;
	        var self = this;

	        /*Happens first, same time with io.on('connection') on server, but useless 
	        afterward because it has no socketId.  We do nothing with this event
	        socket.on('connect', () => {}); */               
	        var socketIdStream = Rx.Observable.create(function (observer) {
	            socket.on('my socketId', function (data) {
	                observer.onNext(data);
	            });
	        });

	        socketIdStream.subscribe(function (data) {
	            socket.emit('client connect', {
	                nickname: props.nickname,
	                socketId: data.socketId,
	                connectTime: data.connectTime
	            });
	        });

	        var socketAllUsersStream = Rx.Observable.create(function (observer) {
	            socket.on('all users', function (data) {
	                observer.onNext(data);
	            });
	        });

	        socketAllUsersStream.subscribe(function (data) {
	            self.setState({ users: data });
	        });

	        var socketMessageStream = Rx.Observable.create(function (observer) {
	            socket.on('message', function (data) {
	                observer.onNext(data);
	            });
	        });

	        socketMessageStream.subscribe(function (data) {
	            messages.push(data);
	            self.setState(messages); //data is {'message': text, 'who': nickname, 'timestamp': Date.now}
	        });
	    },
	    render: function render() {
	        return React.createElement(
	            "div",
	            null,
	            React.createElement(AppBar, null),
	            React.createElement(
	                "div",
	                { className: "row" },
	                React.createElement(
	                    "div",
	                    { className: "col s6" },
	                    React.createElement(ChatPane, { data: { nickname: this.props.nickname,
	                            messages: this.state.messages } })
	                ),
	               /* React.createElement(
		            	"div", 
		            	{className: "col s4"},
		            	React.createElement(GameBox, {})
		            ),*/
	                React.createElement(
	                    "div",
	                    { className: "col s6" },
	                    React.createElement(PresencePane, { data: this.state.users })
	                )
	            )
	        );
	    }
	});
	
	//RANDOM NICKNAME logic -> pick random name from array
	var createRandomNickname = function createRandomNickname(len) {
	    var text = '';
	    var possible = ["Bird", "Johnson", "Ling-Ping", "Dongle"];
	    text = possible[Math.floor(Math.random() * possible.length)];
	    return text;
	};


	ReactDOM.render(React.createElement(Main, { nickname: createRandomNickname(6) }), document.getElementById('container'));

/***/ }
/******/ ]);