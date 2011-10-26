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