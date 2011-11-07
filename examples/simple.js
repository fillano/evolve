var Evolve = require('../lib/evolve');
var tools = require('../lib/tools');
var path = require('path');
var server = new Evolve({
    dirindex: ['index.html', 'index.htm', 'default.htm']
});
server
.handle('pre',  tools.cookieHandler)
.host('localhost:8443')
.map('/', path.join(__dirname, '../www'))
.get('/hello', function (request, response, cb) {
    cb(false, '/hello', {
        type: 'text/html',
        data: '<html><body>hello</body></html>'
    }, true);
})
.get('/hello_mvc', function (request, response, cb) {
    var HelloModel = require('./models')['hello_mvc'];
    var HelloView = require('./views')['hello_mvc'];
    var m = new HelloModel(new HelloView(cb));
    m.execute();
})
.get('/hello_mvc1', function (request, response, cb) {
    var HelloModel = require('./models')['hello_mvc1'];
    var HelloView = require('./views')['hello_mvc1'];
    var m = new HelloModel(new HelloView(cb));
    m.execute();
})
.get('/hello_mvc2', function (request, response, cb) {
    var HelloModel = require('./models')['hello_mvc2'];
    var HelloView = require('./views')['hello_mvc2'];
    var m = new HelloModel(new HelloView(cb));
    m.execute();
})
.listen(8443, 'localhost');