var Evolve = require('../lib/evolve');
var testCase = require('nodeunit').testCase;

module.exports = testCase({
    "setUp": function(cb) {
        this.http = require('http');
        this.evolve = new Evolve({dirindex: ['index.html', 'index.htm', 'default.htm']});
        this.evolve
        .host('localhost:8443')
        .get('/testcookie', function(request, response) {
            if(request.cookie) {
				var str = ''+request.headers.cookie;
                response.writeHead('200', {"Content-Type":"text/plain","Content-Length":str.length});
                response.end(str);
            }else{
            	var str = "no cookie";
                response.writeHead('200', {"Content-Type":"text/plain","Content-Length":str.length});
                response.end(str);
            }
        });
        this.evolve.listen(8443, 'localhost');
        cb();
    },
    "tearDown": function(cb) {
        this.evolve.close();
        cb();
    },
    "test if cookie received and appended to request": function(test) {
        test.expect(2);
        var req = this.http.request({
            "host": "localhost",
            "port": 8443,
            "path": "/testcookie",
            "method": "GET",
            "headers": {
                "Cookie": "SID=1234567890abcd"
            }
        }, function(response) {
            var result = [];
            response.on('data', function(data) {
                result.push(data);
            });
            response.on('end', function() {
                var total = 0;
                var entity = '';
                for(var i=0; i<result.length; i++) {
                   total += result[i].length;
                   entity += result[i].toString('ascii');
                }
                test.ok(entity.indexOf('SID')>-1);
                test.ok(entity.indexOf('1234567890abcd')>-1);
                test.done();
            });
        });
        req.end();
    }
});
