var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    mime = require('../deps/mime'),
    path = require('path'),
    evolve = function(conf) {
        var server = http.createServer(function(request, response) {
            var urlObj = url.parse(request.url);
            var respath = path.join(conf.basedir, urlObj.pathname);
            console.log('request: ' + respath);
            fs.stat(respath, function(err, stats) {
                if(err) {
                    console.log(respath + ' not exists.');
                    response.writeHead(404, '');
                    response.end();
                } else {
                    if(stats.isDirectory()) {
                        var ic=0;
                        fs.readFile(path.join(respath, conf.dirindex[ic]), function dih(err, data) {
                            ic++;
                            if(err) {
                                if(ic<conf.dirindex.length) {
                                    fs.readFile(path.join(respath, conf.dirindex[ic]), dih);
                                } else {
                                    console.log(path.join(respath, conf.dirindex[ic-1]) + ' not exists.');
                                    response.writeHead(404, '');
                                    response.end();
                                }
                            } else {
                                console.log(path.join(respath, conf.dirindex[ic-1]) + ' exists.');
                                response.writeHead(200, {
                                    "Content-Type": mime.lookup(path.join(respath, conf.dirindex[ic-1])),
                                    "Content-Length": data.length
                                });
                                response.end(data);
                            }
                        });
                    } else {
                        fs.readFile(respath, function(err, data) {
                            if(err) {
                                console.log(respath + ' not exists.');
                                response.writeHead(404, '');
                                response.end();
                            } else {
                                console.log(respath + ' exists.');
                                response.writeHead(200, {
                                    "Content-Type": mime.lookup(respath), 
                                    "Content-Length": data.length
                                });
                                response.end(data);
                            }
                        });
                    }
                }
            });
        });
        this.listen = function(port, addr) {
            server.listen(port, addr);
            return this;
        };
    };
module.exports = evolve;
