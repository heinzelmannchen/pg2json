var Q = require('q'),
    Knex = require('knex'),
    columns = require('./columns'),
    relations = require('./relations'),
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
                promises.push(setColumns(table));
                promises.push(setRelations(table));
            });
            Q.allSettled(promises)
                .then(function() {
                    q.resolve(tables);
                });
        });

    return q.promise;
};

me.getMetadata = function(tableNames) {
    var whereCriteria = {
            table_schema: TABLE_SCHEMA,
            table_type: TABLE_TYPE
        },
        query = Knex.knex(TABLE_INFORMATIONS_TABLE);

    if (typeof tableNames === 'string'){
        whereCriteria.table_name = tableNames;
        query = query.where(whereCriteria);
    } else if (tableNames instanceof Array){
        query = query.where(whereCriteria)
                     .andWhere(function(){
                            this.whereIn('table_name', tableNames);
                        });
    } else {
        query = query.where(whereCriteria);
    }

    return query
        .select(TABLE_INFORMATIONS_COLUMS);
};

function setColumns(table){
    var q = Q.defer();
    columns.get(table.table_name)
        .then(function(columns) {
            table.columns = columns;
            q.resolve(table);
        });
    return q.promise;
}

function setRelations(table){
    var q = Q.defer();
    relations.get(table.table_name)
        .then(function(relations){
            table.relations = relations;
            q.resolve(table);
        });
    return q.promise;
}
