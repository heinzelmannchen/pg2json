require('../../lib/connection').connect('./integrationTests/db/db-config.json')
    .then(function(knex) {
        knex.schema.hasTable('heinzel').then(function(exists) {
            if (!exists) {
                return knex.schema.createTable('heinzel', function(t) {
                    t.increments('id').primary();
                    t.string('name', 100);
                    t.string('hat_color', 100);
                    t.text('age');
                });
            }
        });
    })
    .catch(function(error) {
        console.error(error);
    });
