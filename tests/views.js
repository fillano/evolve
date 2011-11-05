var swig = require('swig');

swig.init({
    allowErrors: false,
    autoescape: true,
    encoding: 'utf8',
    filters: {},
    root: '.',
    tags: {}
});

module.exports = {
    "hello_mvc": function(cb) {
        var view = swig.compileFile('tests/temp1.html');
        this.render = function(data) {
            cb(false, '/hello_mvc', {type:'text/html', data: view.render(data)});
        };
    }
};