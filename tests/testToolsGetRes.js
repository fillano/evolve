var testCase = require('nodeunit').testCase;
var path = require('path');

module.exports = testCase({
    setUp: function(cb) {
        this.getRes = require('../lib-cov/tools').getRes;
        cb();
    },
    tearDown: function(cb) {
        this.getRes = null;
        delete this.getRes;
        cb();
    },
    "test tools.getRes": function(test) {
        test.expect(4);
        this.getRes(path.join(__dirname, '../www'), ['index.html', 'index.htm', 'default.htm'], function(err, respath, data) {
            test.equal(err, false);
            test.equal(data.type, 'text/html');
            test.equal(Buffer.isBuffer(data.data), true);
            test.ok(data.data.toString().indexOf('index')>-1);
            test.done();
        });
    }
});