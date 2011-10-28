var testCase = require('nodeunit').testCase;

module.exports = testCase({
	"setUp": function(cb) {
		this.cookieParser = require('../lib-cov/tools').cookieParser;
		this.obj1 = {"name1":"val1","name2":"val2"};
		this.obj2 = {"na\"me1":"va'l1","na'me2":"va\"l2"};
		cb();
	},
	"tearDown": function(cb) {
	    this.cookieParser = null;
	    delete this.cookieParser;
	    this.obj1 = null;
	    delete this.obj1;
	    this.obj2 = null;
	    delete this.obj2;
	    cb();
	},
    "test normal case": function(test) {
       test.expect(2);
       var tmp1 = this.cookieParser("name1=val1;name2=val2");
       test.deepEqual(tmp1, this.obj1);
       test.deepEqual(tmp1, this.obj1);
       test.done();
    },
    "test quotes": function(test) {
        test.expect(1);
        var tmp1 = this.cookieParser("'name1'=\"val1\";\"name2\"='val2'");
        test.deepEqual(tmp1, this.obj1);
        test.done();
    },
    "test spaces": function(test) {
        test.expect(1);
        var tmp1 = this.cookieParser(" name1=val1; name2=val2 ");
        test.deepEqual(tmp1, this.obj1);
        test.done();
    },
    "test spaces with quotes": function(test) {
        test.expect(1);
        var tmp1 = this.cookieParser("na\"me1=va'l1; na'me2= va\"l2");
        test.deepEqual(tmp1, this.obj2);
        test.done();
    },
    "test spaces with complex quotes": function(test) {
        test.expect(1);
        var tmp1 = this.cookieParser("'na\"me1'=\"va'l1\"; \"na'me2\"= 'va\"l2'");
        test.deepEqual(tmp1, this.obj2);
        test.done();
    }
});
