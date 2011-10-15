var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    baseDir = __dirname + '/../www',
    server = http.createServer(function(request, response) {
        var urlObj = url.parse(request.url);
        var respath = baseDir + (urlObj.pathname.indexOf('/')===0? urlObj.pathname:'/'+urlObj.pathname);
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
