require('../../lib/connection').connect('./integrationTests/db/db-config.json')
    .then(function(knex) {
        drop(knex, 'heinzel');
        drop(knex, 'gender');
        drop(knex, 'occupation');
        return;
    });


function drop(knex, tableName) {
    knex.schema.hasTable(tableName).then(function(exists) {
        if (exists) {
            return knex.schema.dropTable(tableName);
        }
    }).catch(function(error) {
        console.warn(tableName + ' couldn\'t be dropped: ' + error);
    });
}