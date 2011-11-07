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
            cb(false, '/hello_mvc', {type:'text/html', data: view.render(data)}, true);
        };
    },
    "hello_mvc1": function(cb) {
        var view = swig.compileFile('tests/temp2.html');
        this.render = function(data) {
            cb(false, '/hello_mvc1', {type:'text/html', data: view.render(data)}, true);
        };
    },
    "hello_mvc2": function(cb) {
        var view = swig.compileFile('examples/temp3.html');
        var header = swig.compileFile('tests/header.html');
        var footer = swig.compileFile('tests/footer.html');
        this.render = function(data) {
            cb(false, '/hello_mvc2', {type:'text/html', data: header.render(data)});
            cb(false, '/hello_mvc2', {type:'text/html', data: view.render(data)});
            cb(false, '/hello_mvc2', {type:'text/html', data: footer.render(data)}, true);
        };
    }
};