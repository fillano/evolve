var http = require('http'),
    tools = require('./tools');

var count = 0;

var wait = function(callbacks, req, res, done) {
    var counter = callbacks.length;
    var results = [];
    var next = function(result) {
      results.push(result);
        if(--counter < 1) {
            done(results);
        }
    };
    if(counter === 0) {
        done(results);
        return;
    }
    for(var i = 0; i < callbacks.length; i++) {
        callbacks[i](req, res, next);
    }
};

module.exports = function(conf) {
    var pre = [];
    var server = http.createServer(function(request, response) {
        var dispatched = false;
        var post = false;
        var precount = 0;
        
        //tools.cookieHandler(request, response);
        console.log(process.pid + '::' + (++count) + ': ' + process.memoryUsage().heapUsed);
        //this.emit('pre', request, response);
        wait(pre, request, response, function(){
            server.emit('dispatch', conf, request, response, function(err, realpath, data) {
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
                server.emit('post', request, response);
            });
        });
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
        switch(hook) {
            case 'pre':
                pre.push(handler);
                break;
            case 'dispatch':
                server.on('dispatch', handler);
                break;
            case 'post':
                server.on('post', handler);
        }
    };
    this.handle('dispatch', tools.dispatch);
};
