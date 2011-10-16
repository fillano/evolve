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
        });
        this.listen = function(port, addr) {
            server.listen(port, addr);
            return this;
        };
    };
var instance = new evolve({
    basedir: path.join(__dirname, '/../www'),
    dirindex: ['index.html']
});
instance.listen(8443, '127.0.0.1');
console.log('server started.');
