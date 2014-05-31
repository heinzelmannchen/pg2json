var pub = {},
    TABLE_INFORMATIONS_TABLE = 'information_schema.tables',
    TABLE_SCHEMA = 'public',
    TABLE_TYPE = 'BASE TABLE',
    TABLE_INFORMATIONS_COLUMS = ['table_name', 'table_schema'],
    Q, Knex, columns, relations;

module.exports = function ($inject) {
    $inject = $inject || {};
    Q = $inject.Q;
    Knex = $inject.Knex;
    columns = $inject.columns;
    relations = $inject.relations;

    return pub;
};

pub.get = function(tableName) {
    var q = Q.defer();
    pub.getMetadata(tableName)
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

pub.getMetadata = function(tableNames) {
    var settings = Knex.knex.client.connectionSettings,
        whereCriteria = {
            table_schema: TABLE_SCHEMA,
            table_type: TABLE_TYPE
        },
        query = Knex.knex(TABLE_INFORMATIONS_TABLE);
    
    if (settings.client === 'mysql') {
        whereCriteria.table_schema = Knex.knex.client.connectionSettings.database;
    }
    if (settings.schema) {
        whereCriteria.table_schema = settings.schema;
    }

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
