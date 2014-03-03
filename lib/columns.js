var Q = require('q'),
    conn = require('./connection').getConn(),
    me = module.exports;

me.get = function(tableName) {
    var q = Q.defer();
    if (me.hasTable(tableName)) {
        q.resolve(['name', 'age', 'hat']);
    } else {
        q.reject();
    }
    return q.promise;
};

me.hasTable = function(tableName) {
    return conn.schema.hasTable(tableName);
};

