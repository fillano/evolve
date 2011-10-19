var evolve = require('../lib/evolve'),
instance = new evolve({
    basedir: path.join(__dirname, '/../www'),
    dirindex: ['default.ht', 'index.htm','index.html']
});
instance.listen(8443, '127.0.0.1');
console.log('server started.');
