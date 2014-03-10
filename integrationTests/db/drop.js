require('../../lib/connection').connect('./integrationTests/db/db-config.json')
    .then(function(knex) {
        drop('heinzel');
        drop('gender');
        drop('occupation');
    return;
});


function drop(tableName) {
    knex.schema.hasTable(tableName).then(function(exists) {
        if (exists) {
            return knex.schema.dropTable(tableName);
        }
    }).catch(function(error) {
        console.warn(tableName + ' couldn\'t be dropped: ' + error);
    });
}