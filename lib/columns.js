var Q = require('q'),
    Knex = require('knex'),
    me = module.exports,
    COLUMNS_TABLE = 'information_schema.columns',
    TABLE_NAME = 'table_name',
    COLUMNS = [
        'column_name',
        'data_type',
        'column_default',
        'is_nullable',
        'character_maximum_length',
        'numeric_precision'
    ];

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

me.getColumns = function(tableName) {
    return Knex.knex(COLUMNS_TABLE)
        .where(TABLE_NAME, '=', tableName)
        .select(COLUMNS);
};
