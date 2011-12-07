module.exports = {
    pre: [
        function(request, response, next) {
            if(request.headers.cookie) {
                request.cookie = this.cookieParser(request.headers.cookie);
            } else {
                request.cookie = {};
            }
            next();
        }
    ],
    app: {
        "cookieParser": function(cookie_str) {
            var tmp1 = cookie_str.split(/[;,] */g),
            tmp2,
            i=0,
            l=tmp1.length,
            ret={};
            for(;i<l;i++) {
                tmp2 = tmp1[i].split('=');
                ret[tmp2[0].trim().replace(/^[\'\"]+/g, '').replace(/[\'\"]+$/g, '')] = tmp2[1].trim().replace(/^[\'\"]+/g, '').replace(/[\'\"]+$/g, '');
            }
            return ret;
        }
    }
};

