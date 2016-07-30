'use strict';

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