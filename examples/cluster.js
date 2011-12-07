var Evolve = require('../lib/evolve');
var tools = require('../lib/tools');
var path = require('path');
var cluster = require('cluster');
var config = require('./config');

if(cluster.isMaster) {
    var i=0, l=config.workers||2;
    for(; i<l; i++) {
        var worker = cluster.fork();
        worker.on('message', function(msg) {
        });
    }
    cluster.on('death', function(worker) {
        console.log('worker: ' + worker.pid + ' died.');
        cluster.fork();
    });
} else {

var server = new Evolve(config)
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
}