var testCase = require('nodeunit').testCase;
var Evolve = require('../lib/evolve');

module.exports = testCase({
    "setUp": function(cb) {
        this.http = require('http');
        this.evolve = new Evolve({dirindex: ['index.html', 'index.htm', 'default.htm']});
        this.evolve
        .host('localhost:8443')
        .map('/', path.join(__dirname, '../www'))
        .get('/hello', function (request, response, cb) {
            cb(false, '/hello', {
                type: 'text/html',
                data: '<html><body>hello</body></html>'
            });
        })
        .get('/world', function (request, response, cb) {
            cb(false, '/world', {
                type: 'text/html',
                data: '<html><body>world</body></html>'
            });
        });
        this.evolve.listen(8443, 'localhost');
        cb();
    },
    "tearDown": function(cb) {
        this.evolve.close();
        this.evolve = null;
        delete this.evolve;
        cb();
    },
    "test default index": function(test) {
        test.expect(2);
        var req = this.http.request({
            "host": "localhost",
            "port": 8443,
            "path": "/",
            "method": "GET"
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
                test.equal(200, response.statusCode);
                test.ok(entity.indexOf('index.html')>-1);
                test.done();
            });
        });
        req.end();
    },
    "test existed index file": function(test) {
        test.expect(2);
        var req = this.http.request({
            "host": "localhost",
            "port": 8443,
            "path": "/default.htm",
            "method": "GET"
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
                test.equal(200, response.statusCode);
                test.ok(entity.indexOf('index.html')>-1);
                test.done();
            });
        });
        req.end();
    },
    "test non existed index": function(test) {
        test.expect(2);
        var req = this.http.request({
            "host": "localhost",
            "port": 8443,
            "path": "/index.html",
            "method": "GET"
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
                test.equal(404, response.statusCode);
                test.ok(entity.indexOf('index.html')<0);
                test.done();
            });
        });
        req.end();
    },
    "test router hello": function(test) {
        test.expect(2);
        var req = this.http.request({
            "host": "localhost",
            "port": 8443,
            "path": "/hello",
            "method": "GET"
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
                test.equal(200, response.statusCode);
                test.ok(entity.indexOf('hello')>-1);
                test.done();
            });
        });
        req.end();
    },
    "test router world": function(test) {
        test.expect(2);
        var req = this.http.request({
            "host": "localhost",
            "port": 8443,
            "path": "/world",
            "method": "GET"
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
                test.equal(200, response.statusCode);
                test.ok(entity.indexOf('world')>-1);
                test.done();
            });
        });
        req.end();
    },
    "test non html file": function(test) {
        test.expect(2);
        var req = this.http.request({
            "host": "localhost",
            "port": 8443,
            "path": "/bg.gif",
            "method": "GET"
        }, function(response) {
            var result = [];
            response.on('data', function(data) {
                result.push(data);
            });
            response.on('end', function() {
                var total = 0;
                for(var i=0; i<result.length; i++) {
                   total += result[i].length;
                }
                test.equal(200, response.statusCode);
                test.equal('image/gif', response.headers['content-type']);
                test.done();
            });
        });
        req.end();
    }
});