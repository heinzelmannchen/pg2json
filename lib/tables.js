var Q = require('q'),
    Knex = require('knex'),
    columns = require('./columns'),
    me = module.exports,
    TABLE_INFORMATIONS_TABLE = 'information_schema.tables',
    TABLE_SCHEMA = 'public',
    TABLE_TYPE = 'BASE TABLE',
    TABLE_INFORMATIONS_COLUMS = ['table_name', 'table_schema'];

me.get = function(tableName) {
    var q = Q.defer();

    me.getMetadata(tableName)
        .then(function(tables) {
            var promises = [];
            tables.forEach(function(table, index, array) {
                promises.push(columns.get(table.table_name)
                    .then(function(columns) {
                        table.columns = columns;
                    }));
            });
            Q.allSettled(promises)
                .then(function() {
                    q.resolve(tables);
                });
        });

    return q.promise;
};

me.getMetadata = function(tableName) {
    var whereCriteria = {
            table_schema: TABLE_SCHEMA,
            table_type: TABLE_TYPE
        };

    if (tableName){
        whereCriteria.table_name = tableName;
    }

    return Knex.knex(TABLE_INFORMATIONS_TABLE)
        .where(whereCriteria)
        .select(TABLE_INFORMATIONS_COLUMS);
};