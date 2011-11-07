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
    var server = http.createServer(function(request, res) {
        var dispatched = false;
        var post = false;
        var precount = 0;
        var buffer = [];
        var trailer = {};
        
        var response = responseWrapper(res);
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
                server.emit('post', res, response);
            });
        });

    function responseWrapper(res) {
        return {
            writeContinue: function(){
                res.writeContinue();
            },
            writeHead: function(){
                switch(arguments.length) {
                    case 1:
                        res.writeHead(arguments[0]);
                        break;
                    case 2:
                        res.writeHead(arguments[0], arguments[1]);
                        break;
                    case 3:
                        res.writeHead(arguments[0], arguments[1], arguments[2]);
                        break;
                }
            },
            get statusCode() {return res.statusCode;},
            set statusCode(x) {res.statusCode=x;},
            setHeader: function(name, value) {
                res.setHeader(name, value);
            },
            getHeader: function(name) {
                return res.getHeader(name);
            },
            removeHeader: function(name) {
                res.removeHeader(name);
            },
            write: function(chuck, encoding) {
                buffer.push({encoding: encoding, data:chuck});
            },
            addTrailers: function(trailers) {
                var i = null;
                for(i in trailers) {
                    if(trailers.hasOwnProperty(i)) {
                        trailer[i] = trailers[i];
                    }
                }
            },
            end: function() {
                switch(arguments.length) {
                    case 0:
                        break;
                    case 1:
                        buffer.push({encoding:'utf8', data: arguments[0]});
                        break;
                    case 2:
                        buffer.push({encoding: arguments[1], data: arguments[0]});
                        break;
                }
            },
            get buffer() {
                return buffer;
            },
            set buffer(x) {
                buffer = x;
            },
            get trailer() {
                return trailer;
            },
            set trailer(x) {
                trailer = x;
            }
        };
    }


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
    };
    this.handle('dispatch', tools.dispatch);
    this.handle('post', function(response, wrapper) {
        var i=0;
        for(; i<wrapper.buffer.length; i++) {
            response.write(wrapper.buffer[i].data, wrapper.buffer[i].encoding);
        }
        response.addTrailers(wrapper.trailer);
        response.end();
    });
};
