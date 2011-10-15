var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    path = require('path');
    baseDir = path.join(__dirname, '/../www'),
    server = http.createServer(function(request, response) {
        var urlObj = url.parse(request.url);
        var respath = path.join(baseDir, urlObj.pathname);
        console.log(respath);
        fs.readFile(respath, function(err, data) {
            if(err) {
                console.log(respath + ' not exists.');
                response.writeHead(404, '');
                response.end();
            } else {
                console.log(respath + ' exists.');
                response.writeHead(200, {
                    "Content-Type": 'text/html', 
                    "Content-Length": data.length
                });
                response.end(data);
            }
        });
    });
server.listen(8443, '127.0.0.1');
console.log('server started.');
