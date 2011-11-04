var hello = '<html><body>Hello: {%$name%}</body></html>';

var varParser = function(str, obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            var tmp = new RegExp('\\{%[ ]*\\$'+i+'[ ]*%\\}', 'g');
            str = str.replace(tmp, obj[i]);
        }
    }
    return str;
}

module.exports = {
    hello: function(cb) {
        this.render = function(obj) {
            cb(false, '/hello_mvc', {type: 'text/html', data: varParser(hello, obj)});
        };
    }
};