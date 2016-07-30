'use strict';

var util = require('util');

var promisedOn = (on) => function(eventName, listener) {
    var addListener = on.bind(this);
    if(listener != undefined) {
        return addListener(eventName, listener);
    } else {
        var handlers = [];
        var promised = false;
        var addHandlers = (promise) => {
            handlers.forEach((handler) => {
                promise = promise.then(handler.onRes, handler.onRej);
            });
        };
        return {
            then: function(onFulfilled, onRejected) {                
                if(promised) {
                    handlers.push({
                        onRes: onFulfilled,
                        onRej: onRejected
                    });
                } else {
                    if(typeof onFulfilled == 'function') {
                        addListener(eventName, function() {
                            addHandlers(new Promise((res, rej) => {
                                res(onFulfilled.apply(null, arguments));
                            }));
                        });
                        promised = true;
                    }
                    handlers.push({
                        onRej: onRejected
                    });
                }
                return this;
            },
            catch: function(onRejected) {
                return this.then(undefined, onRejected);
            }
        };
    }
};


var promisedOnce = (once) => function(eventName, listener) {
    var addOnce = once.bind(this);
    if(listener != undefined) {
        return addOnce(eventName, listener);
    } else {
        var promised = false;
        var okPromise;
        return {
            then: function(onFulfilled, onRejected) {
                if(promised) {
                    okPromise = okPromise.then(onFulfilled, onRejected);
                } else {
                    if(typeof onFulfilled == 'function') {
                        var argv = [];
                        okPromise = new Promise((res, rej) => {
                            addOnce(eventName, function() {
                                argv = arguments;
                                res();
                            });
                        }).then(() => {
                            return onFulfilled.apply(null, argv);
                        });
                        promised = true;
                    }
                }
                return this;
            },
            catch: function(onRejected) {
                return this.then(undefined, onRejected);
            }
        };
    }
};

var promisOn = {
    upgrade: function(emitter) {
        var on = emitter.on;
        var once = emitter.once;
        if(typeof on !== 'function' || typeof once !== 'function') {
            throw new TypeError('"emitter" should be an EventEmitter');
        };
        emitter.on = promisedOn(on);
        emitter.once = promisedOnce(once);
        return emitter;
    },
    extends: function(EventEmitter) {
        if(typeof EventEmitter !== 'function') {
            throw new TypeError('"EventEmitter" should be a construtor');
        }
        var promisedEE = function() {
            EventEmitter.apply(this, arguments);
        };
        util.inherits(promisedEE, EventEmitter);
        return this.inject(promisedEE);
    },
    inject: function(EventEmitter) {
        if(typeof EventEmitter !== 'function') {
            throw new TypeError('"EventEmitter" should be a construtor');
        }
        var on = EventEmitter.prototype.on;
        var once = EventEmitter.prototype.once;
        EventEmitter.prototype.on = promisedOn(on);
        EventEmitter.prototype.once = promisedOnce(once);
        return EventEmitter;
    }
};

module.exports = promisOn;

