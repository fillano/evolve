var evolve = require('../lib/evolve'),
instance = new evolve({
    basedir: path.join(__dirname, '/../www'),
    dirindex: ['index.htm','index.html','default.htm']
});
instance.listen(8443, '127.0.0.1');
console.log('server started.');
