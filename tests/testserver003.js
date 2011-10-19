var evolve = require('../lib/evolve'),
path = require('path'),
instance = new evolve({
    basedir: path.join(__dirname, '/../www'),
    dirindex: ['default.htm', 'index.htm','index.html']
});
instance.listen(8443, '127.0.0.1');
console.log('server started.');
