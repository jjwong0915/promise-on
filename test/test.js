'use strict';

var should = require('chai').should()
var promiseOn = require('../index.js');
var EventEmitter = require('events');

var eventName = 'event';

var promiseTesting = function(context) {

    var promise;
    beforeEach(function() {
        promise = context.emitter[context.method](eventName);
    });

    it('should return an Object', () => {
        promise.should.be.a('object');
    });
    it('should have "then" method', () => {
        promise.then.should.be.a('function');
    });
    it('should have "catch" method', () => {
        promise.catch.should.be.a('function');
    });  

    describe('.then(onFulfilled, onRejected)', () => {
        it('should call onFulfilled after event emitted', (done) => {
            var onFulfilled = done;
            var onRejected = new Function;
            promise.then(onFulfilled, onRejected);
            context.emitter.emit(eventName);
        });
        it('should be chainable', () => {
            var onFulfilled = new Function;
            var onRejected = new Function;
            promise.then(onFulfilled, onRejected).should.equal(promise);
        });
    });

    describe('.catch(onRejected)', () => {
        it('should call onRejected after an error throwed', (done) => {
            var onRejected = () => {done();};
            promise.then(() => {throw new Error;}).catch(onRejected);
            context.emitter.emit(eventName);
        });
        it('should be chainable', () => {
            var onRejected = new Function;
            promise.catch(onRejected).should.equal(promise);
        });
    });

};

describe('promiseOn', function() {
    
    describe('.upgrade(emitter)', function() {
        var context = {};
        beforeEach(function() {
            context.emitter = promiseOn.upgrade(new EventEmitter);
        });  
        describe('emitter.on(eventName)', function() {
            context.method = 'on';
            promiseTesting(context);
        });
        describe('emitter.once(eventName)', function() {
            context.method = 'once';
            promiseTesting(context);
        });
    });
    
    describe('.extends(EventEmitter)', function() {
        var promiseOnEE, context = {};
        before(function() {
            promiseOnEE = promiseOn.extends(EventEmitter);
        });
        beforeEach(function() {
            context.emitter = new promiseOnEE;
        });
        describe('#on(eventName)', function() {
            context.method = 'on';
            promiseTesting(context);
        });
        describe('#once(eventName)', function() {
            context.method = 'once';
            promiseTesting(context);
        });
    });
    
    describe('.inject(EventEmitter)', function() {
        var context = {};
        before(function() {
            promiseOn.inject(EventEmitter);
        });
        beforeEach(function() {
            context.emitter = new EventEmitter;
        });
        describe('EventEmitter#on(eventName)', function() {
            context.method = 'on';
            promiseTesting(context);
        });
        describe('EventEmitter#once(eventName)', function() {
            context.method = 'once';
            promiseTesting(context);
        });
    });

});





