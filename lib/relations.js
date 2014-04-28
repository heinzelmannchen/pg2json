var pub = {},
    Q,
    Knex;

module.exports = function ($inject) {
    $inject = $inject || {};
    Q = $inject.Q;
    Knex = $inject.Knex;

    return pub;
};

pub.get = function(tableName) {
    var q = Q.defer();

    pub.getMetadata(tableName)
        .then(function(relations) {
            q.resolve(relations.rows);
        });

    return q.promise;
};

pub.getMetadata = function(tableName) {
    return Knex.knex.raw('SELECT ' +
                             'KCU1.CONSTRAINT_NAME AS FK_CONSTRAINT_NAME, ' +
                             'KCU1.COLUMN_NAME AS FK_COLUMN_NAME, ' +
                             'KCU2.CONSTRAINT_NAME AS REFERENCED_CONSTRAINT_NAME, ' +
                             'KCU2.TABLE_NAME AS REFERENCED_TABLE_NAME, ' +
                             'KCU2.COLUMN_NAME AS REFERENCED_COLUMN_NAME ' +
                             'FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS AS RC ' +
                         'INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KCU1 ' +
                             'ON KCU1.CONSTRAINT_CATALOG = RC.CONSTRAINT_CATALOG ' +
                             'AND KCU1.CONSTRAINT_SCHEMA = RC.CONSTRAINT_SCHEMA ' +
                             'AND KCU1.CONSTRAINT_NAME = RC.CONSTRAINT_NAME ' +
                         'INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KCU2 ' +
                             'ON KCU2.CONSTRAINT_CATALOG = RC.UNIQUE_CONSTRAINT_CATALOG ' +
                             'AND KCU2.CONSTRAINT_SCHEMA = RC.UNIQUE_CONSTRAINT_SCHEMA ' +
                             'AND KCU2.CONSTRAINT_NAME = RC.UNIQUE_CONSTRAINT_NAME ' +
                             'AND KCU2.ORDINAL_POSITION = KCU1.ORDINAL_POSITION ' +
                         'WHERE kcu1.table_name = ?', tableName);
};