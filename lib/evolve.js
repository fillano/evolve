var http = require('http'),
    tools = require('./tools');

//var count = 0;

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
    var that = this;
    var server = http.createServer(function(request, res) {
        var dispatched = false;
        var post = false;
        var precount = 0;
        var response = tools.responseWrapper(res);

        that.response = response;
        that.request = request;

        //console.log(process.pid + '::' + (++count) + ': ' + process.memoryUsage().heapUsed);
        wait(pre, request, response, function(){
            if(dispatched) {
                return;
            } else {
                dispatched = true;
                server.emit('dispatch', conf, request, response, tools.serverRender(that, request, response));
            }
        });
    });
    this.listen = function() {
        var args = [], i=0;
        for(; i<arguments.length; i++) {
            args.push(arguments[i]);
        }
        server.listen.apply(server, args);
        return this;
    };
    this.close = function(cb) {
        if(typeof cb === 'function') {
            server.on('close', cb);
        }
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
        return this;
    };
    this.end = function(request, response) {
        server.emit('post', request, response);
    };

    this.handle('dispatch', tools.dispatch);
    this.handle('post', function(request, wrapper) {
        var i = 0;
        var l = 0;
        var str = '';
        for(; i<wrapper.buffer.length; i++) {
            l += wrapper.buffer[i].data.length;
        }
        wrapper._res.setHeader('Content-Length', l);
        //wrapper._res.setHeader('Content-Type', wrapper.buffer[0].type);
        i = 0;
        for(; i<wrapper.buffer.length; i++) {
            wrapper._res.write(wrapper.buffer[i].data);
        }
        wrapper._res.addTrailers(wrapper.trailer);
        wrapper._res.end();
    });
};
