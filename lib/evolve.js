var http = require('http'),
    tools = require('./tools');

var count = 0;

var evowait = function(callbacks, context, req, res, done) {
    var counter = callbacks.length;
    var results = [];
    var next = function(result) {
      results.push(result);
        if(--counter < 1) {
            done(results);
        }
    };
    if(counter <= 0) {
        done(results);
        return;
    }
    for(var i = 0; i < callbacks.length; i++) {
        callbacks[i].call(context, req, res, next);
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

        evowait(pre, that, request, response, function(){
            if(dispatched) {
                return;
            } else {
                dispatched = true;
                server.emit('dispatch', conf, request, response, tools.serverRender(that, request, response));
            }
        });
    });
    server.on('clientError', function(e){console.log(e);});
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
    this.use = function(name) {
        var obj = require('./plugins/'+name);
        var i = '';
        for(i in obj) {
            if(obj.hasOwnProperty(i)) {
                switch(i) {
                    case 'pre':
                    case 'dispatch':
                    case 'post':
                        var j = 0, l = obj[i].length;
                        for(; j<l; j++) {
                            this.handle(i, obj[i][j]);
                        }
                        break;
                    case 'app':
                        var k = '';
                        for(k in obj.app) {
                            if(obj.app.hasOwnProperty(k)) {
                                switch(k) {
                                    case 'handle':
                                    case 'use':
                                    case 'end':
                                    case 'host':
                                    case 'listen':
                                    case 'close':
                                    case 'listen':
                                        break;
                                    default:
                                        if(typeof obj.app[k] === 'function') {
                                            this[k] = obj.app[k];
                                        }
                                        break;
                                }
                            }
                        }
                        break;
                }
            }
        }
        return this;
    };
    this.handle('dispatch', tools.dispatch);
    this.handle('post', function(request, wrapper) {
        var i = 0;
        var l = 0;
        var isBuffer = false;
        if(Buffer.isBuffer(wrapper.buffer[i].data)) {
            isBuffer = true;
        }
        var str = '';
        for(; i<wrapper.buffer.length; i++) {
            if(isBuffer) {
                l += wrapper.buffer[i].data.length;
            } else {
                l += Buffer.byteLength(wrapper.buffer[i].data, wrapper.buffer[i].encoding);
            }
        }
        wrapper._res.setHeader('Content-Length', l);
        i = 0;
        for(; i<wrapper.buffer.length; i++) {
            if(isBuffer) {
                wrapper._res.write(wrapper.buffer[i].data);
            } else {
                wrapper._res.write(wrapper.buffer[i].data, wrapper.buffer[i].encoding);
            }
        }
        wrapper._res.addTrailers(wrapper.trailer);
        wrapper._res.end();
    });
};
