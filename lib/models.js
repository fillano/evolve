module.exports = {
    hello: function(view) {
        var data = {
            name: 'fillano'
        };
        this.execute = function() {
            process.nextTick(function() {
                view.render(data);
            });
        }
    }
};
