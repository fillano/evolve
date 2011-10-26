/*var route = require('../lib/router');

route.addhost('localhost');
route.addfs('localhost', '/', '/usr/home');
route.addroute('localhost', '/upload', 'GET', function(){console.log('called');});
console.dir(route.query('localhost', '/index.html', 'GET'));
console.dir(route.query('localhost', '/upload', 'GET'));
console.dir(route.query('localhost', '/upload', 'POST'));
*/
var testCase = require('nodeunit').testCase;

module.exports = testCase({
    setUp: function(cb) {
        this.router = require('../lib/router');
        cb();
    },
    tearDown: function(cb) {
        this.router = null;
        cb()
    },
    "testAddHost": function(test) {
        test.expect(1);
        var host = 'nodejs.org';
        this.router.addhost(host);
        test.ok(this.router.checkhost(host));
        test.done();
    }
});