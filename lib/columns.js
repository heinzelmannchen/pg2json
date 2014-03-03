var Q = require('q'),
    knex = require('Knex').knex,
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
    console.log(knex);
    return knex.schema.hasTable(tableName);
};

