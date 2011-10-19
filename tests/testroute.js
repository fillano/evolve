var route = require('../lib/router');

route.addhost('localhost');
route.addfs('localhost', '/', '/usr/home');
route.addroute('localhost', '/upload', 'GET', function(){console.log('called');});
console.dir(route.query('localhost', '/index.html', 'GET'));
console.dir(route.query('localhost', '/upload', 'GET'));
console.dir(route.query('localhost', '/upload', 'POST'));
