var url = require('url'),
    fs = require('fs'),
    mime = require('../deps/mime'),
    cache = require('./cache'),
    path = require('path'),
    router = require('./router');

cache.regist('fscache');

function serverRender(context, request, response) {
    return function (err, realpath, data, done) {
        if(err) {
            console.log(process.pid + '::' + realpath + ' not exists.');
            response.statusCode = 404;
            response.setHeader("Content-Type","text/html");
            response.end('<html><body><h1>404: Request resource not found.</h1></body></html>');
            context.end(request, response);
        } else {
            console.log(process.pid + '::' + realpath + ' exists.');
            response.setHeader("Content-Type", data.type);
            response.statusCode = 200;
            response.write(data.data);
            if(done) {
                context.end(request, response);
            }
        }
    };
}

module.exports = tools = {
    getRes: function(respath, dirindex, cb) {
        if(cache.query('fscache', respath)) {
            process.nextTick(function(){cb(false, respath, cache.get('fscache', respath), true);});
        } else {
            fs.stat(respath, function(err, stats) {
                if(err) {
                    process.nextTick(function(){cb(true, respath);});
                } else {
                    if(stats.isDirectory()) {
                        var ic=0;
                        fs.readFile(path.join(respath, dirindex[ic]), function dih(err, data) {
                            var tmp = path.join(respath, dirindex[ic]);
                            ic++;
                            if(err) {
                                if(ic<dirindex.length) {
                                    fs.readFile(path.join(respath, dirindex[ic]), dih);
                                } else {
                                    process.nextTick(function(){cb(true, tmp);});
                                }
                            } else {
                                var res = {"type": mime.lookup(tmp), "data": data};
                                process.nextTick(function(){cb(false, tmp, res, true);});
                                process.nextTick(function(){cache.put('fscache', respath, res);});
                            }
                        });
                    } else {
                        fs.readFile(respath, function(err, data) {
                            if(err) {
                                cb(true);
                            } else {
                                var res = {"type": mime.lookup(respath), "data": data};
                                process.nextTick(function(){cb(false, respath, res, true);});
                                process.nextTick(function(){cache.put('fscache', respath, res);});
                            }
                        });
                    }
                }
            });
        }
    },
    hostHandler: function(hostname) {
        hostname = hostname || 'localhost';
        router.addhost(hostname);
        var ret = {
            map: function(spath, fspath) {
                router.addfs(hostname, spath, fspath);
                return this;
            },
            get: function(spath, handler) {
                router.addroute(hostname, spath, 'GET', handler);
                return this;
            },
            post: function(spath, handler) {
                router.addroute(hostname, spath, 'POST', handler);
                return this;
            },
            put: function(spath, handler) {
                router.addroute(hostname, spath, 'PUT', handler);
                return this;
            },
            delete: function(spath, handler) {
                router.addroute(hostname, spath, 'DELETE', handler);
                return this;
            },
            head: function(spath, handler) {
                router.addroute(hostname, spath, 'HEAD', handler);
                return this;
            }
        };
        var i = '';
        for(i in ret) {
            this[i] = ret[i];
        }
        return this;
    },
    dispatch: function(conf, request, response, cb) {
        var respath = url.parse(request.url).pathname;
        var handle = router.query(request.headers.host, respath, request.method);
        if(typeof handle === 'undefined') {
            process.nextTick(
                function(){
                    cb(true, respath);
                }
            );
        } else {
            switch(handle.type) {
                case 'route':
                process.nextTick(
                    function(){
                    handle.result(request, response, cb);
                    }
                );
                break;
                case 'fs':
                process.nextTick(
                    function(){
                        tools.getRes(handle.result, conf.dirindex, cb);
                    }
                );
                break;
                default:
                process.nextTick(
                    function(){
                        cb(true, respath);
                    }
                );
                break;
            }
        }
    },
    "cookieParser": function(cookie_str) {
        var tmp1 = cookie_str.split(/[;,] */g),
        tmp2,
        i=0,
        l=tmp1.length,
        ret={};
        for(;i<l;i++) {
            tmp2 = tmp1[i].split('=');
            ret[tmp2[0].trim().replace(/^[\'\"]+/g, '').replace(/[\'\"]+$/g, '')] = tmp2[1].trim().replace(/^[\'\"]+/g, '').replace(/[\'\"]+$/g, '');
        }
        return ret;
    },
    "cookieHandler": function(request, response, next) {
        if(request.headers.cookie) {
            request.cookie = tools.cookieParser(request.headers.cookie);
        } else {
            request.cookie = {};
        }
        next();
    },
    "responseWrapper": function (res) {
        var buffer = [];
        var trailer = {};
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
            },
            get _res() {
                return res;
            }
        };
    },
    "serverRender": serverRender
};
