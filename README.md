Promise-on
====
Using EventEmitters with Promise-like Interface

Feature
----
* Automatically generate promises when events emitted
* Enhance readability with ES6 Promise-like Interface
* Fully compatible with native Node.js API

Getting Started
----
```js
var fs = require('fs');
var http = require('http'); 
var promiseOn = require('promise-on');              // install this by `npm install promise-on`

var httpServer = promiseOn.extends(http.Server);    // create an enhanced http.Server class

var server = new httpServer;
server.on('request').then((request, response) => {  // "then" method will pass supplied arguments
    return new Promise((resolve, reject) => {       // returning "thenable" adopts the state of promise
        fs.readFile('index.html', (err, data) => {
            if(err) reject(err);
            else resolve({
                response: response,
                data: data
            });
        });
    });
}).then((out) => {
    out.response.end(out.data);
}).catch((err) => {                                 // "catch" method will handle errors
    console.error(err);
});
server.listen(3000, () => {
    console.log('Server is listening at http://localhost:3000')
});
```

API
----
* `PromiseOn`
    * `.extends(EventEmitter)`: return a enhanced EventEmitter
    * `.inject(EventEmitter)`: modify prototypes of the EventEmitter
    * `.upgrade(emitter)`: modify a EventEmitter instance
* new interfaces of enhanced EventEmitters
    * `EventEmitter.prototype.on(eventName)`: return a `promising`
    * `EventEmitter.prototype.once(eventName)`: return a `Promise`
* Object `promising`
    * Function `then(onFulfilled, onRejected)`: return `this` (chainable)
    * Function `catch(onRejected)`: return `this` (chainalbe)
    * `onFulfilled` and `onRejected` will be added to the promise queue

Contributing
----
* Running the tests with `npm test`
* Report bugs with [github issues](https://github.com/jjwong0915/promise-on/issues)
* New ideas about the project are welcome!!!

License
----
[ISC License](https://raw.githubusercontent.com/jjwong0915/promise-on/master/LICENSE)