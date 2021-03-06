var Evolve = require('../lib-cov/evolve');
var testCase = require('nodeunit').testCase;
//var tools = require('../lib/tools');

module.exports = testCase({
    "setUp": function(cb) {
        this.http = require('http');
        this.evolve = new Evolve({dirindex: ['index.html', 'index.htm', 'default.htm']})
        .use('cookie')
        .host('localhost:8443')
        .get('/testcookie', function(request, response, cb) {
            if(request.cookie) {
				var str = ''+request.headers.cookie;
    			cb(false, '/testcookie', {type:'text/plain', data: str}, true)
            }else{
            	var str = "no cookie";
    			cb(false, '/testcookie', {type:'text/plain', data: str}, true)
            }
        })
        .listen(8443, 'localhost');
        cb();
    },
    "tearDown": function(cb) {
        this.evolve.close();
        cb();
    },
    "test if cookie received and appended to request": function(test) {
        test.expect(2);
        var cv = new Date().getTime();
        var req = this.http.request({
            "host": "localhost",
            "port": 8443,
            "path": "/testcookie",
            "method": "GET",
            "headers": {
                "Cookie": "SID="+cv
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
                test.ok(entity.indexOf(cv+"")>-1);
                test.done();
            });
        });
        req.end();
    }
});
