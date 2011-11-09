var mysql = require('mysql');
var client = mysql.createClient({
    user: 'root',
    password: '5Rjs33Ek',
    host: '127.0.0.1',
    port: '3306',
    database: 'node_test'
});

function Wait(count, cb) {
    var limit = 0;
    var payload = [];
    this.next = function(data) {
        payload.push(data);
        count--;
        if(count<=0) {
            cb(payload);
        }
    }
}

module.exports = {
    "hello_mvc": function(view) {
        var data = {
            title: 'test swig template',
            rows: [
                {name: 'test name 1', email: 'name1@email.com'},
                {name: 'test name 2', email: 'name2@email.com'}
            ]
        };
        this.execute = function() {
            process.nextTick(function() {
                view.render(data);
            });
        }
    },
    "hello_mvc1": function(view) {
        var sync = new Wait(2, function(obj) {
            var i=0;
            var ret = {};
            for(; i<obj.length; i++) {
                if(obj[i] && obj[i].length>0) {
                    if(obj[i][0].title) {
                        ret.title = obj[i].title;
                    } else {
                        ret.rows = obj[i]
                    }
                }
            }
            client.end();
            view.render(ret);
        });
        this.execute = function() {
            client.query("SELECT `value` as title FROM `configs` WHERE name='title'", function(err, results, fields) {
                if(!err) {
                    sync.next(results);
                } else {
                    console.log('err 1.');
                    sync.next([]);
                }
            });
            
            client.query("SELECT a.name AS `group`, b.name AS name, b.email AS email FROM groups AS a LEFT JOIN authors AS b ON b.group_id=a.id", function(err, results, fields) {
                if(!err) {
                    sync.next(results);
                } else {
                    console.log('err 2.');
                    sync.next([]);
                }
            });
        };
    },
    "hello_mvc2": function(view) {
        var data = {
            title: 'test swig template',
            rows: [
                {name: 'test name 1', email: 'name1@email.com'},
                {name: 'test name 2', email: 'name2@email.com'}
            ]
        };
        this.execute = function() {
            process.nextTick(function() {
                view.render(data);
            });
        }
    },
};
