var Q = require('q'),
    Knex = require('knex'),
    _ = require('underscore'),
    columns = require('./columns'),
    me = module.exports,
    TABLE_INFORMATIONS_TABLE = 'information_schema.tables',
    TABLE_SCHEMA = 'public',
    TABLE_TYPE = 'BASE TABLE',
    TABLE_INFORMATIONS_COLUMS = ['table_name', 'table_schema'];

me.getTables = function() {
    var q = Q.defer();

    me.getNamesAndSchema()
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

me.getNamesAndSchema = function() {
    return Knex.knex(TABLE_INFORMATIONS_TABLE)
        .where({
            table_schema: TABLE_SCHEMA
        })
        .andWhere({
            table_type: TABLE_TYPE
        })
                .select(TABLE_INFORMATIONS_COLUMS);
};