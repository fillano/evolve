var url = require('url')
    fs = require('fs'),
    mime = require('../deps/mime'),
    cache = require('./cache'),
    path = require('path'),
    router = require('./router');

cache.regist('fscache');

module.exports = tools = {
    getRes: function(respath, dirindex, cb) {
        if(cache.query('fscache', respath)) {
            process.nextTick(function(){cb(false, respath, cache.get('fscache', respath))});
        } else {
            fs.stat(respath, function(err, stats) {
                if(err) {
                    process.nextTick(function(){cb(true, respath)});
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
                                    process.nextTick(function(){cb(true, tmp)});
                                }
                            } else {
                                var res = {"type": mime.lookup(tmp), "data": data};
                                process.nextTick(function(){cb(false, tmp, res)});
                                process.nextTick(function(){cache.put('fscache', respath, res)});
                            }
                        });
                    } else {
                        fs.readFile(respath, function(err, data) {
                            if(err) {
                                cb(true);
                            } else {
                                var res = {"type": mime.lookup(respath), "data": data};
                                process.nextTick(function(){cb(false, respath, res)});
                                process.nextTick(function(){cache.put('fscache', respath, res)});
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
        return {
            map: function(spath, fspath) {
                router.addfs(hostname, spath, fspath);
                return this;
            },
            get: function(spath, cb) {
                router.addroute(hostname, spath, 'GET', cb);
                return this;
            },
            post: function(spath, cb) {
                router.addroute(hostname, spath, 'POST', cb);
                return this;
            },
            put: function(spath, cb) {
                router.addroute(hostname, spath, 'PUT', cb);
                return this;
            },
            delete: function(spath, cb) {
                router.addroute(hostname, spath, 'DELETE', cb);
                return this;
            },
            head: function(spath, cb) {
                router.addroute(hostname, spath, 'HEAD', cb);
                return this;
            }
        };
    },
    dispatch: function(conf, request, response, cb) {
        var respath = url.parse(request.url).pathname;
        var handle = router.query(request.headers.host, respath, request.method);
        if(typeof handle === 'undefined') {
            process.nextTick(function(){cb(true, respath)});
            return;
        }
        if(handle.type === 'route') {
            process.nextTick(function(){handle.result(request, response, cb)});
            return;
        }
        if(handle.type === 'fs') {
            process.nextTick(function(){tools.getRes(handle.result, conf.dirindex, cb)});
            return;
        }
    }
};
