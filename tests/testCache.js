var testCase = require('nodeunit').testCase;

module.exports = testCase({
    setUp: function(cb) {
        this.cache = require('../lib/cache');
        this.target = {type: 'foo', value: 'bar'};
        cb();
    },
    tearDown: function(cb) {
        this.cache = null;
        delete this.cache;
        this.target = null;
        delete this.target;
        cb();
    },
    "test cache.regist": function(test) {
        test.expect(2);
        this.cache.put('foo', 'bar', this.target);
        test.equal(typeof this.cache.get('foo', 'bar'), 'undefined', 'cache.get to unregisted cache type will got undefined.');
        this.cache.regist('foo');
        this.cache.put('foo', 'bar', this.target);
        test.deepEqual(this.cache.get('foo', 'bar'), this.target, 'cache.put an object and then cache.get the object.');
        test.done();
    },
    "test cache.del": function(test) {
        test.expect(2);
        this.cache.regist('none');
        this.cache.put('none', 'foo', this.target);
        test.deepEqual(this.cache.get('none', 'foo'), this.target, 'confirm object get from cache is matched.');
        this.cache.del('none', 'foo');
        test.equal(typeof this.cache.get('none', 'foo'), 'undefined', 'delete from cache and test the deleted will become undefined.');
        test.done();
    },
    "test cache.query": function(test) {
        test.expect(2);
        this.cache.regist('fs');
        test.equal(this.cache.query('fs', 'foo'), false, 'cache.query with non existed item will return false.');
        this.cache.put('fs', 'foo', this.target);
        test.equal(this.cache.query('fs', 'foo'), true, 'cache.query with existed item will return true.');
        test.done();
    }
});