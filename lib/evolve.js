var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    mime = require('../deps/mime'),
    cache = require('./cache');
    path = require('path');

var tools = {
    getRes: function(respath, dirindex, cb) {
        if(cache.query('fscache', respath)) {
            cb(false, respath, cache.get('fscache', respath));
        } else {
            fs.stat(respath, function(err, stats) {
                if(err) {
                    cb(true, respath);
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
                                    cb(true, tmp);
                                }
                            } else {
                                var res = {"type": mime.lookup(tmp), "data": data};
                                cb(false, tmp, res);
                                cache.put('fscache', respath, res);
                            }
                        });
                    } else {
                        fs.readFile(respath, function(err, data) {
                            if(err) {
                                cb(true);
                            } else {
                                var res = {"type": mime.lookup(respath), "data": data};
                                cb(false, respath, res);
                                cache.put('fscache', respath, res);
                            }
                        });
                    }
                }
            });
        }
    }
};


var evolve = function(conf) {
    cache.regist('fscache');
    var server = http.createServer(function(request, response) {
        var urlObj = url.parse(request.url);
        var respath = path.join(conf.basedir, urlObj.pathname);
        console.log('request: ' + respath);
        tools.getRes(respath, conf.dirindex, function(err, realpath, data) {
            if(err) {
                console.log(realpath + ' not exists.');
                response.writeHead(404, {"Content-Type":"text/html"});
                response.end('<html><body><h1>404: Request resource not found.</h1></body></html>');
            } else {
               console.log(realpath + ' exists.');
               response.writeHead(200, {
                   "Content-Type": data.type,
                   "Content-Length": data.data.length
               });
               response.end(data.data);
            }
        });
    });
    this.listen = function(port, addr) {
        server.listen(port, addr);
        return this;
    };
};
module.exports = evolve;
