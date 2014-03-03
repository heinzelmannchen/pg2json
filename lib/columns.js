var Q = require('q'),
    Knex = require('knex'),
    me = module.exports;

me.get = function(tableName) {
    var q = Q.defer();
    if (me.hasTable(tableName)) {
        return me.getColumns(tableName);
    } else {
        q.reject();
    }
    return q.promise;
};

me.hasTable = function(tableName) {
    return Knex.knex.schema.hasTable(tableName);
};

/*
 *  SELECT column_name
 *  FROM information_schema."columns"
 *  WHERE "table_name"='TABLE-NAME'
 */
me.getColumns = function(tableName) {
    return Knex.knex('information_schema.columns')
        .where('table_name', '=', tableName)
        .column('column_name')
        .select();
};
