var Q = require('q'),
    Knex = require('knex'),
    me = module.exports;

me.getTables = function(){
    var q = Q.defer();

    return Knex.knex('information_schema.tables')
                 .where({ table_schema: 'public'})
                 .andWhere({ table_type: 'BASE TABLE' })
                 .select('table_name', 'table_schema');
};