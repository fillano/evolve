var path = require('path'),
cache = require('./cache');

function addhost(host) {
    host = host || 'localhost';
    cache.regist(host);
    cache.put(host, 'fs', {});
    cache.put(host, 'route', {});
}

function addfs(host, path, fs) {
    if(path.indexOf('/')!==0) {
        path = '/' + path;
    }
    var a = cache.get(host, 'fs');
    if(a) {
        a[path] = fs;
    }
}

function addroute(host, path, method, fn) {
    if(path.indexOf('/')!==0) {
        path = '/' + path;
    }
    var a = cache.get(host, 'route');
    if(a) {
        if(!a[path]) {
            a[path] = {};
        }
        a[path][method] = fn;
    }
}

function query(host, dir, method) {
    if(dir.indexOf('/')!==0) {
        dir = '/' + dir;
    }
    var a = cache.get(host, 'route');
    if(a && a[dir] && a[dir][method]) {
        return {
            type: 'route',
            result: a[dir][method]
        };
    }
    a = cache.get(host, 'fs');
    var i;
    if(a) {
        for(i in a) {
            if(a.hasOwnProperty(i)) {
                if(dir.indexOf(i)===0) {
                    return {
                        type: 'fs',
                        result: path.join(a[i], dir.substr(i.length, dir.length))
                    };
                }
            }
        }
    }
}

function checkhost(host) {
    var a = cache.get(host, 'fs');
    var b = cache.get(host, 'route');
    if(typeof a === 'undefined' || typeof b === 'undefined') {
        return false;
    } else {
        return true;
    }
}

module.exports = {
    addhost: addhost,
    addfs: addfs,
    addroute: addroute,
    query: query,
    checkhost: checkhost
};
