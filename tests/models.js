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
    }
};
