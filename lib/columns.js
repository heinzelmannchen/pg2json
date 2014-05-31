var pub = {},
    COLUMNS_TABLE = 'information_schema.columns',
    TABLE_NAME = 'table_name',
    COLUMNS = [
        'column_name',
        'data_type',
        'column_default',
        'is_nullable',
        'character_maximum_length',
        'numeric_precision'
    ],
    MAP_DATATYPES_FROM = 'pg',
    MAP_DATATYPES_TO = 'heinzel',
    Q, _, Knex, dataTypes;

module.exports = function ($inject) {
    $inject = $inject || {};
    _ = $inject._;
    Q = $inject.Q;
    Knex = $inject.Knex;
    dataTypes = $inject.dataTypes;

    return pub;
};

pub.get = function(tableName) {
    var q = Q.defer();
    if (pub.hasTable(tableName)) {
        pub.getColumns(tableName)
            .then(function (columns) {
                if (dataTypes && typeof dataTypes.map === 'function') {
                    return mapDataTypes(columns);
                } else {
                    q.resolve(columns);
                }
            })
            .then(function(mappedColumns){
                q.resolve(mappedColumns);
            });
    } else {
        q.reject('table ' + tableName + 'doesn\'t exist');
    }
    return q.promise;
};

function mapDataTypes(columns){
    var q = Q.defer(),
        promises = [];

    _.map(columns, function(column){
        promises.push(dataTypes.map(column.data_type, MAP_DATATYPES_FROM, MAP_DATATYPES_TO)
            .then(function(heinzelDataType){
                column.data_type = heinzelDataType;
            })
            .catch(function(error){
                console.log(error);
            }));
    });

    Q.allSettled(promises)
        .then(function(){
            q.resolve(columns);
        })
        .catch(function(error){
            q.reject(error);
        });

    return q.promise;
}

pub.hasTable = function(tableName) {
    return Knex.knex.schema.hasTable(tableName);
};

pub.getColumns = function(tableName) {
    return Knex.knex(COLUMNS_TABLE)
        .where(TABLE_NAME, '=', tableName)
        .select(COLUMNS);
};
