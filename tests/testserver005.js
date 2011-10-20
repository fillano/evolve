var evolve = require('../lib/evolve');
var path = require('path');
var server = new evolve({
    dirindex: ['index.html', 'index.htm', 'default.htm']
});
server
    .host('localhost:8443')
    .map('/', path.join(__dirname, '../www'))
    .get('/hello', function(request, response, cb) {
        cb(false, '/hello', {
            type: 'text/html',
            data: '<html><body>hello</body></html>'
        });
    });
server.listen(8443, 'localhost');