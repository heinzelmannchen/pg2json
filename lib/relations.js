var Q = require('q'),
    Knex = require('knex'),
    me = module.exports,
    TABLE_REFERENTIAL_CONSTRAINTS = 'information_schema.referential_constraints as ref',
    COLUMNS = ['kcu1.constraint_name as fk_constraint_name',
              'kcu1.table_name as fk_table_name',
              'kcu1.column_name as fk_column_name',
              'kcu2.constraint_name as referenced_constraint_name',
              'kcu2.table_name as referenced_table_name',
              'kcu2.column_name as referenced_column_name'];

me.get = function(tableName) {
    var q = Q.defer();

    getDataRaw(tableName)
        .then(function(relations) {
            q.resolve(relations.rows);
        });
    /*getDataKnexified(tableName)
        .then(function(relations) {
            q.resolve(relations);
        });*/

    return q.promise;
};

function getDataRaw(tableName) {
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
}

function getDataKnexified(tableName) {
    var knex = Knex.knex,
        raw = knex.raw;

    return knex(raw(TABLE_REFERENTIAL_CONSTRAINTS))
        .join(raw('information_schema.key_column_usage as kcu1'), function() {
            this.on(raw('kcu1.constraint_catalog'), '=', raw('ref.constraint_catalog'))
                .andOn(raw('kcu1.constraint_schema'), '=', raw('ref.unique_constraint_schema'))
                .andOn(raw('kcu1.constraint_name'), '=', raw('ref.constraint_name'));
        })
        .join(raw('information_schema.key_column_usage as kcu2'), function() {
            this.on(raw('kcu2.constraint_catalog'), '=', raw('ref.constraint_catalog'))
                .andOn(raw('kcu2.constraint_schema'), '=', raw('ref.unique_constraint_schema'))
                .andOn(raw('kcu2.constraint_name'), '=', raw('ref.constraint_name'));
        })
        .where(raw('kcu1.table_name = ?', tableName))
        .select([raw(COLUMNS)]);
}