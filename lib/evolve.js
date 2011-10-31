var http = require('http'),
    tools = require('./tools');

var count = 0;

module.exports = function(conf) {
    var server = http.createServer(function(request, response) {
        var dispatched = false;
        //tools.cookieHandler(request, response);
        console.log(process.pid + '::' + (++count) + ': ' + process.memoryUsage().heapUsed);
        this.emit('pre', request, response);
        this.emit('dispatch', conf, request, response, function(err, realpath, data) {
            if(dispatched) {
                return;
            } else {
                dispatched = true;
            }
            if(err) {
                console.log(process.pid + '::' + realpath + ' not exists.');
                response.writeHead(404, {"Content-Type":"text/html"});
                response.end('<html><body><h1>404: Request resource not found.</h1></body></html>');
            } else {
               console.log(process.pid + '::' + realpath + ' exists.');
               response.writeHead(200, {
                   "Content-Type": data.type,
                   "Content-Length": data.data.length
               });
               response.end(data.data);
            }
        });
        this.emit('post', request, response);
    });
    this.listen = function(port, addr) {
        server.listen(port, addr);
        return this;
    };
    this.close = function() {
        server.close();
        return this;
    };
    this.host = tools.hostHandler;
    this.handle = function(hook, handler) {
        server.on(hook, handler);
    };
    this.handle('dispatch', tools.dispatch);
};
