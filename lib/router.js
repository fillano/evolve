var routes = {};

function addhost(host) {
    host = host || 'default';
    if(!routes[host]) {
        route[host] = {
            fs: [],
            route: {}
        };
    }
}

function addfs(host, path, fs) {
    if(path.indexOf('/')!==0) path = '/' + path;
    if(routes[host] && routes[host]['fs']) {
        routes[host]['fs'].push({(path) : fs});
    }
}

function addroute(host, path, method, fn) {
    if(path.indexOf('/')!==0) path = '/' + path;
    if(routes[host] && routes[host]['route']) {
        if(!routes[host]['route'][path]) routes[host]['route'][path] = {};
        routes[host]['route'][path][method] = fn;
    }
}

function query(host, path, method) {
    if(path.indexOf('/')!==0) path = '/' + path;
    if(routes[host] && routes[host]['route'] && routes[host]['route'][path] && routes[host]['route'][path][method]) {
        return {
            type: 'route',
            result: routes[host]['route'][path][method]
        };
    }
    
}

function dispatch(req, res) {

}
